from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import shap
import pandas as pd
import os

from groq import Groq
from sentence_transformers import SentenceTransformer
import faiss


client = Groq(api_key="Groq_api_key")


app = Flask(__name__)
CORS(app)


with open("anxiety_xgb_tuned_model.pkl", "rb") as f:
    model = pickle.load(f)

explainer = shap.TreeExplainer(model)

FEATURE_NAMES = [
    "BMI_index", "Age", "skin_type", "A365", "M", "T",
    "A460", "Anadn", "delta", "Kv100", "Gender"
]


embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def load_resources(excel_path="resources.xlsx"):
    df = pd.read_excel(excel_path)
    docs = []

    for _, row in df.iterrows():
        text = f"""
        Topic: {row['Topic']}
        Category: {row['Category']}
        Summary: {row['Summary']}
      
        """
        docs.append({
            "text": text,
            "Topic": row["Topic"],
            "Category": {row['Category']},
            "Route": row["Route"]
        })

    embeddings = embedding_model.encode([d["text"] for d in docs])
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))
    print("docs ", docs)
    print("index",index)
    return docs, index

RESOURCE_DOCS, RESOURCE_INDEX = load_resources()


def extract_shap_insights(shap_values, top_k=5):
    sorted_items = sorted(shap_values.items(), key=lambda x: x[1])

    
    risk_increasing = [k for k, v in sorted_items[-top_k:] if v > 0]

   
    risk_decreasing = [k for k, v in sorted_items[:top_k] if v < 0]

    return risk_increasing, risk_decreasing

# rag retrieval
def retrieve_resources(risk_increasing, top_k=2):
    query = f"Indicators related to anxiety {', '.join(risk_increasing)}"
    query_embedding = embedding_model.encode([query])

    _, indices = RESOURCE_INDEX.search(np.array(query_embedding), top_k)

    resources = []
    for idx in indices[0]:
        resources.append({
            "Topic": RESOURCE_DOCS[idx]["Topic"],
            "Category": RESOURCE_DOCS[idx]["Category"],
            "Route": RESOURCE_DOCS[idx]["Route"]
        })

    return resources


def generate_llm_explanation(result):
    try:
        risk_increasing, risk_decreasing = extract_shap_insights(result["shap_values"])
        resources = retrieve_resources(risk_increasing)

        resource_block = "\n".join(
            [f"- {r['Topic']}: {r['Route']}" for r in resources]
        ) if resources else "No additional resources suggested."

        prompt = f"""
You are a friendly health assistant.

Rules:
- Do not diagnose diseases.
- Do not mention AI, ML, SHAP, or probabilities.
- Use simple and formal language.
- Avoid any gender or skin type explanation.
- Recommend only the provided resource routes.


Explanation of different parameters:
- M : Microcirculation index, indicating the average
perfusion of microvessels (in PU).

- A365: Backscatter amplitude at the laser source wave
length for NADH excitation

- T: Temperature at the fingertip skin, recorded by the temperature sensor in the optical device.
It reflects how warm or cold the skin surface is at the measurement area.


- A460: NADH levels change when metabolic activity changes

- Anadn: Adn captures changes in metabolic + neurogenic activity.

- delta: Meansquaredeviation of blood flow oscillation
amplitude (in PU).	Higher delta  more variation in blood flow , •	Lower delta  stable or suppressed blood flow signal.

- Kv100: Coefficient of blood flow variability.

Health assessment result: {result['prediction']}

Factors supporting Normal health:
{risk_decreasing}

Factors leading to anxiety conditions:
{risk_increasing}

Helpful resources available in the app:
{resource_block}

Explain:
1. What this result means.
2. What is going well.
3. What to be mindful of.
4. How different factors are affecting the result.
5. Gently suggest relevant resources using the exact routes.
6. Never give any explanation based on gender or skin types.
7. End with a reassuring message.
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a calm and reassuring health assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=600
        )

        return response.choices[0].message.content

    except Exception as e:
        print("LLM Error:", e)
        return None


@app.route("/PredictAnxiety", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "JSON body required"}), 400

        input_data = []
        features = {}

        for feature in FEATURE_NAMES:
            if feature not in data:
                return jsonify({"error": f"Missing field: {feature}"}), 400
            value = float(data[feature])
            input_data.append(value)
            features[feature] = value

        X = np.array(input_data).reshape(1, -1)

        proba = model.predict_proba(X)[0]
        pred_class = int(np.argmax(proba))
        probability = round(float(np.max(proba)), 2)

        prediction_label = "Normal" if pred_class == 0 else "Anxiety"

        shap_vals = explainer.shap_values(X)
        if isinstance(shap_vals, list):
            shap_vals = shap_vals[1]

        shap_dict = {
            FEATURE_NAMES[i]: float(shap_vals[0][i])
            for i in range(len(FEATURE_NAMES))
        }

        ml_result = {
            "prediction": prediction_label,
            "probability": probability,
            "features": features,
            "shap_values": shap_dict
        }

        llm_response = generate_llm_explanation(ml_result)

        return jsonify({
            "prediction": prediction_label,
            "explanation": llm_response
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=9094, debug=True)