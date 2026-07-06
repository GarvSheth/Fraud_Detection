import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

from preprocessing import preprocess_training_data

# Load dataset
df = pd.read_csv("data/transactions.csv")

# Preprocess
X, y = preprocess_training_data(df)

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Calculate class weight
neg = (y_train == 0).sum()
pos = (y_train == 1).sum()

scale_pos_weight = neg / pos

# Model
model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    eval_metric="logloss"
)

# Train
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "model.pkl")

print("Model trained successfully.")
print("Saved as model.pkl")