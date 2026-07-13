"""
Stress Level Prediction — final test script
=============================================
Only asks for the 14 features that actually survive feature selection in
stressfinal.pkl. All other raw columns the ColumnTransformer was originally
fit on are auto-filled with NaN placeholders (they get imputed internally,
then dropped by the mutual-information selector, so their value never
reaches the model).

Pipeline: raw input -> preprocessor (impute + one-hot) -> mutual-info mask
          -> StandardScaler -> PCA (9 components) -> RandomForestClassifier
"""

import pickle
import numpy as np
import pandas as pd
import sklearn
import shap

PICKLE_TRAINED_ON_SKLEARN = "1.6.1"
if sklearn.__version__ != PICKLE_TRAINED_ON_SKLEARN:
    print(f"[warning] This pickle was saved with scikit-learn {PICKLE_TRAINED_ON_SKLEARN}, "
          f"but you have {sklearn.__version__} installed. Results may differ slightly. "
          f"Fix with: pip install --upgrade scikit-learn=={PICKLE_TRAINED_ON_SKLEARN}\n")

with open("C:/Users/ASUS/OneDrive/Desktop/Stress-and-depression-detection/src/models/stressfinal.pkl", "rb") as f:
    package = pickle.load(f)

preprocessor  = package["preprocessor"]
mi            = package["mutual_information"]
scaler        = package["scaler"]
pca           = package["pca"]
model         = package["model"]
label_encoder = package["label_encoder"]
selected_features = package["selected_features"]
explainer = shap.TreeExplainer(model)

NUMERIC_COLS     = list(preprocessor.transformers_[0][2])   # 13 numeric raw cols
CATEGORICAL_COLS = list(preprocessor.transformers_[1][2])   # 8 categorical raw cols
RAW_COLUMNS      = NUMERIC_COLS + CATEGORICAL_COLS

# valid input ranges (soft — for warnings only, model will still run outside these)
NUMERIC_RANGES = {
    "Age":                  (18, 65),
    "Sleep_Duration":       (3, 10),
    "Sleep_Quality":        (1, 5),
    "Physical_Activity":    (0, 6),
    "Screen_Time":          (0, 8),
    "Caffeine_Intake":      (0, 5),
    "Alcohol_Intake":       (0, 3),
    "Work_Hours":           (4, 12),
    "Travel_Time":          (0, 6),
    "Social_Interactions":  (0, 7),
    "Blood_Pressure":       (90, 180),
    "Cholesterol_Level":    (150, 280),
    "Blood_Sugar_Level":    (70, 160),
}
VALID_BED_TIMES = [
    "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM", "12:30 AM",
    "1:00 AM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM",
    "9:00 PM", "9:30 PM",
]

REQUIRED_FEATURES = list(NUMERIC_RANGES.keys()) + ["Bed_Time"]


def _validate(user_input: dict):
    for feat, (lo, hi) in NUMERIC_RANGES.items():
        val = user_input.get(feat)
        if val is None:
            raise ValueError(f"Missing required feature: {feat}")
        if not (lo <= val <= hi):
            print(f"[warning] {feat}={val} is outside the typical training range [{lo}, {hi}] — "
                  f"prediction may be unreliable.")
    if user_input.get("Bed_Time") not in VALID_BED_TIMES:
        print(f"[warning] Bed_Time='{user_input.get('Bed_Time')}' was not seen during training "
              f"(expected one of {VALID_BED_TIMES}). It will be treated as 'not 11:30 PM'.")


def predict_stress(user_input: dict, verbose: bool = True):
    """
    user_input must contain exactly these 14 keys:
        Age, Sleep_Duration, Sleep_Quality, Physical_Activity, Screen_Time,
        Caffeine_Intake, Alcohol_Intake, Work_Hours, Travel_Time,
        Social_Interactions, Blood_Pressure, Cholesterol_Level,
        Blood_Sugar_Level, Bed_Time
    """
    missing = [c for c in REQUIRED_FEATURES if c not in user_input]
    if missing:
        raise ValueError(
            f"Missing required feature(s): {missing}\n"
            f"Required keys are exactly: {REQUIRED_FEATURES}\n"
            f"You provided keys: {list(user_input.keys())}\n"
            f"Check for typos or dropped keys in your input dict."
        )

    _validate(user_input)

    # build full raw row; unused columns (never reach the model) filled with NaN
    row = {c: user_input.get(c, np.nan) for c in NUMERIC_COLS}
    row.update({c: user_input.get(c, np.nan) for c in CATEGORICAL_COLS})

    df = pd.DataFrame([row])[RAW_COLUMNS]

    X_enc = preprocessor.transform(df)
    X_mi  = mi.transform(X_enc)

    feat_out    = preprocessor.get_feature_names_out()
    mi_features = feat_out[mi.get_support()]
    mask        = np.isin(mi_features, selected_features)
    X_selected  = X_mi[:, mask]

    X_scaled = scaler.transform(X_selected)
    X_pca    = pca.transform(X_scaled)

    pred  = model.predict(X_pca)[0]

    proba = model.predict_proba(X_pca)[0]

    # ==========================
    # SHAP on PCA Components
    # ==========================

    shap_values = explainer.shap_values(X_pca)

    # Handle different SHAP versions
    if isinstance(shap_values, list):
        pc_shap = shap_values[pred][0]
    else:
        pc_shap = shap_values[0, :, pred]

    # ==========================
    # Project SHAP back to original features
    # ==========================

    loadings = pca.components_        # (9,14)

    original_shap = loadings.T @ pc_shap

    feature_importance = pd.DataFrame({
        "Feature": selected_features,
        "SHAP": original_shap
    })

    feature_importance["AbsSHAP"] = feature_importance["SHAP"].abs()

    feature_importance = feature_importance.sort_values(
        by="AbsSHAP",
        ascending=False
    )

    stress_features = (
    feature_importance[feature_importance["SHAP"] > 0]
    .nlargest(3, "SHAP")
)

    for _, row in stress_features.iterrows():
        print(f"{row.Feature:25s} +{row.SHAP:.4f}")
    print("\nProtective Factors")
    print("-"*40)

    protective_features = (
    feature_importance[feature_importance["SHAP"] < 0]
    .nsmallest(3, "SHAP")
)
    

    for _, row in protective_features.iterrows():
        print(f"{row.Feature:25s} {row.SHAP:.4f}")

    predicted_name = label_encoder.inverse_transform([pred])[0]
    name_to_out    = {"Low": 0, "Medium": 1, "High": 2}
    predicted_code = name_to_out[predicted_name]

    if verbose:
        print("\nPredicted stress level:", predicted_name)
        print("Predicted code (0=Low, 1=Medium, 2=High):", predicted_code)

    return (
        predicted_name,
        predicted_code,
        stress_features.reset_index(drop=True),
        protective_features.reset_index(drop=True)
    )

"""
if __name__ == "__main__":
    
    test_1 = {
        "Age": 34,
        "Sleep_Duration": 6.5,
        "Sleep_Quality": 4,
        "Physical_Activity": 2,
        "Screen_Time": 7,
        "Caffeine_Intake": 3,
        "Alcohol_Intake": 0,
        "Work_Hours": 8,
        "Travel_Time": 1.5,
        "Social_Interactions": 3,
        "Blood_Pressure": 135,
        "Cholesterol_Level": 195,
        "Blood_Sugar_Level": 95,
        "Bed_Time": "11:00 PM",
    }
    print("=== Test case 1 (moderate lifestyle) ===")
    predict_stress(test_1)

    """