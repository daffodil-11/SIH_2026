from app.database import Base, SessionLocal, engine
from app.models import Alias, Wallet


Base.metadata.create_all(bind=engine)

db = SessionLocal()

db.query(Wallet).delete()

aliases = {
    alias.alias_name: alias.id
    for alias in db.query(Alias).all()
}

sample_wallets = [
    Wallet(
        alias_id=aliases["ShadowFox"],
        wallet_address="0xABC123",
        currency="ETH",
        source_reference="ForumA-W001"
    ),
    Wallet(
        alias_id=aliases["NightCoder"],
        wallet_address="0xABC123",
        currency="ETH",
        source_reference="ForumB-W001"
    ),
    Wallet(
        alias_id=aliases["CryptoKing"],
        wallet_address="0xDEF456",
        currency="BTC",
        source_reference="MarketA-W001"
    ),
    Wallet(
        alias_id=aliases["WalletGhost"],
        wallet_address="0xXYZ999",
        currency="BTC",
        source_reference="ForumC-W001"
    ),
    Wallet(
        alias_id=aliases["CipherNet"],
        wallet_address="0xABC123",
        currency="ETH",
        source_reference="ForumA-W002"
    ),
    Wallet(
        alias_id=aliases["DarkMerchant"],
        wallet_address="0xLMN777",
        currency="BTC",
        source_reference="MarketB-W001"
    )
]

db.add_all(sample_wallets)
db.commit()
db.close()

print("Sample wallet data added successfully.")