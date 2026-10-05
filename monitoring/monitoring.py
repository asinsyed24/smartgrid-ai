import pandas as pd
from evidently import Report
from evidently.presets import DataDriftPreset

# --------------------------------------------------
# SMARTGRID AI - MLOPS DATA DRIFT MONITORING
# --------------------------------------------------

REFERENCE_DATA = "data/processed/energy_processed.csv"
CURRENT_DATA = "data/processed/energy_processed.csv"

print("\n" + "=" * 60)
print("SMARTGRID AI - MLOPS MONITORING")
print("=" * 60)

# Load dataset
print("\nLoading energy data...")

data = pd.read_csv(REFERENCE_DATA)

# Use chronological split
split_index = int(len(data) * 0.8)

reference = data.iloc[:split_index].copy()
current = data.iloc[split_index:].copy()

print(f"Reference data: {reference.shape}")
print(f"Current data  : {current.shape}")

# Remove datetime column if present
for df in [reference, current]:
    if "datetime" in df.columns:
        df.drop(columns=["datetime"], inplace=True)

# Keep numeric columns only
reference = reference.select_dtypes(include=["number"])
current = current.select_dtypes(include=["number"])

print(f"\nNumeric features: {len(reference.columns)}")

# --------------------------------------------------
# EVIDENTLY DRIFT REPORT
# --------------------------------------------------

print("\nRunning Evidently AI drift analysis...")

report = Report(
    metrics=[
        DataDriftPreset()
    ]
)

result = report.run(
    current_data=current,
    reference_data=reference
)

# Save report
output_file = "monitoring/drift_report.html"

result.save_html(output_file)

print("\n" + "=" * 60)
print("MONITORING COMPLETED")
print("=" * 60)

print(f"\nDrift report saved to:")
print(output_file)

print("\nOpen this file in your browser to view the report.")
print("=" * 60)