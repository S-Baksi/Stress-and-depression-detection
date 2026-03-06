import numpy as np
import pandas as pd
from scipy.signal import butter, filtfilt
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

class Prediction:

    # ---------------------------------------------------------
    # Bandpass Filter
    # ---------------------------------------------------------
    def butter_bandpass(self, lowcut, highcut, fs, order=4):
        nyq = 0.5 * fs
        low = lowcut / nyq
        high = highcut / nyq
        b, a = butter(order, [low, high], btype="band")
        return b, a

    def bandpass_filter(self, signal, lowcut, highcut, fs):
        b, a = self.butter_bandpass(lowcut, highcut, fs)
        return filtfilt(b, a, signal)


    # ---------------------------------------------------------
    # 2-sec non-overlapping windows
    # ---------------------------------------------------------
    def segment_signal_multichannel(self, signal, window_size):

        windows = []
        for i in range(0, len(signal) - window_size + 1, window_size):
            windows.append(signal[i:i + window_size, :])

        return np.array(windows)


    # ---------------------------------------------------------
    # Band Power Extraction
    # ---------------------------------------------------------
    def eeg_to_bandpower(self, df_eeg):

        FS = 256
        WINDOW_SEC = 2
        WINDOW_SAMPLES = FS * WINDOW_SEC

        BANDS = {
            "delta": (0.5, 4),
            "theta": (4, 8),
            "alpha": (8, 13),
            "beta": (13, 30),
            "gamma": (30, 45)
        }

        signal = df_eeg.values

        if signal.shape[0] < WINDOW_SAMPLES:
            raise ValueError("EEG signal shorter than one window")

        signal = signal - signal.mean(axis=0)

        windows = self.segment_signal_multichannel(signal, WINDOW_SAMPLES)

        features = []

        for window in windows:
            row = []
            for ch in range(window.shape[1]):
                ch_signal = window[:, ch]

                for band in BANDS:
                    low, high = BANDS[band]
                    filtered = self.bandpass_filter(ch_signal, low, high, FS)
                    power = np.mean(filtered ** 2)
                    row.append(power)

            features.append(row)

        columns = [
            f"{band}_{ch}"
            for ch in df_eeg.columns
            for band in BANDS
        ]

        return pd.DataFrame(features, columns=columns)


    # ---------------------------------------------------------
    #  PERIOD LEVEL AGGREGATION
    # ---------------------------------------------------------
    def aggregate_period_features(self, df_bandpower):

        period_features = {}

        for col in df_bandpower.columns:

            values = df_bandpower[col].values

            period_features[f"{col}_mean"] = np.mean(values)
            period_features[f"{col}_std"] = np.std(values)
            period_features[f"{col}_min"] = np.min(values)
            period_features[f"{col}_max"] = np.max(values)

        #  band ratios (strong fatigue indicators)
        for ch in ["TP9", "AF7", "AF8", "TP10"]:
            period_features[f"theta_beta_ratio_{ch}"] = (
                np.mean(df_bandpower[f"theta_{ch}"]) /
                (np.mean(df_bandpower[f"beta_{ch}"]) + 1e-6)
            )

            period_features[f"alpha_beta_ratio_{ch}"] = (
                np.mean(df_bandpower[f"alpha_{ch}"]) /
                (np.mean(df_bandpower[f"beta_{ch}"]) + 1e-6)
            )

        return pd.DataFrame([period_features])
    
    def generate_result(self, eeg_features_csv_path):
        df = pd.read_csv(eeg_features_csv_path)
        channels = ["TP9", "AF7", "AF8", "TP10"]

        df_bandpower = self.eeg_to_bandpower(
            df[channels]
        )
        #df_bandpower.to_csv('EEGBandpowers_Testing.csv')
        
        df_features = self.aggregate_period_features(df_bandpower)
        #df_features.to_csv('EEGFeatures_Testing.csv')
        with open("C:/Users/ASUS/OneDrive/Desktop/projects/Stress-and-depression-detection/src/rf_pred.pkl", "rb") as f:
            loaded_artifact = pickle.load(f)

        rf_loaded = loaded_artifact["model"]

        # Features may have been saved as a tuple like:
        # (<StringDtype(...)>, array([...feature names...]))
        # or as a pandas Index/Series. Normalize to a simple list of strings.
        _features = loaded_artifact["features"]

        # Handle tuple case: keep only the array of feature names (2nd element)
        if isinstance(_features, tuple) and len(_features) == 2:
            _features = _features[1]

        # Convert pandas objects / numpy arrays / indexes to plain Python list
        try:
            _features = list(_features)
        except TypeError:
            # If for some reason it's already usable, just leave it as-is
            pass

        x_test_loaded = df_features[_features]
        y_pred = rf_loaded.predict(x_test_loaded)

        y_proba = rf_loaded.predict_proba(x_test_loaded)

        predicted_class_prob = y_proba[np.arange(len(y_pred)), y_pred]

        y_pred = int(y_pred[0])                 
        pred_prob = float(predicted_class_prob[0]) 

        class_map = {
            0: "Normal",
            1: "Fatigue",
            2: "High Fatigue"
        }

        class_name = class_map[y_pred]

        return {"EEGBandPowerFeatures":df_bandpower,"FatigueLevel":class_name,"Probability": pred_prob}


app = Flask(__name__)
CORS(app)


@app.route("/predict-fatigue", methods=["POST"])
def predict_fatigue():
    """
    Expected JSON:
    {
        "csv_path": "C:/path/to/eeg.csv"
    }
    """
    try:
        data = request.get_json(force=True, silent=True)
        
        if not data or "csv_path" not in data:
            print("Invalid request data:", data)
            return jsonify({
                "status": "error",
                "message": "csv_path is required"
            }), 400

        csv_path = data["csv_path"]

        predictor = Prediction()
        result = predictor.generate_result(csv_path)

        # Convert bandpower DF to JSON
        result["EEGBandPowerFeatures"] = (
            result["EEGBandPowerFeatures"]
            .round(6)
            .to_dict(orient="records")
        )

        return jsonify({
            "status": "success",
            "result": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "trace": traceback.format_exc()
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000, debug=True)