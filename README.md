# Mandi Price Forecasting Model

This project forecasts `Modal_Price` from the manually supplied Delhi and Patna mandi files. It uses a gradient-boosted regression model with lag prices, rolling statistics, and calendar features. No external API or remote data source is used.

## Website

The dashboard reads every `.csv`, `.xls`, and `.xlsx` file in `manual_data`. Records are limited to the `Delhi` and `Patna` districts, then the selected commodity and market are used to train the forecast.

To use a new manual file, place it in `manual_data` with these columns:

```text
Arrival_Date, District, Market, Commodity, Modal_Price
```

Restart the app after replacing or adding files. Set `MANUAL_DATA_DIR` if the files are stored elsewhere:

```powershell
$env:MANUAL_DATA_DIR = "C:\path\to\manual_data"
python .\app.py
```

### Start the local dashboard

```powershell
python .\app.py
```

Then open http://127.0.0.1:5000. Select a commodity, market, and forecast horizon to train the model and view the chart and daily forecast ledger.

### Demand forecast

Open http://127.0.0.1:5000/demand for the demand workspace. It uses the `Transactions` sheet from `demand_data/SAHAYAK_Fake_Demand_Data_10000Users.xlsx` and forecasts expected kilograms for a commodity and mandi using historical quantity, price, weekday, and recent demand.

The purchase form accepts date, commodity, mandi, quantity, price, and amount. Saved purchases are stored locally in `user_purchases.sqlite3` and are merged with the workbook data for later forecasts of the same commodity and mandi.

## Run it

From this folder, install the dependencies once:

```powershell
python -m pip install pandas numpy scikit-learn matplotlib
```

Run a forecast for Rice at Danapur using the manual Patna file:

```powershell
python .\price_forecasting_model.py --data `
	".\manual_data\patna_prices.csv" \
	".\manual_data\delhi_prices.csv"
```

Outputs are written to `forecast_output`:

- `future_forecast.csv`: the next 30 daily predicted modal prices
- `test_predictions.csv`: held-out actual versus predicted prices
- `forecast.png`: recent history and future forecast chart

Change the series and horizon, for example:

```powershell
python .\price_forecasting_model.py --data "C:\path\prices-a.csv" "C:\path\prices-b.csv" --commodity Onion --market Danapur --horizon 60
```

The data contains irregular market arrivals. The model combines the local files, removes exact duplicate rows, preserves source date ordering, and treats each row as a sequential observation while deliberately ignoring historical date values per the requested workflow. This is a practical baseline, not a guarantee of future prices; validate the selected series before using it for decisions.