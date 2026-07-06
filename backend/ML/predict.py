import pandas as pd
import joblib

# -----------------------------
# Load Model
# -----------------------------

model = joblib.load("model.pkl")
label_encoders = joblib.load("label_encoders.pkl")
feature_columns = joblib.load("feature_columns.pkl")


# -----------------------------
# Predict Function
# -----------------------------

def predict_transaction(transaction):

    df = pd.DataFrame([transaction])

    # Encode categorical columns
    for col, encoder in label_encoders.items():
        if col in df.columns:
            df[col] = encoder.transform(df[col])

    # Ensure correct column order
    df = df[feature_columns]

    # Prediction
    prediction = model.predict(df)[0]

    # Probability
    probability = model.predict_proba(df)[0][1]

    return {
        "prediction": int(prediction),
        "fraud_probability": float(probability)
    }


# -----------------------------
# Example
# -----------------------------

sample_transaction = {
    "CreditScore": 480,
    "PreviousFraudCount": 2,
    "MerchantCategory": "Fuel",
    "MerchantRisk": "High",
    "DeviceType": "Android",
    "TrustedDevice": False,
    "City": "Mumbai",
    "Country": "India",
    "LocationRisk": "High",
    "Amount": 75000,
    "TransactionType": "UPI",
    "HourOfDay": 2,
    "DayOfWeek": "Saturday",
    "PreviousBalance": 120000,
    "CurrentBalance": 45000,
    "IsNewDevice": True,
    "IsNewLocation": True
}

result = predict_transaction(sample_transaction)

print(result)