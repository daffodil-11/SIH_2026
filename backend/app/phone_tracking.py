import sqlite3
from datetime import datetime

from fastapi import APIRouter

router = APIRouter(
    prefix="/phone-tracking",
    tags=["Phone Tracking"],
)

DATABASE_PATH = "dark_web.db"


def get_database_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_phone_table():
    connection = get_database_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS phone_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone_number TEXT NOT NULL,
            alias_name TEXT NOT NULL,
            platform TEXT NOT NULL,
            location TEXT NOT NULL,
            recorded_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


def insert_sample_phone_records():
    connection = get_database_connection()

    existing_records = connection.execute(
        "SELECT COUNT(*) AS total FROM phone_records"
    ).fetchone()

    if existing_records["total"] == 0:
        sample_records = [
            (
                "+91-9876543210",
                "ShadowFox",
                "Dark Forum",
                "Mumbai, India",
                "2026-10-10 10:30:00",
            ),
            (
                "+91-9876543210",
                "CryptoKing",
                "Dark Marketplace",
                "Mumbai, India",
                "2026-10-11 18:45:00",
            ),
            (
                "+91-9123456780",
                "NightHawk",
                "Encrypted Chat",
                "Delhi, India",
                "2026-10-12 09:15:00",
            ),
            (
                "+91-9988776655",
                "GhostTrader",
                "Dark Forum",
                "Bengaluru, India",
                "2026-10-13 21:20:00",
            ),
            (
                "+91-9988776655",
                "SilentWolf",
                "Dark Marketplace",
                "Bengaluru, India",
                "2026-10-14 14:05:00",
            ),
        ]

        connection.executemany(
            """
            INSERT INTO phone_records
            (phone_number, alias_name, platform, location, recorded_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            sample_records,
        )

        connection.commit()

    connection.close()


@router.get("/")
def get_phone_tracking_records():
    create_phone_table()
    insert_sample_phone_records()

    connection = get_database_connection()

    records = connection.execute(
        """
        SELECT
            id,
            phone_number,
            alias_name,
            platform,
            location,
            recorded_at
        FROM phone_records
        ORDER BY phone_number, recorded_at
        """
    ).fetchall()

    connection.close()

    phone_groups = {}

    for record in records:
        phone_number = record["phone_number"]

        if phone_number not in phone_groups:
            phone_groups[phone_number] = {
                "phone_number": phone_number,
                "aliases": [],
                "records": [],
            }

        phone_groups[phone_number]["aliases"].append(record["alias_name"])
        phone_groups[phone_number]["records"].append(
            {
                "id": record["id"],
                "alias_name": record["alias_name"],
                "platform": record["platform"],
                "location": record["location"],
                "recorded_at": record["recorded_at"],
            }
        )

    results = []

    for phone_data in phone_groups.values():
        unique_aliases = list(set(phone_data["aliases"]))

        results.append(
            {
                "phone_number": phone_data["phone_number"],
                "aliases": unique_aliases,
                "alias_count": len(unique_aliases),
                "possible_link": len(unique_aliases) > 1,
                "records": phone_data["records"],
            }
        )

    return {
        "total_phone_numbers": len(results),
        "possible_links": sum(
            1 for item in results if item["possible_link"]
        ),
        "phone_records": results,
    }