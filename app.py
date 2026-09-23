import pandas as pd
from flask import Flask, jsonify, render_template, request

from demand_database import add_purchase, init_database
from demand_forecasting import demand_options, forecast_demand, load_demand_data
from local_data import load_manual_data
from price_forecasting_model import build_model, forecast, load_series, make_features


app = Flask(__name__)
init_database()


def source_frame():
    return load_manual_data()


def available_horizons(frame):
    # The model needs 28 history points for lag features plus the requested horizon.
    return [
        horizon
        for horizon in (7, 14, 30, 60, 90)
        if len(frame) >= 28 + horizon
    ]


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/demand")
def demand_page():
    return render_template("demand.html")


@app.get("/api/demand/options")
def demand_options_api():
    return jsonify(demand_options())


@app.get("/api/demand/forecast")
def demand_forecast_api():
    commodity = request.args.get("commodity", "Onion")
    mandi = request.args.get("mandi", "Azadpur")
    try:
        horizon = min(max(int(request.args.get("horizon", 1)), 1), 7)
        price_value = request.args.get("price")
        price = float(price_value) if price_value not in (None, "") else None
        return jsonify(forecast_demand(commodity, mandi, horizon, price))
    except (TypeError, ValueError) as error:
        return jsonify({"error": str(error)}), 400


@app.post("/api/demand/purchases")
def add_purchase_api():
    payload = request.get_json(silent=True) or {}
    required = ("date", "commodity", "mandi", "quantity_kg", "price_per_kg_inr")
    if any(payload.get(field) in (None, "") for field in required):
        return jsonify({"error": "Date, commodity, mandi, quantity, and price are required."}), 400
    try:
        quantity = float(payload["quantity_kg"])
        price = float(payload["price_per_kg_inr"])
        amount = float(payload.get("total_amount_inr") or quantity * price)
        if quantity <= 0 or price <= 0 or amount <= 0:
            raise ValueError("Quantity, price, and amount must be greater than zero.")
        purchase_id = add_purchase(
            payload["date"], str(payload["commodity"]).strip(), str(payload["mandi"]).strip(),
            quantity, price, amount,
        )
        load_demand_data.cache_clear()
        return jsonify({"id": purchase_id, "message": "Purchase added to demand history."}), 201
    except (TypeError, ValueError) as error:
        return jsonify({"error": str(error)}), 400


@app.get("/api/options")
def options():
    frame = source_frame()
    commodity = request.args.get("commodity")
    market = request.args.get("market")
    filtered = frame
    if commodity:
        filtered = filtered[filtered["Commodity"] == commodity]
    markets = sorted(filtered["Market"].dropna().unique().tolist())
    if market:
        filtered = filtered[filtered["Market"] == market]
    return jsonify(
        {
            "commodities": sorted(frame["Commodity"].dropna().unique().tolist()),
            "markets": markets,
            "horizons": available_horizons(filtered),
            "records": len(filtered),
        }
    )


@app.get("/api/market-prices")
def market_prices():
    arrival_date = request.args.get("arrival_date") or request.args.get("date")
    filters = {
        field: request.args.get(field)
        for field in ("state", "district", "commodity", "market", "arrival_date")
        if request.args.get(field)
    }
    if arrival_date:
        filters["arrival_date"] = arrival_date
    try:
        frame = source_frame()
        for field, value in filters.items():
            frame = frame[frame[{
                "state": "State", "district": "District", "commodity": "Commodity",
                "market": "Market", "arrival_date": "Arrival_Date",
            }[field]].astype(str) == value]
        records = frame.drop(columns=["raw_json"], errors="ignore").to_dict(orient="records")
        return jsonify({"records": records, "count": len(records)})
    except Exception:
        return jsonify({"error": "The market-price database could not be read."}), 500


@app.get("/api/forecast")
def forecast_api():
    commodity = request.args.get("commodity", "Rice")
    market = request.args.get("market", "Danapur")
    horizon = min(max(int(request.args.get("horizon", 30)), 7), 90)
    try:
        frame = source_frame()
        series = load_series(frame, commodity, market)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    if len(series) < 29:
        return jsonify({"error": "This produce and mandi do not have enough valid manual records for forecasting."}), 400
    if horizon not in available_horizons(frame.query("Commodity == @commodity and Market == @market")):
        return jsonify({"error": "This forecast duration is not available for the selected produce and mandi."}), 400
    dataset = make_features(series).join(series).dropna()
    if dataset.empty:
        return jsonify({"error": "This produce and mandi do not have enough valid manual records for forecasting."}), 400
    model = build_model()
    model.fit(dataset[make_features(series).columns], dataset["Modal_Price"])
    predictions = forecast(model, series, horizon)
    return jsonify(
        {
            "commodity": commodity,
            "market": market,
            "as_of": pd.Timestamp.today().normalize().strftime("%Y-%m-%d"),
            "observations": len(series),
            "latest_price": round(float(series.iloc[-1]), 2),
            "forecast": [
                {"date": date.strftime("%Y-%m-%d"), "price": round(float(value), 2)}
                for date, value in predictions.items()
            ],
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)