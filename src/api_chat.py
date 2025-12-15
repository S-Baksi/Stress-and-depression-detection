from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


app = Flask(__name__)
CORS(app)

SYSTEM_PROMPT = """
You are a health-focused conversational assistant.

STRICT RULES:
1. You ONLY answer questions related to health, mental health, emotional well-being, stress, anxiety, and depression.
2. If a user asks anything unrelated to health, politely refuse and guide them back to health topics.
3. You do NOT diagnose diseases.
4. You do NOT provide medical prescriptions.
5. You use calm, empathetic, and supportive language.
s
ASSESSMENT RECOMMENDATION RULE:
- If a user's message indicates possible stress, anxiety, or depression, you MUST recommend ONE or MORE relevant self-assessment form using a clickable hyperlink.
- If user query shows signs of multiple symptoms then recommend all the relevant assessment tests.

LINKS:
- Stress (health): http://localhost:5178/StressByHealth/form
- Stress (work/IT): http://localhost:5178/StressByWorklife/form
- Depression: http://localhost:5178/depression/form
- Anxiety: http://localhost:5178/anxiety/form

REFUSAL FORMAT:
"I'm here to help with health and well-being concerns only. Please feel free to ask about stress, anxiety, depression, or emotional health."

IMPORTANT:
- Never mention AI, models, probabilities, or internal logic.
- Never give medical diagnosis.
"""

HEALTH_KEYWORDS = [
    "stress", "anxiety", "depression", "mental", "panic",
    "sleep", "sad", "tired", "burnout", "fear",
    "mood", "emotion", "lonely", "work pressure"
]

def is_health_query(text: str) -> bool:
    return any(word in text.lower() for word in HEALTH_KEYWORDS)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_query = data.get("question", "").strip()

    if not user_query:
        return jsonify({"error": "Question is required"}), 400

    """
    if not is_health_query(user_query):
        return jsonify({
            "answer": "I'm here to help with health and well-being concerns only. Please feel free to ask about stress, anxiety, depression, or emotional health."
        })
     """
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_query}
            ],
            temperature=0.6
        )

        answer = response.choices[0].message.content

        return jsonify({
            "question": user_query,
            "answer": answer
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=9092)