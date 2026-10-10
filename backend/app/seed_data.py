from app.database import Base, SessionLocal, engine
from app.models import Alias


Base.metadata.create_all(bind=engine)

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
db.close()

print("Sample alias data added successfully.")