from fastapi import APIRouter
from sqlalchemy import text

from app.database import get_db

router = APIRouter(prefix="/dual-graph", tags=["Dual Graph"])


@router.get("/")
def get_dual_graph():
    db = next(get_db())

    aliases = db.execute(text("SELECT id, alias_name FROM aliases")).fetchall()

    nodes = [
        {"id": row[0], "alias_name": row[1]}
        for row in aliases
    ]

    # ---------- CONNECTED LINKS (direct evidence) ----------
    connected_links = []

    shared_phones = db.execute(text("""
        SELECT phone_number, COUNT(DISTINCT alias_name) AS alias_count
        FROM phone_records
        GROUP BY phone_number
        HAVING COUNT(DISTINCT alias_name) >= 2
    """)).fetchall()

    for phone_row in shared_phones:
        phone_number = phone_row[0]

        alias_rows = db.execute(text("""
            SELECT DISTINCT alias_name
            FROM phone_records
            WHERE phone_number = :phone_number
        """), {"phone_number": phone_number}).fetchall()

        alias_names = [row[0] for row in alias_rows]

        for i in range(len(alias_names)):
            for j in range(i + 1, len(alias_names)):
                connected_links.append({
                    "source": alias_names[i],
                    "target": alias_names[j],
                    "reason": f"Shared phone number {phone_number}",
                    "strength": "Strong",
                })

    # ---------- POTENTIAL LINKS (indirect evidence) ----------
    potential_links = []

    shared_topics = db.execute(text("""
        SELECT p.topic, COUNT(DISTINCT a.alias_name) AS alias_count
        FROM posts p
        JOIN aliases a ON p.alias_id = a.id
        WHERE p.topic IS NOT NULL
        GROUP BY p.topic
        HAVING COUNT(DISTINCT a.alias_name) >= 2
    """)).fetchall()

    for topic_row in shared_topics:
        topic = topic_row[0]

        alias_rows = db.execute(text("""
            SELECT DISTINCT a.alias_name
            FROM posts p
            JOIN aliases a ON p.alias_id = a.id
            WHERE p.topic = :topic
        """), {"topic": topic}).fetchall()

        alias_names = [row[0] for row in alias_rows]

        for i in range(len(alias_names)):
            for j in range(i + 1, len(alias_names)):
                potential_links.append({
                    "source": alias_names[i],
                    "target": alias_names[j],
                    "reason": f"Similar post topic: {topic}",
                    "strength": "Potential",
                })

    db.close()

    return {
        "nodes": nodes,
        "connected_links": connected_links,
        "potential_links": potential_links,
    }