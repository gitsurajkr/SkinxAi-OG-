from ultralytics import YOLO

# Step 1: Initialize a new model using the default YOLOv8n (nano) architecture
model = YOLO("yolov8n.yaml")  

# Step 2: Train the model on your dataset using the data.yaml config
results = model.train(
    data="dataset/data.yaml",  # ← points to your dataset config
    epochs=50,                             # ← number of training epochs
    imgsz=640,                             # ← image size (default is 640x640)
    batch=16,                              # ← batch size (adjust based on your GPU/Colab)
    project="yolov8",                      # ← folder where logs/models are saved
    name="skinx-train",                    # ← subfolder name for this run
    exist_ok=True                          # ← don't raise error if folder already exists
)
