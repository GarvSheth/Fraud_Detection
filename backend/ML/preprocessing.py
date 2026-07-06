import pandas as pd
import joblib

from sklearn.preprocessing import LabelEncoder


def preprocess_training_data(df):

    # -----------------------------
    # Separate target
    # -----------------------------

    y = df["FraudLabel"]

    X = df.drop(columns=[
        "FraudLabel",
        "TransactionID",
        "UserID",
        "MerchantID",
        "Timestamp",
        "RiskScore"
    ])

    # -----------------------------
    # Find categorical columns
    # -----------------------------

    categorical_cols = X.select_dtypes(include="object").columns

    label_encoders = {}

    # -----------------------------
    # Encode
    # -----------------------------

    for col in categorical_cols:

        encoder = LabelEncoder()

        X[col] = encoder.fit_transform(X[col])

        label_encoders[col] = encoder

    # -----------------------------
    # Save encoders
    # -----------------------------

    joblib.dump(
        label_encoders,
        "label_encoders.pkl"
    )

    # -----------------------------
    # Save feature order
    # -----------------------------

    joblib.dump(
        list(X.columns),
        "feature_columns.pkl"
    )

    return X, y