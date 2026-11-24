from app.database import Base, SessionLocal, engine
from app.models import Alias, Post

Base.metadata.create_all(bind=engine)
import app.seed_data

db = SessionLocal()

db.query(Alias).delete()

sample_aliases = [
    Alias(
        alias_name="ShadowFox",
        platform="ForumA",
        contact_detail="@shadow_contact",
        active_hour=23,
        is_restricted=False
    ),
    Alias(
        alias_name="NightCoder",
        platform="ForumB",
        contact_detail="@shadow_contact",
        active_hour=0,
        is_restricted=False
    ),
    Alias(
        alias_name="CryptoKing",
        platform="MarketA",
        contact_detail="@crypto_king",
        active_hour=14,
        is_restricted=False
    ),
    Alias(
        alias_name="WalletGhost",
        platform="ForumC",
        contact_detail=None,
        active_hour=9,
        is_restricted=False
    ),
    Alias(
        alias_name="CipherNet",
        platform="ForumA",
        contact_detail="@cipher_network",
        active_hour=22,
        is_restricted=False
    ),
    Alias(
        alias_name="DarkMerchant",
        platform="MarketB",
        contact_detail=None,
        active_hour=16,
        is_restricted=True
    )
]

db.add_all(sample_aliases)
db.commit()
sample_posts = [
    Post(
        alias_id=1,
        post_text="Looking for a trusted escrow service for a bulk order. BTC payment only.",
        language="English",
        topic="escrow",
        source_reference="SIM-FORUM-001",
    ),
    Post(
        alias_id=2,
        post_text="Selling premium accounts. BTC payment accepted. Contact through encrypted chat.",
        language="English",
        topic="marketplace",
        source_reference="SIM-MARKET-001",
    ),
    Post(
        alias_id=3,
        post_text="Recherche un service escrow fiable pour une commande importante. Paiement en BTC uniquement.",
        language="French",
        topic="escrow",
        source_reference="SIM-CHAT-001",
    ),
]

db.add_all(sample_posts)
db.commit()
db.close()

print("Sample alias data added successfully.")