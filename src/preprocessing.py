import pandas as pd
from pathlib import Path

RAW_FILE = Path("data/raw/household_power_consumption.txt")
OUTPUT_FILE = Path("data/processed/energy_processed.csv")


def preprocess_data():
    print("Loading SmartGrid AI dataset...")

    df = pd.read_csv(
        RAW_FILE,
        sep=";",
        na_values="?",
        low_memory=False
    )

    print(f"Original shape: {df.shape}")

    # Combine Date and Time
    df["datetime"] = pd.to_datetime(
        df["Date"] + " " + df["Time"],
        dayfirst=True,
        errors="coerce"
    )

    # Convert numeric columns
    numeric_columns = [
        "Global_active_power",
        "Global_reactive_power",
        "Voltage",
        "Global_intensity",
        "Sub_metering_1",
        "Sub_metering_2",
        "Sub_metering_3"
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    # Sort chronologically
    df = df.sort_values("datetime")

    # Fill missing numeric values using interpolation
    df[numeric_columns] = df[numeric_columns].interpolate(
        method="linear"
    )

    # Create time-based features
    df["hour"] = df["datetime"].dt.hour
    df["day"] = df["datetime"].dt.day
    df["month"] = df["datetime"].dt.month
    df["day_of_week"] = df["datetime"].dt.dayofweek
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

    # Lag features
    df["power_lag_1"] = df["Global_active_power"].shift(1)
    df["power_lag_5"] = df["Global_active_power"].shift(5)
    df["power_lag_60"] = df["Global_active_power"].shift(60)

    # Rolling average
    df["power_rolling_60"] = (
        df["Global_active_power"]
        .rolling(window=60)
        .mean()
    )

    # Remove rows created by lag/rolling operations
    df = df.dropna()

    # Save processed dataset
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)

    print(f"Processed shape: {df.shape}")
    print(f"Saved to: {OUTPUT_FILE}")
    print("Preprocessing completed successfully.")


if __name__ == "__main__":
    preprocess_data()