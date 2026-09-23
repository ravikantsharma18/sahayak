from functools import lru_cache
from pathlib import Path

import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor

from demand_database import purchase_frame


DATASET_PATH = Path(__file__).resolve().parent / "demand_data" / "SAHAYAK_Fake_Demand_Data_10000Users.xlsx"
FEATURE_COLUMNS = [
    "price_per_kg",
    "day_of_week",
    "day_of_month",
    "month",
    "lag_1",
    "lag_7",
    "rolling_mean_7",
]


@lru_cache(maxsize=1)
def load_demand_data():
    transactions = pd.read_excel(DATASET_PATH, sheet_name="Transactions")
    transactions = transactions.rename(
        columns={
            "Price_per_kg_INR": "price_per_kg",
            "Quantity_kg": "quantity_kg",
            "Total_Amount_INR": "total_amount_inr",
        }
    )
    transactions["Date"] = pd.to_datetime(transactions["Date"], errors="coerce")
    transactions["quantity_kg"] = pd.to_numeric(transactions["quantity_kg"], errors="coerce")
    transactions["price_per_kg"] = pd.to_numeric(transactions["price_per_kg"], errors="coerce")
    transactions = transactions.dropna(subset=["Date", "Commodity", "Mandi", "quantity_kg", "price_per_kg"])

    additions = purchase_frame()
    if not additions.empty:
        additions["Date"] = pd.to_datetime(additions["Date"], errors="coerce")
        additions["quantity_kg"] = pd.to_numeric(additions["Quantity_kg"], errors="coerce")
        additions["price_per_kg"] = pd.to_numeric(additions["Price_per_kg_INR"], errors="coerce")
        additions = additions.dropna(subset=["Date", "Commodity", "Mandi", "quantity_kg", "price_per_kg"])
        transactions = pd.concat(
            [transactions[["Date", "Commodity", "Mandi", "quantity_kg", "price_per_kg"]],
             additions[["Date", "Commodity", "Mandi", "quantity_kg", "price_per_kg"]]],
            ignore_index=True,
        )
    return transactions


def demand_options():
    data = load_demand_data()
    return {
        "commodities": sorted(data["Commodity"].astype(str).unique().tolist()),
        "mandis": sorted(data["Mandi"].astype(str).unique().tolist()),
    }


def _segment_frame(commodity, mandi):
    data = load_demand_data()
    segment = data[(data["Commodity"] == commodity) & (data["Mandi"] == mandi)].copy()
    if segment.empty:
        raise ValueError("No demand records match this commodity and mandi.")
    daily = segment.groupby("Date", as_index=False).agg(
        quantity_kg=("quantity_kg", "sum"),
        price_per_kg=("price_per_kg", "mean"),
        orders=("quantity_kg", "size"),
    )
    daily = daily.set_index("Date").sort_index()
    date_index = pd.date_range(daily.index.min(), daily.index.max(), freq="D")
    daily = daily.reindex(date_index)
    daily["quantity_kg"] = daily["quantity_kg"].fillna(0)
    daily["orders"] = daily["orders"].fillna(0)
    daily["price_per_kg"] = daily["price_per_kg"].interpolate().ffill().bfill()
    return daily


def _features(daily):
    features = pd.DataFrame(index=daily.index)
    features["price_per_kg"] = daily["price_per_kg"]
    features["day_of_week"] = daily.index.dayofweek
    features["day_of_month"] = daily.index.day
    features["month"] = daily.index.month
    features["lag_1"] = daily["quantity_kg"].shift(1)
    features["lag_7"] = daily["quantity_kg"].shift(7)
    features["rolling_mean_7"] = daily["quantity_kg"].shift(1).rolling(7).mean()
    return features


def forecast_demand(commodity, mandi, horizon=1, price=None):
    daily = _segment_frame(commodity, mandi)
    if len(daily) < 10:
        raise ValueError("This segment does not have enough demand history yet.")
    dataset = _features(daily).join(daily["quantity_kg"]).dropna()
    if dataset.empty:
        raise ValueError("This segment does not have enough demand history yet.")

    model = HistGradientBoostingRegressor(
        loss="squared_error", learning_rate=0.06, max_iter=180,
        max_leaf_nodes=12, l2_regularization=1.0, random_state=42,
    )
    model.fit(dataset[FEATURE_COLUMNS], dataset["quantity_kg"])

    history = daily.copy()
    predictions = []
    future_dates = pd.date_range(history.index[-1] + pd.Timedelta(days=1), periods=horizon, freq="D")
    for date in future_dates:
        next_price = float(price) if price is not None and date == future_dates[0] else float(history["price_per_kg"].iloc[-1])
        extended = pd.concat([
            history,
            pd.DataFrame({"quantity_kg": [float("nan")], "price_per_kg": [next_price], "orders": [0]}, index=[date]),
        ])
        row = _features(extended).loc[[date], FEATURE_COLUMNS]
        prediction = max(0.0, float(model.predict(row)[0]))
        history.loc[date, "quantity_kg"] = prediction
        history.loc[date, "price_per_kg"] = next_price
        history.loc[date, "orders"] = 0
        predictions.append({"date": date.strftime("%Y-%m-%d"), "quantity_kg": round(prediction, 2), "price_per_kg": round(next_price, 2)})

    return {
        "commodity": commodity,
        "mandi": mandi,
        "history_days": len(daily),
        "historical_quantity_kg": round(float(daily["quantity_kg"].sum()), 2),
        "forecast": predictions,
    }
