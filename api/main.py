from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# SMARTGRID AI - FASTAPI
# ============================================================

MODEL_PATH = Path("models/best_energy_model.pkl")

# Load trained model
model = joblib.load(MODEL_PATH)


# ============================================================
# CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="SmartGrid AI API",
    description="AI-powered energy consumption prediction API",
    version="1.0.0"
)


# ============================================================
# CORS
# Allows Next.js frontend to communicate with FastAPI
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# INPUT DATA
# ============================================================

class EnergyInput(BaseModel):

    Global_reactive_power: float
    Voltage: float
    Global_intensity: float

    Sub_metering_1: float
    Sub_metering_2: float
    Sub_metering_3: float

    hour: int
    day: int
    month: int
    day_of_week: int
    is_weekend: int

    power_lag_1: float
    power_lag_5: float
    power_lag_60: float
    power_rolling_60: float


# ============================================================
# HOME / HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "project": "SmartGrid AI",
        "status": "online",
        "message": "Energy Prediction API is running"
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/model-info")
def model_info():

    return {
        "project": "SmartGrid AI",
        "model": "Random Forest Regressor",
        "target": "Global_active_power",
        "features": 15,
        "model_file": str(MODEL_PATH),
        "status": "ready"
    }


# ============================================================
# MLOPS MONITORING STATUS
# ============================================================

@app.get("/mlops-status")
def mlops_status():

    return {
        "monitoring": "active",
        "drift_report": "available",
        "report": "monitoring/drift_report.html",
        "status": "healthy"
    }


# ============================================================
# ENERGY PREDICTION
# ============================================================

@app.post("/predict")
def predict_energy(data: EnergyInput):

    input_data = pd.DataFrame(
        [[
            data.Global_reactive_power,
            data.Voltage,
            data.Global_intensity,
            data.Sub_metering_1,
            data.Sub_metering_2,
            data.Sub_metering_3,
            data.hour,
            data.day,
            data.month,
            data.day_of_week,
            data.is_weekend,
            data.power_lag_1,
            data.power_lag_5,
            data.power_lag_60,
            data.power_rolling_60
        ]],
        columns=[
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
            "power_rolling_60"
        ]
    )

    prediction = model.predict(input_data)[0]

    return {
        "prediction_kw": round(float(prediction), 4),
        "unit": "kW",
        "model": "Random Forest Regressor",
        "status": "success"
    }