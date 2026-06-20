import pandas as pd
import numpy as np

from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder


# =====================================================
# LOAD MODEL
# =====================================================

model = load_model(".\lstm_model.keras")


# =====================================================
# PREDICTION FUNCTION
# =====================================================

def predict_fatigue(
        keystrokes_df,
        model,
        mean=None,
        std=None):

    # -----------------------------------
    # Recreate Label Encoder
    # -----------------------------------

    encoder = LabelEncoder()

    encoder.fit([
        'Above_Avg',
        'Avg',
        'Below_Avg',
        'Low',
        'No',
        'V_High'
    ])

    # -----------------------------------
    # Verify Input Length
    # -----------------------------------

    if len(keystrokes_df) != 150:

        raise ValueError(
            f"Expected 150 keystrokes, got {len(keystrokes_df)}"
        )

    # -----------------------------------
    # Convert Datetime Strings
    # -----------------------------------

    keystrokes_df["Press_Time"] = pd.to_datetime(
        keystrokes_df["Press_Time"]
    )

    keystrokes_df["Relase_Time"] = pd.to_datetime(
        keystrokes_df["Relase_Time"]
    )

    # -----------------------------------
    # Convert to Unix Timestamp Seconds
    # -----------------------------------

    press = (
        keystrokes_df["Press_Time"]
        .astype("int64")
        / 1e9
    ).values

    release = (
        keystrokes_df["Relase_Time"]
        .astype("int64")
        / 1e9
    ).values

    # -----------------------------------
    # Feature 1: Hold Latency
    # -----------------------------------

    hold_latency = release - press

    # -----------------------------------
    # Feature 2: Press Latency
    # -----------------------------------

    press_latency = np.zeros(len(press))

    # -----------------------------------
    # Feature 3: Release Latency
    # -----------------------------------

    release_latency = np.zeros(len(press))

    # -----------------------------------
    # Feature 4: Interkey Latency
    # -----------------------------------

    interkey_latency = np.zeros(len(press))

    for i in range(1, len(press)):

        press_latency[i] = (
            press[i]
            - press[i - 1]
        )

        release_latency[i] = (
            release[i]
            - release[i - 1]
        )

        interkey_latency[i] = (
            press[i]
            - release[i - 1]
        )

    # -----------------------------------
    # Build Sequence
    # -----------------------------------

    sequence = np.column_stack([
        hold_latency,
        press_latency,
        release_latency,
        interkey_latency
    ])

    # -----------------------------------
    # Shape for LSTM
    # -----------------------------------

    sequence = sequence.reshape(
        1,
        150,
        4
    )

    print("Input Shape:", sequence.shape)

    # -----------------------------------
    # Optional Normalization
    # -----------------------------------

    if mean is not None and std is not None:

        sequence = (
            sequence - mean
        ) / (
            std + 1e-8
        )

    # -----------------------------------
    # Predict
    # -----------------------------------

    probs = model.predict(
        sequence,
        verbose=0
    )

    pred_idx = np.argmax(
        probs,
        axis=1
    )[0]

    fatigue_class = str(
    encoder.inverse_transform(
        [pred_idx]
    )[0]
)

    confidence = float(
        np.max(probs) * 100
    )

    return {

        "fatigue_class":
        fatigue_class,

        "confidence":
        round(confidence, 2),

        "predicted_class_index":
        int(pred_idx),

        "probabilities": {

            cls: round(
                float(prob),
                4
            )

            for cls, prob in zip(
                encoder.classes_,
                probs[0]
            )
        }
    }


# =====================================================
# LOAD TEST CSV
# =====================================================

# df = pd.read_csv(
#     "sample_150_keystrokes.csv"
# )

# print(df.head())

# print(df.shape)

# =====================================================
# RUN PREDICTION
# =====================================================

# result = predict_fatigue(
#     keystrokes_df=df,
#     model=model
# )

# print("\nPrediction Result")
# print(result)