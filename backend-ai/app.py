from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image as keras_image
from ultralytics import YOLO
import google.generativeai as genai
import base64
import json
import logging
import uuid
import cv2
import base64
from werkzeug.utils import secure_filename
import re
from dotenv import load_dotenv
load_dotenv()

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

EXPECTED_KEYS = [
    "advice", "condition", "seriousness", "treatment_options",
    "recommended_products", "habits_to_avoid", "prevention_tips",
    "when_to_see_a_doctor", "emotional_support", "common_misconceptions",
    "lifestyle_adjustments", "natural_remedies", "summary"
]

# === Preprocess Image for Classifier ===
def preprocess_for_classifier(img_path):
    img = keras_image.load_img(img_path, target_size=(224, 224))
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

def classify_image(image_path):
    img_array = preprocess_for_classifier(image_path)
    predictions = classifier.predict(img_array)
    predicted_index = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_index])
    predicted_label = CLASS_NAMES[predicted_index]

    logging.info(f"Predictions: {predictions}")
    logging.info(f"Prediction: {predicted_label} (Confidence: {confidence:.2f})")
    
    return predicted_label, round(confidence, 2)

def run_yolo_detection(image_path):
    try:
        results = detector(image_path)

        if not results or not hasattr(results[0], 'plot'):
            logging.error("YOLO results are not in the expected format.")
            return None

        annotated_img = results[0].plot()  # This is a numpy array (BGR)
        return annotated_img

    except Exception as e:
        logging.error(f"Error in YOLO detection: {str(e)}")
        return None

# === Get Gemini Advice ===
def get_advice_from_gemini(condition_name):
    prompt = f"""
    A user uploaded a skin image, and the AI classified it as '{condition_name}'.

    Please act like a compassionate assistant helping a patient understand their skin condition. Your role is to provide supportive, non-medical advice in a warm, friendly, and clear tone. The goal is to educate and reassure the user, not to diagnose or replace professional care.

    Provide the response strictly in the following JSON format:

    {{
      "sections": [
        {{
          "key": "advice",
          "title": "Supportive Advice",
          "content": "Offer kind, helpful advice. Speak directly to the person in a supportive and human tone."
        }},
        {{
          "key": "condition",
          "title": "About This Condition",
          "content": "Explain what this condition generally is, how it affects people, and typical signs."
        }},
        {{
          "key": "seriousness",
          "title": "How Serious Is It?",
          "content": "Describe whether this condition is usually minor or could sometimes be more serious. Offer a calm explanation."
        }},
        {{
          "key": "treatment_options",
          "title": "Treatment Options",
          "content": "List typical over-the-counter treatments, skincare routines, or remedies people use."
        }},
        {{
          "key": "recommended_products",
          "title": "Recommended Products",
          "content": "Suggest common, widely available products that might help (e.g., gentle cleansers, creams, etc.)."
        }},
        {{
          "key": "habits_to_avoid",
          "title": "Habits to Avoid",
          "content": "Share daily habits or actions that could make the condition worse, and how to avoid them."
        }},
        {{
          "key": "prevention_tips",
          "title": "Prevention Tips",
          "content": "Offer tips for preventing this condition from returning or getting worse in the future."
        }},
        {{
          "key": "when_to_see_a_doctor",
          "title": "When to See a Doctor",
          "content": "List symptoms, warning signs, or situations when the user should definitely consult a dermatologist."
        }},
        {{
          "key": "emotional_support",
          "title": "Emotional Support",
          "content": "Reassure the user emotionally—remind them that they are not alone and it's okay to feel concerned."
        }},
        {{
          "key": "common_misconceptions",
          "title": "Common Misconceptions",
          "content": "Clear up popular myths or misunderstandings about this condition in simple terms."
        }},
        {{
          "key": "lifestyle_adjustments",
          "title": "Lifestyle Adjustments",
          "content": "Offer guidance on diet, stress, sleep, or hygiene changes that might help."
        }},
        {{
          "key": "natural_remedies",
          "title": "Natural Remedies",
          "content": "Share gentle home remedies that some people find helpful, but clarify they are not a substitute for medical care."
        }},
        {{
          "key": "summary",
          "title": "Summary",
          "content": "Wrap everything up in a kind, encouraging message. End with this disclaimer: 'Please remember, this is not a medical diagnosis. While AI can assist, it's always best to consult a certified dermatologist for a professional opinion.'"
        }}
      ]
    }}

    Please make sure each field is filled out clearly and thoroughly, using simple, non-technical language. Do not include any extra text—output only the JSON and nothing else.
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        response = model.generate_content(prompt)

        raw_text = response.text.strip()
        logging.info(f"Gemini raw response: {repr(raw_text)}")

        if not raw_text:
            logging.error("Empty response from Gemini")
            return None

        return raw_text

    except Exception as e:
        logging.error(f"Gemini API error: {e}")
        return None

# === Parse Gemini Response ===
def parse_gemini_response(response_text):
    try:
        cleaned = re.sub(r"^```(?:json)?\n*(.*?)\n*```$", r"\1", response_text.strip(), flags=re.DOTALL)
        data = json.loads(cleaned)
        sections = data.get("sections", [])

        sections_dict = {sec.get("key"): sec for sec in sections if sec.get("key")}

        for key in EXPECTED_KEYS:
            if key not in sections_dict:
                sections_dict[key] = {
                    "key": key,
                    "title": key.replace("_", " ").title(),
                    "content": f"No information available for {key.replace('_', ' ')}."
                }

        return {"sections": list(sections_dict.values())}

    except Exception as e:
        logging.error(f"Failed to decode Gemini response: {e}")
        return {
            "sections": [{
                "key": "error",
                "title": "Error",
                "content": "We couldn't generate full information at this time. Please try again later."
            }]
        }

# === Save Uploaded Image to Temporary File ===
def save_temp_image(file_storage, upload_dir='temp_uploads'):
    os.makedirs(upload_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.jpg"
    file_path = os.path.join(upload_dir, filename)
    file_storage.save(file_path)
    return file_path

# === Delete Temporary File ===
def remove_temp_image(file_path):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Temporary file deleted: {file_path}")
    except Exception as e:
        logging.warning(f"Failed to delete temporary file: {file_path} - {e}")

# === Detect with YOLOv8 ===
def detect_with_yolov8(image_path):
    try:
        results = detector(image_path)
        result = results[0]  # Take the first result object

        # === Annotated image (OpenCV image with boxes drawn)
        annotated_img = result.plot()  # This is a NumPy array (BGR)

        # === Encode image as base64
        _, buffer = cv2.imencode('.jpg', annotated_img)
        annotated_img_base64 = base64.b64encode(buffer).decode('utf-8')

        # === Parse detection boxes
        detections = []
        if result.boxes is not None:
            for i, box in enumerate(result.boxes):
                x, y, w, h = box.xywh[0]  # tensor -> 1 row
                label = detector.names[int(box.cls[0])]  # class name
                confidence = float(box.conf[0])

                detections.append({
                    "id": i,
                    "x": float(x),
                    "y": float(y),
                    "width": float(w),
                    "height": float(h),
                    "label": label,
                    "confidence": confidence
                })
        else:
            logging.info("No boxes detected by YOLO.")

        logging.info(f"Total detections: {len(detections)}")

        return detections, annotated_img_base64

    except Exception as e:
        logging.error(f"Error in YOLO detection: {e}")
        return [], ""

# === /predict Route ===
@app.route("/predict", methods=["POST"])
def predict():
    try:
        image_file = request.files["image"]
        image_path = save_temp_image(image_file)

        detections, base64_img = detect_with_yolov8(image_path)
        predicted_label, confidence = classify_image(image_path)

        gemini_raw = get_advice_from_gemini(predicted_label)
        parsed_gemini_response = parse_gemini_response(gemini_raw)

        # recommendations = get_recommendations_for_condition(predicted_label)


        remove_temp_image(image_path)

        return jsonify({
            "yolo_overlay": base64_img,
            "condition": predicted_label,
            "confidence": confidence,
            "gemini_advice": parsed_gemini_response,
            # "recommendations": recommendations,

            "detections": detections
        })
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    system_prompt = (
    "You are SkinxAI, an expert AI assistant specialized only in skincare, skin health, and beauty routines. "
    "You should not answer any questions unrelated to skincare. "
    "If the user asks something outside your domain (like tech, movies, or general knowledge), you must reply with: "
    "'I’m your AI skincare assistant! Let’s talk about skin 😊'\n\n"
    "Your responses should be well-structured, clear, and easy to read. Use the following guidelines:\n"
    "1. **Break your answers into sections** with clear, concise headings (e.g., 'Cleansing', 'Treatment', 'Lifestyle Tips').\n"
    "2. **Use bullet points or numbered lists** for steps or suggestions to make the content easy to follow.\n"
    "3. Avoid large blocks of text—keep each section short and focused.\n"
    "4. **Be clear and avoid technical jargon** unless necessary. Make sure the user can easily understand the advice.\n"
    "5. If you discuss multiple suggestions, clearly **label each step** or point (e.g., 'Step 1: Cleanse Twice a Day').\n"
    "6. Always end with a reminder of the importance of consistency and patience in skincare.\n\n"
    "Remember to always be friendly, helpful, and professional in your tone!\n\n"
    "If the user asks about specific products to use, provide general suggestions for types of products (e.g., cleansers, treatments, moisturizers) that are good for addressing acne or pimples. "
    "However, avoid naming any specific brands, and focus on the ingredients or types of products that can help."
)
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest')

        # Just send one combined prompt
        full_prompt = system_prompt + f"User: {user_message}"
        response = model.generate_content(full_prompt)

        raw_text = response.text.strip()
        logging.info(f"Chat response: {repr(raw_text)}")
        return jsonify({"reply": raw_text})

    except Exception as e:
        logging.error(f"Gemini API error: {e}")
        print("Gemini error:", e)
        return jsonify({"reply": "Sorry, I ran into a problem. Please try again later."}), 500


# === Run Server ===
if __name__ == '__main__':
    app.run(debug=True)
