"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runPrediction = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Global_reactive_power: 0.418,
          Voltage: 234.84,
          Global_intensity: 18.4,
          Sub_metering_1: 0,
          Sub_metering_2: 1,
          Sub_metering_3: 17,
          hour: 18,
          day: 5,
          month: 10,
          day_of_week: 0,
          is_weekend: 0,
          power_lag_1: 4.2,
          power_lag_5: 4.1,
          power_lag_60: 3.9,
          power_rolling_60: 4.0,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setPrediction(data.prediction_kw);
    } catch (err) {
      setError("Unable to connect to SmartGrid AI API.");
    } finally {
      setLoading(false);
    }
  };

  const hourlyData = [
    3.1, 3.6, 3.2, 4.0,
    3.5, 4.3, 3.8, 4.7,
    3.9, 4.5, 3.7, 4.1,
    4.4, 4.0, 4.6, 4.9,
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-[1400px] px-8 py-10">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm font-bold tracking-[0.35em] text-cyan-400">
              SMARTGRID AI
            </p>

            <h1 className="text-5xl font-bold tracking-tight">
              Energy Dashboard
            </h1>

            <p className="mt-3 text-lg text-slate-400">
              Intelligent energy consumption prediction and management
            </p>
          </div>

          <div className="flex items-center gap-3 text-emerald-400">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
            System Online
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Current Consumption"
            value="4.20"
            unit="kW"
            bottom="↓ 8.4% from yesterday"
            bottomColor="text-emerald-400"
          />

          <StatCard
            title="AI Prediction"
            value={prediction !== null ? prediction.toFixed(2) : "4.21"}
            unit="kW"
            bottom="Random Forest"
            bottomColor="text-cyan-400"
            highlight
          />

          <StatCard
            title="Today's Energy"
            value="68.4"
            unit="kWh"
            bottom="Within expected range"
            bottomColor="text-yellow-400"
          />

          <StatCard
            title="Estimated Cost"
            value="₹542"
            bottom="Today's estimate"
            bottomColor="text-slate-500"
          />

        </div>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">

          {/* ENERGY CHART */}
          <section className="rounded-2xl border border-slate-800 bg-[#0b1224] p-7">

            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  Energy Consumption
                </h2>

                <p className="mt-1 text-slate-500">
                  Today's consumption pattern
                </p>
              </div>

              <span className="text-cyan-400">
                Live
              </span>
            </div>

            <div className="flex h-[350px] items-end gap-3 border-b border-slate-800">

              {hourlyData.map((value, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-300 transition-all duration-500 hover:from-cyan-500 hover:to-cyan-200"
                    style={{
                      height: `${(value / 5) * 100}%`,
                    }}
                  />
                </div>
              ))}

            </div>

            <div className="mt-4 flex justify-between text-xs text-slate-500">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>24:00</span>
            </div>

          </section>

          {/* AI PREDICTION */}
          <section className="rounded-2xl border border-cyan-900/70 bg-[#0b1224] p-7">

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-semibold">
                  AI Prediction
                </h2>

                <p className="mt-1 text-slate-500">
                  Machine learning model
                </p>
              </div>

              <span className="text-3xl text-cyan-400">
                ✦
              </span>

            </div>

            <div className="py-10 text-center">

              <p className="text-slate-500">
                Predicted Consumption
              </p>

              <div className="mt-2 text-6xl font-bold text-cyan-400">
                {prediction !== null
                  ? prediction.toFixed(2)
                  : "4.21"}
              </div>

              <p className="mt-1 text-slate-500">
                kW
              </p>

            </div>

            <div className="space-y-5">

              <InfoRow
                label="Model"
                value="Random Forest"
              />

              <InfoRow
                label="Accuracy"
                value="99.90%"
                valueColor="text-emerald-400"
              />

              <InfoRow
                label="R² Score"
                value="0.9990"
                valueColor="text-cyan-400"
              />

            </div>

            <button
              onClick={runPrediction}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-cyan-500 py-4 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Running AI Prediction..."
                : "Run AI Prediction"}
            </button>

            {error && (
              <p className="mt-4 text-center text-sm text-red-400">
                {error}
              </p>
            )}

          </section>

        </div>

        {/* BOTTOM FEATURES */}
        <div className="mt-6 grid gap-5 md:grid-cols-3">

          <FeatureCard
            icon="📊"
            title="Real-Time Analytics"
            text="Monitor electricity consumption and usage patterns."
          />

          <FeatureCard
            icon="🤖"
            title="AI Forecasting"
            text="Predict future energy demand using machine learning."
          />

          <FeatureCard
            icon="⚡"
            title="Smart Recommendations"
            text="Identify opportunities to reduce energy consumption."
          />

        </div>

      </div>
    </main>
  );
}


/* STAT CARD */

function StatCard({
  title,
  value,
  unit,
  bottom,
  bottomColor,
  highlight = false,
}: {
  title: string;
  value: string;
  unit?: string;
  bottom: string;
  bottomColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-[#0b1224] p-6 ${
        highlight
          ? "border-cyan-900"
          : "border-slate-800"
      }`}
    >
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <div className="mt-4 flex items-end gap-2">
        <span
          className={`text-4xl font-bold ${
            highlight ? "text-cyan-400" : "text-white"
          }`}
        >
          {value}
        </span>

        {unit && (
          <span className="mb-1 text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <p className={`mt-4 text-sm ${bottomColor}`}>
        {bottom}
      </p>
    </div>
  );
}


/* INFO ROW */

function InfoRow({
  label,
  value,
  valueColor = "text-white",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">
        {label}
      </span>

      <span className={`font-medium ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}


/* FEATURE CARD */

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1224] p-6 transition hover:border-cyan-900">
      <div className="text-2xl">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}