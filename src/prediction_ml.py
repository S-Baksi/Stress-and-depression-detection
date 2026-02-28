import numpy as np
import pandas as pd
from scipy.signal import butter, filtfilt
import pickle
import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, 'rf_pred.pkl')

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
    
    def GenerateResult(self, EEGFeaturesCSVPath):
        df = pd.read_csv(EEGFeaturesCSVPath)
        channels = ["TP9", "AF7", "AF8", "TP10"]

        df_bandpower = self.eeg_to_bandpower(
            df[channels]
        )
        #df_bandpower.to_csv('EEGBandpowers_Testing.csv')
        
        df_features = self.aggregate_period_features(df_bandpower)
        #df_features.to_csv('EEGFeatures_Testing.csv')
        
        # Convert all columns to float64 to avoid dtype issues
        df_features = df_features.astype('float64')
        
        with open(MODEL_PATH, "rb") as f:
            loaded_artifact = pickle.load(f)

        rf_loaded = loaded_artifact["model"]
        _features = loaded_artifact["features"]
        X_test_loaded = df_features[_features].values  # Convert to numpy array
        y_pred = rf_loaded.predict(X_test_loaded)

        y_proba = rf_loaded.predict_proba(X_test_loaded)

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


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
def predict():
    """
    POST endpoint to predict fatigue level from uploaded EEG CSV file.
    
    Expects:
    - File upload with field name 'file'
    - CSV must contain columns: TP9, AF7, AF8, TP10
    
    Returns:
    - JSON with fatigue prediction results
    """
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({'error': 'File must be a CSV'}), 400
        
        # Save uploaded file to temporary location
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.csv')
        file.save(temp_file.name)
        temp_file.close()
        
        try:
            # Create prediction instance and generate result
            predictor = Prediction()
            result = predictor.GenerateResult(temp_file.name)
            
            # Clean up temporary file
            os.unlink(temp_file.name)
            
            # Convert DataFrame to JSON-serializable format
            bandpower_features = result["EEGBandPowerFeatures"].to_dict(orient='records')
            
            # Create descriptive message based on fatigue level
            fatigue_level = result["FatigueLevel"]
            probability = result["Probability"]
            probability_percent = round(probability * 100, 1)
            
            if fatigue_level == "Normal":
                message = f"Analysis shows normal mental state with {probability_percent}% confidence. No signs of significant fatigue detected."
                recommendation = "You are in a good mental state. Continue maintaining healthy sleep and work patterns."
            elif fatigue_level == "Fatigue":
                message = f"Moderate fatigue detected with {probability_percent}% confidence. Signs of mental tiredness are present."
                recommendation = "Consider taking short breaks and ensure adequate rest. Monitor your mental state."
            else:  # High Fatigue
                message = f"High fatigue level detected with {probability_percent}% confidence. Significant mental exhaustion identified."
                recommendation = "It is strongly recommended to rest immediately. Avoid demanding tasks and prioritize sleep."
            
            response_data = {
                'success': True,
                'fatigue_level': fatigue_level,
                'fatigue_status': fatigue_level.upper(),
                'probability': probability,
                'probability_percent': probability_percent,
                'confidence_score': f"{probability_percent}%",
                'message': message,
                'recommendation': recommendation,
                'interpretation': f"The person is classified as {fatigue_level} with a confidence score of {probability_percent}%.",
                'eeg_bandpower_features': bandpower_features
            }
            
            return jsonify(response_data), 200
            
        except Exception as e:
            # Clean up temporary file if it still exists
            if os.path.exists(temp_file.name):
                os.unlink(temp_file.name)
            raise e
        
    except ValueError as ve:
        return jsonify({'error': f'Invalid data: {str(ve)}'}), 400
    except FileNotFoundError as fe:
        return jsonify({'error': f'File not found: {str(fe)}'}), 404
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Fatigue Detection API is running'}), 200


if __name__ == '__main__':
    # Check if model file exists
    print(f"Looking for model file at: {MODEL_PATH}")
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model file 'rf_pred.pkl' not found at: {MODEL_PATH}")
        print(f"Current working directory: {os.getcwd()}")
        print(f"Script directory: {SCRIPT_DIR}")
        print("Please ensure the model file is in the src directory.")
        exit(1)
    else:
        print("✓ Model file found successfully!")
    
    print("\nStarting Fatigue Detection API...")
    print("API will be available at: http://localhost:5000")
    print("\nEndpoints:")
    print("  POST /predict - Upload EEG CSV file for fatigue prediction")
    print("  GET  /health  - Health check")
    
    app.run(debug=True, host='0.0.0.0', port=5000)