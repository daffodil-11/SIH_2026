from fastapi import APIRouter
from sqlalchemy import text

from app.database import get_db

router = APIRouter(prefix="/timeline", tags=["Timeline"])


def get_value(row_mapping, *column_names, default=None):
    for column_name in column_names:
        if column_name in row_mapping and row_mapping[column_name] is not None:
            return row_mapping[column_name]
    return default


@router.get("/")
def get_timeline():
    db = next(get_db())

    events = []

    # Posts
    posts = db.execute(text("SELECT * FROM posts")).fetchall()

    for row in posts:
        row_data = row._mapping

        events.append({
            "id": f"post-{get_value(row_data, 'id', default='0')}",
            "alias_name": get_value(
                row_data,
                "alias_name",
                default="Unknown Alias"
            ),
            "event_type": "Post",
            "title": get_value(
                row_data,
                "topic",
                "title",
                default="Forum Post"
            ),
            "description": get_value(
                row_data,
                "post_text",
                "content",
                default="No post text available."
            ),
            "source": get_value(
                row_data,
                "source_reference",
                "source",
                default="Unknown Source"
            ),
            "timestamp": get_value(
                row_data,
                "posted_at",
                "timestamp",
                "created_at",
                default=None
            ),
        })

    # Wallet activity
    wallets = db.execute(text("SELECT * FROM wallets")).fetchall()

    for row in wallets:
        row_data = row._mapping

        wallet_address = get_value(
            row_data,
            "address",
            "wallet_address",
            "wallet",
            default="Unknown Wallet"
        )

        wallet_network = get_value(
            row_data,
            "network",
            "blockchain",
            "chain",
            default="Unknown Network"
        )

        events.append({
            "id": f"wallet-{get_value(row_data, 'id', default='0')}",
            "alias_name": get_value(
                row_data,
                "alias_name",
                default="Unknown Alias"
            ),
            "event_type": "Wallet Activity",
            "title": f"Wallet used on {wallet_network}",
            "description": f"Wallet address {wallet_address} was active.",
            "source": wallet_network,
            "timestamp": get_value(
                row_data,
                "first_seen",
                "created_at",
                "timestamp",
                default=None
            ),
        })

    # Transactions
    transactions = db.execute(text("SELECT * FROM transactions")).fetchall()

    for row in transactions:
        row_data = row._mapping

        sender = get_value(row_data, "sender", "sender_address", default="Unknown Sender")
        receiver = get_value(row_data, "receiver", "receiver_address", default="Unknown Receiver")
        amount = get_value(row_data, "amount", "value", default="Unknown Amount")
        network = get_value(row_data, "network", "blockchain", "chain", default="Unknown Network")

        events.append({
            "id": f"transaction-{get_value(row_data, 'id', default='0')}",
            "alias_name": "Blockchain",
            "event_type": "Transaction",
            "title": f"Transaction on {network}",
            "description": f"{amount} sent from {sender} to {receiver}.",
            "source": network,
            "timestamp": get_value(
                row_data,
                "timestamp",
                "transaction_time",
                "created_at",
                default=None
            ),
        })

    # Phone records
    phone_records = db.execute(text("SELECT * FROM phone_records")).fetchall()

    for row in phone_records:
        row_data = row._mapping

        phone_number = get_value(
            row_data,
            "phone_number",
            "phone",
            default="Unknown Phone"
        )

        location = get_value(
            row_data,
            "location",
            "city",
            default="Unknown Location"
        )

        events.append({
            "id": f"phone-{get_value(row_data, 'id', default='0')}",
            "alias_name": get_value(
                row_data,
                "alias_name",
                default="Unknown Alias"
            ),
            "event_type": "Phone Record",
            "title": f"Phone {phone_number} used",
            "description": f"Phone {phone_number} was used at {location}.",
            "source": "Phone Verification",
            "timestamp": get_value(
                row_data,
                "recorded_at",
                "timestamp",
                "created_at",
                default=None
            ),
        })

    db.close()

    # Remove events without a valid time and sort oldest first
    events = [
        event for event in events
        if event["timestamp"] is not None
    ]

    events.sort(key=lambda event: event["timestamp"])

    return {
        "total_events": len(events),
        "events": events,
    }