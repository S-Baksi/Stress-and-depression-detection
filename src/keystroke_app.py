from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import pandas as pd

import keystrokes_prediction

app = Flask(__name__)
CORS(app)

model = load_model(".\lstm_model.keras")


@app.route("/predict-fatigue/keystrokes", methods=["POST"])
def predict_fatigue_using_keystrokes():

    data = request.get_json()

    keystrokes = data["keystrokes"]

    df = pd.DataFrame(keystrokes)

    result = keystrokes_prediction.predict_fatigue(
        keystrokes_df=df,
        model=model
    )

    return jsonify(result)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5005,
        debug=True
    )