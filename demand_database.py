import sqlite3
from datetime import datetime
from pathlib import Path


DATABASE_PATH = Path(__file__).resolve().parent / "user_purchases.sqlite3"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS purchase_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                purchase_date TEXT NOT NULL,
                commodity TEXT NOT NULL,
                mandi TEXT NOT NULL,
                quantity_kg REAL NOT NULL,
                price_per_kg_inr REAL NOT NULL,
                total_amount_inr REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.commit()


def add_purchase(purchase_date, commodity, mandi, quantity_kg, price_per_kg_inr, total_amount_inr):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO purchase_details (
                purchase_date, commodity, mandi, quantity_kg, price_per_kg_inr,
                total_amount_inr, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                purchase_date,
                commodity,
                mandi,
                quantity_kg,
                price_per_kg_inr,
                total_amount_inr,
                datetime.utcnow().isoformat(timespec="seconds") + "Z",
            ),
        )
        connection.commit()
        return cursor.lastrowid


def purchase_frame():
    import pandas as pd

    with get_connection() as connection:
        rows = connection.execute(
            "SELECT purchase_date AS Date, commodity AS Commodity, mandi AS Mandi, "
            "quantity_kg AS Quantity_kg, price_per_kg_inr AS Price_per_kg_INR, "
            "total_amount_inr AS Total_Amount_INR FROM purchase_details"
        ).fetchall()
    return pd.DataFrame([dict(row) for row in rows])
