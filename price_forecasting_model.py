import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


FEATURE_COLUMNS = [
    "lag_1",
    "lag_7",
    "lag_14",
    "lag_28",
    "rolling_mean_7",
    "rolling_mean_28",
    "rolling_std_7",
    "day_of_week",
    "day_of_month",
    "month",
    "quarter",
    "year",
]


def parse_args():
    parser = argparse.ArgumentParser(description="Forecast mandi modal prices.")
    parser.add_argument("--data", required=True, nargs="+", help="One or more CSV paths.")
    parser.add_argument("--commodity", default="Rice")
    parser.add_argument("--market", default="Danapur")
    parser.add_argument("--grade", default=None)
    parser.add_argument("--variety", default=None)
    parser.add_argument("--horizon", type=int, default=30)
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--output-dir", default="forecast_output")
    return parser.parse_args()


def load_series(path, commodity, market, grade=None, variety=None, as_of=None):
    if isinstance(path, pd.DataFrame):
        frame = path.copy()
    else:
        paths = [path] if isinstance(path, (str, Path)) else path
        frame = pd.concat((pd.read_csv(item) for item in paths), ignore_index=True)
    frame = frame.drop_duplicates()
    frame["Arrival_Date"] = pd.to_datetime(
        frame["Arrival_Date"], dayfirst=True, errors="coerce"
    )
    frame["Modal_Price"] = pd.to_numeric(frame["Modal_Price"], errors="coerce")
    frame = frame.dropna(subset=["Arrival_Date", "Modal_Price"])
    frame = frame[(frame["Commodity"] == commodity) & (frame["Market"] == market)]
    if grade is not None:
        frame = frame[frame["Grade"] == grade]
    if variety is not None:
        frame = frame[frame["Variety"] == variety]
    if frame.empty:
        raise ValueError("No rows match the selected commodity, market, grade, and variety.")

    # Several market records can share a date; the median is robust to outliers.
    # Treat the source dates as ordering information only. This keeps every
    # observation in the lag sequence while anchoring the forecast to today.
    series = frame.sort_values("Arrival_Date").reset_index(drop=True)
    series = series.groupby(series.index // 1)["Modal_Price"].median()
    anchor = pd.Timestamp.today().normalize() if as_of is None else pd.Timestamp(as_of).normalize()
    full_index = pd.date_range(end=anchor, periods=len(series), freq="D")
    series.index = full_index
    series.index.name = "Date"
    series.name = "Modal_Price"
    return series


def make_features(series):
    features = pd.DataFrame(index=series.index)
    features["lag_1"] = series.shift(1)
    features["lag_7"] = series.shift(7)
    features["lag_14"] = series.shift(14)
    features["lag_28"] = series.shift(28)
    features["rolling_mean_7"] = series.shift(1).rolling(7).mean()
    features["rolling_mean_28"] = series.shift(1).rolling(28).mean()
    features["rolling_std_7"] = series.shift(1).rolling(7).std()
    features["day_of_week"] = series.index.dayofweek
    features["day_of_month"] = series.index.day
    features["month"] = series.index.month
    features["quarter"] = series.index.quarter
    features["year"] = series.index.year
    return features


def build_model():
    return HistGradientBoostingRegressor(
        loss="squared_error",
        learning_rate=0.05,
        max_iter=350,
        max_leaf_nodes=15,
        l2_regularization=1.0,
        random_state=42,
    )


def forecast(model, history, horizon):
    values = history.copy()
    future_dates = pd.date_range(pd.Timestamp.today().normalize() + pd.Timedelta(days=1), periods=horizon)
    predictions = []
    for date in future_dates:
        extended = pd.concat([values, pd.Series([np.nan], index=[date], name=values.name)])
        row = make_features(extended).loc[[date], FEATURE_COLUMNS]
        prediction = float(model.predict(row)[0])
        values.loc[date] = max(0.0, prediction)
        predictions.append(prediction)
    return pd.Series(predictions, index=future_dates, name="Predicted_Modal_Price")


def main():
    args = parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    series = load_series(
        args.data, args.commodity, args.market, args.grade, args.variety
    )
    dataset = make_features(series).join(series).dropna()
    split_at = int(len(dataset) * (1 - args.test_size))
    if split_at < 30 or len(dataset) - split_at < 1:
        raise ValueError("The selected series is too short for the requested test split.")

    train = dataset.iloc[:split_at]
    test = dataset.iloc[split_at:]
    model = build_model()
    model.fit(train[FEATURE_COLUMNS], train["Modal_Price"])
    test_predictions = model.predict(test[FEATURE_COLUMNS])
    mae = mean_absolute_error(test["Modal_Price"], test_predictions)
    rmse = mean_squared_error(test["Modal_Price"], test_predictions) ** 0.5
    nonzero = test["Modal_Price"] != 0
    mape = (
        np.mean(
            np.abs(
                (test.loc[nonzero, "Modal_Price"] - test_predictions[nonzero])
                / test.loc[nonzero, "Modal_Price"]
            )
        )
        * 100
    )

    final_model = build_model()
    final_model.fit(dataset[FEATURE_COLUMNS], dataset["Modal_Price"])
    future = forecast(final_model, series, args.horizon)
    future.to_csv(output_dir / "future_forecast.csv", header=True)

    evaluation = pd.DataFrame(
        {
            "Date": test.index,
            "Actual_Modal_Price": test["Modal_Price"].to_numpy(),
            "Predicted_Modal_Price": test_predictions,
        }
    )
    evaluation.to_csv(output_dir / "test_predictions.csv", index=False)

    plot_start = max(0, len(series) - 180)
    plt.figure(figsize=(13, 6))
    plt.plot(series.index[plot_start:], series.iloc[plot_start:], label="Actual", linewidth=1.8)
    plt.plot(future.index, future, label="Forecast", linewidth=2.2, color="#d95f02")
    plt.axvline(series.index[-1], color="#555555", linestyle="--", linewidth=1)
    plt.title(f"{args.commodity} price forecast at {args.market}")
    plt.xlabel("Date")
    plt.ylabel("Modal price")
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_dir / "forecast.png", dpi=150)
    plt.close()

    print(f"Series: {args.commodity} | {args.market} | rows after daily fill: {len(series)}")
    print(f"Validation: MAE={mae:.2f}, RMSE={rmse:.2f}, MAPE={mape:.2f}%")
    print(f"Forecast range: {future.index[0].date()} to {future.index[-1].date()}")
    print(f"Saved: {output_dir / 'future_forecast.csv'}")
    print(f"Saved: {output_dir / 'test_predictions.csv'}")
    print(f"Saved: {output_dir / 'forecast.png'}")


if __name__ == "__main__":
    main()