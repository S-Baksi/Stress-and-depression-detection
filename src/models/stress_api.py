import pickle
import numpy as np
import pandas as pd
import test_stress_model as stress_pred

from flask import Flask, render_template, request, jsonify


app = Flask(__name__)
@app.route("/getstressprediction", methods=["POST"])
def stressprediction():
    try :
        _request = request.get_json()
        if not _request:
            return {
            "PredictedClass" : None,
            "PredictedClassCode": None
        }
        _features = _request["data"].get("Features")
        (
        _predicted_class,
        _predicted_class_code,
        _stress_features,
        _protective_features
    ) = stress_pred.predict_stress(_features)

        return {
            "PredictedClass": _predicted_class,
            "PredictedClassCode": _predicted_class_code,
            "StressFactors": _stress_features.to_dict(orient="records"),
            "ProtectiveFactors": _protective_features.to_dict(orient="records")
        }

    except Exception as ex:
        print(str(ex))
        return {
            "PredictedClass": None,
            "PredictedClassCode": None,
            "StressFactors": [],
            "ProtectiveFactors": []
        }
if __name__ == "__main__":
    app.run(debug=True, port = 5005)