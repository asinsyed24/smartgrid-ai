import pandas as pd
import mlflow
import mlflow.sklearn
import joblib

from pathlib import Path

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from sklearn.linear_model import LinearRegression

from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor
)


# ============================================================
# SMARTGRID AI - CONFIGURATION
# ============================================================

DATA_FILE = Path("data/processed/energy_processed.csv")
MODEL_DIR = Path("models")

TARGET = "Global_active_power"

FEATURES = [
    "Global_reactive_power",
    "Voltage",
    "Global_intensity",
    "Sub_metering_1",
    "Sub_metering_2",
    "Sub_metering_3",
    "hour",
    "day",
    "month",
    "day_of_week",
    "is_weekend",
    "power_lag_1",
    "power_lag_5",
    "power_lag_60",
    "power_rolling_60",
]


# ============================================================
# TRAIN ONE MODEL
# ============================================================

def train_model(
    name,
    model,
    X_train,
    X_test,
    y_train,
    y_test
):

    with mlflow.start_run(run_name=name):

        print(f"\nTraining {name}...")

        # Train
        model.fit(X_train, y_train)

        # Predict
        predictions = model.predict(X_test)

        # Metrics
        mae = mean_absolute_error(
            y_test,
            predictions
        )

        rmse = mean_squared_error(
            y_test,
            predictions
        ) ** 0.5

        r2 = r2_score(
            y_test,
            predictions
        )

        # MLflow parameters
        mlflow.log_param(
            "model",
            name
        )

        mlflow.log_param(
            "features",
            len(FEATURES)
        )

        mlflow.log_param(
            "training_rows",
            len(X_train)
        )

        mlflow.log_param(
            "test_rows",
            len(X_test)
        )

        # MLflow metrics
        mlflow.log_metric(
            "mae",
            mae
        )

        mlflow.log_metric(
            "rmse",
            rmse
        )

        mlflow.log_metric(
            "r2",
            r2
        )

        # ----------------------------------------------------
        # FIX:
        # Explicitly use pickle instead of skops
        # ----------------------------------------------------

        mlflow.sklearn.log_model(
            model,
            name="model",
            serialization_format="pickle"
        )

        # Display results
        print(f"\n{name}")
        print("-" * 40)
        print(f"MAE  : {mae:.4f}")
        print(f"RMSE : {rmse:.4f}")
        print(f"R2   : {r2:.4f}")

    return model, r2


# ============================================================
# MAIN TRAINING PIPELINE
# ============================================================

def main():

    print("=" * 60)
    print("SMARTGRID AI - ENERGY PREDICTION")
    print("=" * 60)

    print("\nLoading processed SmartGrid AI dataset...")

    # Load dataset
    df = pd.read_csv(
        DATA_FILE
    )

    print(f"Dataset shape: {df.shape}")

    # Features and target
    X = df[FEATURES]
    y = df[TARGET]

    print(f"Features: {len(FEATURES)}")
    print(f"Target: {TARGET}")

    # --------------------------------------------------------
    # Chronological train/test split
    # --------------------------------------------------------

    split_index = int(
        len(df) * 0.8
    )

    X_train = X.iloc[
        :split_index
    ]

    X_test = X.iloc[
        split_index:
    ]

    y_train = y.iloc[
        :split_index
    ]

    y_test = y.iloc[
        split_index:
    ]

    print(f"\nTraining rows: {len(X_train)}")
    print(f"Testing rows : {len(X_test)}")

    # --------------------------------------------------------
    # MLflow experiment
    # --------------------------------------------------------

    mlflow.set_experiment(
        "SmartGrid-AI-Energy-Prediction"
    )

    # --------------------------------------------------------
    # Models
    # --------------------------------------------------------

    models = {

        "Linear Regression":
            LinearRegression(),

        "Random Forest":
            RandomForestRegressor(
                n_estimators=100,
                max_depth=15,
                random_state=42,
                n_jobs=-1
            ),

        "Gradient Boosting":
            GradientBoostingRegressor(
                n_estimators=100,
                learning_rate=0.05,
                max_depth=5,
                random_state=42
            )
    }

    # --------------------------------------------------------
    # Find best model
    # --------------------------------------------------------

    best_model = None

    best_r2 = float("-inf")

    best_name = ""

    results = []

    for name, model in models.items():

        trained_model, r2 = train_model(
            name,
            model,
            X_train,
            X_test,
            y_train,
            y_test
        )

        results.append(
            (name, r2)
        )

        if r2 > best_r2:

            best_r2 = r2

            best_model = trained_model

            best_name = name

    # --------------------------------------------------------
    # Save best model locally
    # --------------------------------------------------------

    MODEL_DIR.mkdir(
        exist_ok=True
    )

    model_path = (
        MODEL_DIR /
        "best_energy_model.pkl"
    )

    joblib.dump(
        best_model,
        model_path
    )

    # --------------------------------------------------------
    # Final results
    # --------------------------------------------------------

    print("\n")
    print("=" * 60)
    print("SMARTGRID AI TRAINING COMPLETED")
    print("=" * 60)

    print(f"Best Model : {best_name}")
    print(f"Best R2    : {best_r2:.4f}")

    print(
        f"Model saved: {model_path}"
    )

    print("\nModel Comparison")
    print("-" * 60)

    for name, r2 in results:

        print(
            f"{name:<25} R2 = {r2:.4f}"
        )

    print("=" * 60)
    print("MLflow experiment: SmartGrid-AI-Energy-Prediction")
    print("=" * 60)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()