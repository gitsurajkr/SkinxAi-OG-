import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers.schedules import CosineDecay
# import os
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import numpy as np
import json
import cv2
import tensorflow_model_optimization as tfmot

# Paths
train_path = 'dataset/train'
val_path = 'dataset/valid'
test_path = 'dataset/test'

# Image params
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# Data generators
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.15,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.15,
    horizontal_flip=True, 
    fill_mode="nearest"
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_gen = train_datagen.flow_from_directory(
    train_path,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=True
)

val_gen = val_datagen.flow_from_directory(
    val_path,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

test_gen = val_datagen.flow_from_directory(
    test_path,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

# Functional API model
inputs = tf.keras.Input(shape=(224, 224, 3))
base_model = MobileNetV2(include_top=False, input_tensor=inputs, weights='imagenet')

# Fine-tune last 20 layers
for layer in base_model.layers[:-20]:
    layer.trainable = False
for layer in base_model.layers[-20:]:
    layer.trainable = True

x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(train_gen.num_classes, activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)
model.summary()

# Learning rate schedule
initial_lr = 0.001
steps_per_epoch = len(train_gen)
lr_schedule = CosineDecay(
    initial_learning_rate=initial_lr,
    decay_steps=steps_per_epoch * 30,
    alpha=0.1
)

# Compile model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=lr_schedule),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# Train model
EPOCHS = 30
print("\n🚀 Training started...\n")
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS,
    callbacks=[early_stop]
)

# Learning rate plot
lrs = [lr_schedule(step).numpy() for step in range(steps_per_epoch * EPOCHS)]
plt.plot(lrs)
plt.title("Learning Rate Schedule (Cosine Decay)")
plt.xlabel("Training Step")
plt.ylabel("LR")
plt.savefig("lr_schedule_plot.png")
plt.close()

# Training history plots
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train Acc')
plt.plot(history.history['val_accuracy'], label='Val Acc')
plt.title('Accuracy Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Loss Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.savefig("training_plot.png")
plt.close()

# Evaluate on test set
print("\n🧪 Evaluating on test data...")
loss, accuracy = model.evaluate(test_gen)
print(f"\n🏁 Final Test Accuracy: ✅ {accuracy * 100:.2f}%")

# Predictions
y_pred = model.predict(test_gen)
y_pred_classes = np.argmax(y_pred, axis=1)
y_true = test_gen.classes
class_labels = list(test_gen.class_indices.keys())

# Confusion matrix
cm = confusion_matrix(y_true, y_pred_classes, labels=list(range(len(class_labels))))
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=class_labels, yticklabels=class_labels)
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('True')
plt.tight_layout()
plt.savefig("confusion_matrix.png")
plt.close()

# Classification report
print("\n📄 Classification Report:\n")
report = classification_report(
    y_true, y_pred_classes, target_names=class_labels, labels=list(range(len(class_labels)))
)
print(report)

# Save metrics
metrics = {
    "test_accuracy": f"{accuracy * 100:.2f}%",
    "classes": class_labels,
    "confusion_matrix": cm.tolist(),
    "classification_report": report
}
with open("metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)

with open("class_indices.json", "w") as f:
    json.dump(train_gen.class_indices, f, indent=4)

with open("history.json", "w") as f:
    json.dump(history.history, f, indent=4)

# Grad-CAM
sample_img, _ = test_gen[0]
sample_input = np.expand_dims(sample_img[0], axis=0)
_ = model.predict(sample_input)

# Dynamically get last conv layer
last_conv_layer_name = None
for layer in reversed(base_model.layers):
    if isinstance(layer, tf.keras.layers.Conv2D):
        last_conv_layer_name = layer.name
        break
print(f"\n🔥 Using last conv layer for Grad-CAM: {last_conv_layer_name}")

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[
            base_model.get_layer(last_conv_layer_name).output,
            model.output
        ]
    )
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(predictions[0])
        class_channel = predictions[:, pred_index]

    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

heatmap = make_gradcam_heatmap(sample_input, model, last_conv_layer_name)

img = sample_img[0]
heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
heatmap = np.uint8(255 * heatmap)
heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
superimposed_img = heatmap * 0.4 + (img * 255)
cv2.imwrite("gradcam_output.jpg", np.uint8(superimposed_img))

# Save model
model.save('skin_model_final.h5')
print("\n✅ Model saved as skin_model_final.h5")

# Quantize and export
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()
with open("skin_model_quantized.tflite", "wb") as f:
    f.write(tflite_model)

print("\n📦 Quantized model saved as skin_model_quantized.tflite")
