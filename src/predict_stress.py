from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import shap
from datetime import datetime

from groq import Groq
from sentence_transformers import SentenceTransformer


# =========================
# App Setup
# =========================
app = Flask(__name__)
CORS(app)


# =========================
# Load Model
# =========================
with open("C:/Users/ASUS/OneDrive/Desktop/projects/Stress-and-depression-detection/src/stress_xgb_model.pkl", "rb") as f:
    artifact = pickle.load(f)

model = artifact["model"]
explainer = shap.TreeExplainer(model)


# =========================
# Feature Order (MODEL)
# =========================
FEATURE_NAMES = [
    'Age',
    'Blood_Sugar_Level',
    'Blood_Pressure',
    'Cholesterol_Level',
    'Bed_Time_Numeric',
    'Alcohol_Intake',
    'Caffeine_Intake',
    'Travel_Time',
    'Wake_Up_Time_Numeric',
    'Work_Hours'
]


# =========================
# Time Conversion (24-hr)
# =========================
def time24_to_minutes(time_str):
    """
    Converts 'HH:MM' (24-hour format) → minutes from midnight
    """
    try:
        t = datetime.strptime(time_str.strip(), "%H:%M")
        return t.hour * 60 + t.minute
    except ValueError:
        raise ValueError("Time must be in 'HH:MM' 24-hour format")


# =========================
# SHAP Insights (Top-3)
# =========================
def extract_shap_insights(shap_values, top_k=3):
    """
    Returns top_k risk-increasing and risk-decreasing factors
    ordered by SHAP strength
    """
    sorted_items = sorted(shap_values.items(), key=lambda x: x[1])

    risk_decreasing = [k for k, v in sorted_items if v < 0][:top_k]
    risk_increasing = [k for k, v in reversed(sorted_items) if v > 0][:top_k]

    return risk_increasing, risk_decreasing


# =========================
# Prediction API
# =========================
@app.route("/PredictStress", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body required"}), 400

        input_data = []
        features = {}

        for feature in FEATURE_NAMES:
            if feature == "Bed_Time_Numeric":
                if "Bed_Time" not in data:
                    return jsonify({"error": "Missing field: Bed_Time"}), 400
                value = time24_to_minutes(data["Bed_Time"])

            elif feature == "Wake_Up_Time_Numeric":
                if "Wake_Up_Time" not in data:
                    return jsonify({"error": "Missing field: Wake_Up_Time"}), 400
                value = time24_to_minutes(data["Wake_Up_Time"])

            else:
                if feature not in data:
                    return jsonify({"error": f"Missing field: {feature}"}), 400
                value = float(data[feature])

            input_data.append(value)
            features[feature] = value

        X = np.array(input_data).reshape(1, -1)

        # =========================
        # Prediction
        # =========================
        proba = model.predict_proba(X)[0]
        pred_class = int(np.argmax(proba))
        probability = round(float(np.max(proba)), 2)
        prediction_label = "Normal" if pred_class == 0 else "Stress"

        # =========================
        # SHAP Explanation
        # =========================
        shap_vals = explainer.shap_values(X)

        if isinstance(shap_vals, list):
            shap_vals = shap_vals[pred_class]

        shap_vals = np.array(shap_vals)

        if shap_vals.ndim == 3:
            shap_vals = shap_vals[:, :, pred_class]

        shap_vals = shap_vals.reshape(1, -1)

        shap_dict = {
            FEATURE_NAMES[i]: float(shap_vals[0, i])
            for i in range(len(FEATURE_NAMES))
        }

        risk_inc, risk_dec = extract_shap_insights(shap_dict)

        # =========================
        # Response
        # =========================
        return jsonify({
            "Response": {
                "prediction": prediction_label,
                "probability": probability,
                "features": features,
                "concerning_factors": risk_inc,
                "protective_factors": risk_dec
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# Run Server
# =========================
if __name__ == "__main__":
    app.run(port=9095, debug=True)