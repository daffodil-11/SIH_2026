from fastapi import APIRouter
from sqlalchemy import text

from app.database import get_db

router = APIRouter(prefix="/priority", tags=["Priority"])


@router.get("/")
def get_priority():
    db = next(get_db())

    aliases = db.execute(text("SELECT * FROM aliases")).fetchall()

    priority_list = []

    for alias_row in aliases:
        alias_data = alias_row._mapping
        alias_id = alias_data.get("id")
        alias_name = alias_data.get("alias_name", "Unknown Alias")

        post_count = db.execute(text("""
            SELECT COUNT(*) FROM posts WHERE alias_id = :alias_id
        """), {"alias_id": alias_id}).scalar() or 0

        wallet_count = db.execute(text("""
            SELECT COUNT(*) FROM wallets WHERE alias_id = :alias_id
        """), {"alias_id": alias_id}).scalar() or 0

        phone_count = db.execute(text("""
            SELECT COUNT(*) FROM phone_records WHERE alias_name = :alias_name
        """), {"alias_name": alias_name}).scalar() or 0

        possible_phone_links = db.execute(text("""
            SELECT COUNT(DISTINCT phone_number)
            FROM phone_records
            WHERE alias_name = :alias_name
            AND phone_number IN (
            SELECT phone_number
            FROM phone_records
            GROUP BY phone_number
            HAVING COUNT(DISTINCT alias_name) >= 2
            )
        """), {"alias_name": alias_name}).scalar() or 0
        try:
            transaction_count = db.execute(text("""
                SELECT COUNT(*)
                FROM transactions t
                JOIN wallets w ON t.sender = w.wallet_address
                WHERE w.alias_id = :alias_id
            """), {"alias_id": alias_id}).scalar() or 0
        except Exception:
            transaction_count = 0
        priority_score = (
            post_count * 2
            + wallet_count * 3
            + phone_count * 2
            + possible_phone_links * 5
            + transaction_count * 4
        )

        if priority_score >= 15:
            priority_level = "High"
        elif priority_score >= 7:
            priority_level = "Medium"
        else:
            priority_level = "Low"

        priority_list.append({
            "alias_id": alias_id,
            "alias_name": alias_name,
            "post_count": post_count,
            "wallet_count": wallet_count,
            "phone_count": phone_count,
            "possible_phone_links": possible_phone_links,
            "transaction_count": transaction_count,
            "priority_score": priority_score,
            "priority_level": priority_level,
        })

    db.close()

    priority_list.sort(
        key=lambda item: item["priority_score"],
        reverse=True
    )

    return {
        "total_aliases": len(priority_list),
        "priorities": priority_list,
    }