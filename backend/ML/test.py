import joblib

encoders = joblib.load("label_encoders.pkl")

print(encoders["MerchantCategory"].classes_)