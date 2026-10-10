from datetime import datetime

from app.database import Base, SessionLocal, engine
from app.models import Alias, Post


Base.metadata.create_all(bind=engine)

db = SessionLocal()

db.query(Post).delete()

aliases = {
    alias.alias_name: alias.id
    for alias in db.query(Alias).all()
}

sample_posts = [
    Post(
        alias_id=aliases["ShadowFox"],
        post_text="Payment accepted only through Bitcoin wallet. Fast and private delivery.",
        language="English",
        topic="Cryptocurrency payment",
        posted_at=datetime(2026, 1, 10, 23, 15),
        source_reference="ForumA-P001"
    ),
    Post(
        alias_id=aliases["ShadowFox"],
        post_text="Use encrypted communication and complete the payment before midnight.",
        language="English",
        topic="Security communication",
        posted_at=datetime(2026, 1, 12, 23, 40),
        source_reference="ForumA-P002"
    ),
    Post(
        alias_id=aliases["NightCoder"],
        post_text="Bitcoin payment is accepted. Use private communication and pay before midnight.",
        language="English",
        topic="Cryptocurrency payment",
        posted_at=datetime(2026, 1, 11, 0, 10),
        source_reference="ForumB-P001"
    ),
    Post(
        alias_id=aliases["NightCoder"],
        post_text="Fast private delivery after wallet confirmation. Encrypted chat only.",
        language="English",
        topic="Security communication",
        posted_at=datetime(2026, 1, 13, 0, 25),
        source_reference="ForumB-P002"
    ),
    Post(
        alias_id=aliases["CryptoKing"],
        post_text="New marketplace listing available. Ethereum payments and escrow supported.",
        language="English",
        topic="Marketplace listing",
        posted_at=datetime(2026, 1, 15, 14, 20),
        source_reference="MarketA-P001"
    ),
    Post(
        alias_id=aliases["WalletGhost"],
        post_text="Looking for secure crypto exchange partners. Payment terms are flexible.",
        language="English",
        topic="Cryptocurrency exchange",
        posted_at=datetime(2026, 1, 16, 9, 10),
        source_reference="ForumC-P001"
    ),
    Post(
        alias_id=aliases["CipherNet"],
        post_text="Encrypted communication is required. Bitcoin payment should be completed quickly.",
        language="English",
        topic="Security communication",
        posted_at=datetime(2026, 1, 17, 22, 35),
        source_reference="ForumA-P003"
    ),
    Post(
        alias_id=aliases["DarkMerchant"],
        post_text="Restricted marketplace profile. Listing details are currently unavailable.",
        language="English",
        topic="Restricted data",
        posted_at=datetime(2026, 1, 18, 16, 30),
        source_reference="MarketB-P001"
    )
]

db.add_all(sample_posts)
db.commit()
db.close()

print("Sample forum posts added successfully.")