from functools import lru_cache
from pathlib import Path
import os

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
MANUAL_DATA_DIR = Path(os.environ.get("MANUAL_DATA_DIR", BASE_DIR / "manual_data"))
SUPPORTED_EXTENSIONS = {".csv", ".xls", ".xlsx"}
REQUIRED_COLUMNS = {"Arrival_Date", "District", "Market", "Commodity", "Modal_Price"}


@lru_cache(maxsize=1)
def load_manual_data():
    paths = sorted(
        path for path in MANUAL_DATA_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    ) if MANUAL_DATA_DIR.exists() else []
    if not paths:
        raise FileNotFoundError(
            f"No manual CSV or Excel files found in {MANUAL_DATA_DIR}."
        )

    frames = []
    for path in paths:
        frame = pd.read_excel(path) if path.suffix.lower() in {".xls", ".xlsx"} else pd.read_csv(path)
        missing = REQUIRED_COLUMNS - set(frame.columns)
        if missing:
            raise ValueError(f"{path.name} is missing columns: {', '.join(sorted(missing))}")
        frames.append(frame)

    data = pd.concat(frames, ignore_index=True).drop_duplicates()
    data["District"] = data["District"].astype(str).str.strip()
    data = data[data["District"].isin({"Delhi", "Patna"})].copy()
    data["Arrival_Date"] = pd.to_datetime(data["Arrival_Date"], dayfirst=True, errors="coerce")
    data["Modal_Price"] = pd.to_numeric(data["Modal_Price"], errors="coerce")
    data = data.dropna(subset=["Arrival_Date", "Modal_Price"])
    if data.empty:
        raise ValueError("The manual files do not contain Delhi or Patna records.")
    return data
