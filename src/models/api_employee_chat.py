from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import shap
import pandas as pd
import os
import re

from groq import Groq
from sentence_transformers import SentenceTransformer
import faiss


client = Groq(api_key="sample api key")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def load_resources(excel_path="C:/Users/ASUS/OneDrive/Desktop/Stress-and-depression-detection/excels/resources.xlsx"):
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
            "Category": row["Category"],
            "Route": row["Route"]
        })

    embeddings = embedding_model.encode([d["text"] for d in docs])
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))
    return docs, index

RESOURCE_DOCS, RESOURCE_INDEX = load_resources()

# rag retrieval
def retrieve_resources(Query, top_k=2):
    query_embedding = embedding_model.encode([Query])

    _, indices = RESOURCE_INDEX.search(np.array(query_embedding), top_k)

    resources = []
    for idx in indices[0]:
        resources.append({
            "Topic": RESOURCE_DOCS[idx]["Topic"],
            "Category": RESOURCE_DOCS[idx]["Category"],
            "Route": RESOURCE_DOCS[idx]["Route"]
        })

    return resources


def generate_llm_explanation(EmployeeId, Query):
    try:
        df = pd.read_csv("C:/Users/ASUS/OneDrive/Desktop/Stress-and-depression-detection/excels/employee_monthly_fatigue_dataset_encoded.csv")
        print("Employee_Id", EmployeeId)
        print("Type",type(EmployeeId))
        emp_data = df.loc[df["employee_id"] == EmployeeId]
        print("employee data", emp_data)
        resources = retrieve_resources(Query)

        resource_block = "\n".join(
            [f"- {r['Topic']}: {r['Route']}" for r in resources]
        ) if resources else "No additional resources suggested."

        prompt = f"""
            You are a friendly occupational health assistant.

            You should answer the user's question naturally and if Health Assessment of user is provided then you use it.

            User Question:
            {Query}

            Health Assessment:
            {emp_data}

            Helpful Resources:
            {resource_block}

            Instructions:

            1. First answer the user's question directly.
            2. Use the health assessment only if it helps answer the question.
            3. Never mention words like "based on the assessment", "according to the data", or "AI detected".
            4. If no health assessment exists, politely recommend completing the Stress, Mental Fatigue and Ocular Fatigue assessments.
            5. If resources are provided, recommend them naturally and include their route path exactly as given (e.g. /resources) so the user can click to visit.
            6. Keep the response under 150 words.
            7. Sound conversational instead of robotic.
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

        llm_text = response.choices[0].message.content

        # Extract resource IDs from URLs like localhost:5173/resources/1
        id_pattern = re.compile(r'/resources/([\d]+)')
        seen = set()
        resource_links = []
        for r in resources:
            match = id_pattern.search(r["Route"])
            if match:
                rid = match.group(1)
                if rid not in seen:
                    seen.add(rid)
                    resource_links.append({
                        "id": rid,
                        "topic": r["Topic"],
                        "path": f"/resources/{rid}"
                    })

        return llm_text, resource_links

    except Exception as e:
        print("LLM Error:", e)
        return f"Sorry, I ran into an issue: {str(e)}", []


@app.route("/EmployeeChat", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:
        _request = request.get_json(force=True, silent=True)
        print("Received:", _request)

        if not _request or not isinstance(_request, dict):
            return jsonify({"error": "Invalid JSON body"}), 400

        data = _request.get("data", _request)
        if isinstance(data, str):
            data = _request

        employee_id = data.get("Employee_Id")
        query = data.get("Query")

        if not query:
            return jsonify({"error": "Query is required"}), 400

        llm_response, resource_links = generate_llm_explanation(employee_id, query)

        return jsonify({"Response": llm_response, "ResourceLinks": resource_links})

    except Exception as e:
        print("Route Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=9091, debug=True)
