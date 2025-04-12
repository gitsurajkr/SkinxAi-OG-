from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image as keras_image
from ultralytics import YOLO
import google.generativeai as genai
import base64
import json
import logging

# === Init Flask ===
app = Flask(__name__)
CORS(app)

# === Logging Setup ===
logging.basicConfig(level=logging.INFO)

# === Load MobileNetV2 Skin Classifier ===
CLASSIFIER_MODEL_PATH = 'model_v1.h5'
classifier = tf.keras.models.load_model(CLASSIFIER_MODEL_PATH)

# === Load YOLOv8 Model ===
YOLO_MODEL_PATH = 'yolov8/skinx-train/weights/best.pt'
detector = YOLO(YOLO_MODEL_PATH)

# === Load Class Names ===

def load_class_names(fallback_dir='dataset/train'):
    if not os.path.isdir(fallback_dir):
        raise FileNotFoundError(f"Fallback directory '{fallback_dir}' not found")

    class_names = sorted([
        d for d in os.listdir(fallback_dir)
        if os.path.isdir(os.path.join(fallback_dir, d))
    ])

    logging.info(f"Using class names from folders: {class_names}")
    return class_names


CLASS_NAMES = load_class_names()
logging.info(f"Loaded class names: {CLASS_NAMES}")

# === Gemini API Config ===
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# === Preprocess Image for Classifier ===
def preprocess_for_classifier(img_path):
    img = keras_image.load_img(img_path, target_size=(224, 224))
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

# === Get Gemini Advice ===
def get_advice_from_gemini(condition_name):
    prompt = f"""
    A user uploaded a skin image, and the AI classified it as '{condition_name}'.

    Please act like a compassionate assistant helping a patient understand their skin condition. Your role is to provide supportive, non-medical advice in a warm, friendly, and clear tone. The goal is to educate and reassure the user, not to diagnose or replace professional care.

    Provide the response strictly in the following JSON format:

    {{
      "advice": "Offer kind, helpful advice. Speak directly to the person in a supportive and human tone.",
      "condition": "Explain what this condition generally is, how it affects people, and typical signs.",
      "seriousness": "Describe whether this condition is usually minor or could sometimes be more serious. Offer a calm explanation.",
      "treatment_options": "List typical over-the-counter treatments, skincare routines, or remedies people use.",
      "recommended_products": "Suggest common, widely available products that might help (e.g., gentle cleansers, creams, etc.).",
      "habits_to_avoid": "Share daily habits or actions that could make the condition worse, and how to avoid them.",
      "prevention_tips": "Offer tips for preventing this condition from returning or getting worse in the future.",
      "when_to_see_a_doctor": "List symptoms, warning signs, or situations when the user should definitely consult a dermatologist.",
      "emotional_support": "Reassure the user emotionally—remind them that they are not alone and it's okay to feel concerned.",
      "common_misconceptions": "Clear up popular myths or misunderstandings about this condition in simple terms.",
      "lifestyle_adjustments": "Offer guidance on diet, stress, sleep, or hygiene changes that might help.",
      "natural_remedies": "Share gentle home remedies that some people find helpful, but clarify they are not a substitute for medical care.",
      "summary": "Wrap everything up in a kind, encouraging message. End with this disclaimer: 'Please remember, this is not a medical diagnosis. While AI can assist, it's always best to consult a certified dermatologist for a professional opinion.'"
    }}

    Please make sure each field is filled out clearly and thoroughly, using simple, non-technical language. Do not include any extra text—output only the JSON and nothing else.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        response = model.generate_content(prompt)
        return response.text.strip() if response.text else "No response from Gemini."
    except Exception as e:
        return f"Gemini error: {str(e)}"


# === Decode Base64 Image ===
def decode_base64_image(b64_image, file_path):
    try:
        if "base64," in b64_image:
            b64_image = b64_image.split("base64,")[-1]  # Remove any base64 prefix
        img_data = base64.b64decode(b64_image)
        with open(file_path, 'wb') as f:
            f.write(img_data)
        return True
    except Exception as e:
        logging.error(f"Base64 decoding error: {e}")
        return False

# === Predict Endpoint ===
@app.route('/predict', methods=['POST'])
def predict():
    file_path = None
    try:
        # Check for image data
        if 'image' in request.files:
            # Handle image file upload (multipart/form-data)
            file = request.files['image']
            if not file.mimetype.startswith('image/'):
                return jsonify({'error': 'Unsupported file type'}), 400

            os.makedirs('temp', exist_ok=True)
            file_path = f"temp/{uuid.uuid4().hex}.jpg"
            file.save(file_path)

        elif 'image' in request.json:
            # Handle base64 image
            b64_image = request.json['image']
            file_path = f"temp/{uuid.uuid4().hex}.jpg"
            if not decode_base64_image(b64_image, file_path):
                return jsonify({'error': 'Failed to decode base64 image'}), 400

        else:
            return jsonify({'error': 'No image uploaded'}), 400

        # === Step 1: Classify Skin Condition ===
        img_for_cls = preprocess_for_classifier(file_path)
        predictions = classifier.predict(img_for_cls)

        if predictions.shape[-1] > 1:
            predictions = tf.nn.softmax(predictions).numpy()

        logging.info(f"Predictions: {predictions}")  # Log predictions

        # Check if predictions are empty or invalid
        if predictions.size == 0:
            return jsonify({'error': 'Model prediction failed'}), 500

        pred_index = np.argmax(predictions[0])
        
        # Log CLASS_NAMES and check its length
        logging.info(f"CLASS_NAMES: {CLASS_NAMES}")
        if len(CLASS_NAMES) <= pred_index:
            return jsonify({'error': 'Prediction index out of bounds for class names'}), 500

        predicted_condition = CLASS_NAMES[pred_index]
        confidence_score = round(float(predictions[0][pred_index]), 2)

        logging.info(f"Prediction: {predicted_condition} (Confidence: {confidence_score})")

        # === Step 2: Detect with YOLOv8 ===
        yolo_results = detector(file_path)[0]
        detections = []
        CONF_THRESHOLD = 0.5

        for box in yolo_results.boxes:
            conf = float(box.conf.cpu().numpy()[0])
            if conf < CONF_THRESHOLD:
                continue
            coords = box.xyxy.cpu().numpy().astype(int)[0].tolist()
            detections.append({'bbox': coords, 'confidence': round(conf, 2)})

        # === Step 3: Annotate Image ===
        annotated_img_base64 = None
        try:
            annotated_img = yolo_results.plot()
            temp_annotated_path = f"temp/annotated_{uuid.uuid4().hex}.jpg"
            cv2.imwrite(temp_annotated_path, annotated_img)

            with open(temp_annotated_path, "rb") as f:
                annotated_img_base64 = base64.b64encode(f.read()).decode('utf-8')
            os.remove(temp_annotated_path)
        except Exception as e:
            logging.error(f"Annotation error: {str(e)}")

        # === Step 4: Get Gemini Advice ===
        advice = get_advice_from_gemini(predicted_condition)

        # === Final Output ===
        return jsonify({
            'condition': predicted_condition,
            'confidence': confidence_score,
            'detections': detections,
            'advice': advice,
            'annotated_image': annotated_img_base64
        })

    except Exception as e:
        logging.error(f"Server error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)


# === Run Server ===
if __name__ == '__main__':
    app.run(debug=True)
