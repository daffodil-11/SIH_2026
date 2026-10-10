from datetime import datetime

from app.database import Base, SessionLocal, engine
from app.models import Alias, Transaction


Base.metadata.create_all(bind=engine)

db = SessionLocal()

db.query(Transaction).delete()

aliases = {
    alias.alias_name: alias.id
    for alias in db.query(Alias).all()
}

sample_transactions = [
    Transaction(
        alias_id=aliases["ShadowFox"],
        transaction_hash="0xTXN-SHADOW-001",
        from_wallet="0xABC123",
        to_wallet="0xPAY777",
        amount=1.25,
        currency="ETH",
        transacted_at=datetime(2026, 1, 10, 23, 20),
        source_reference="Chain-Evidence-T001",
        evidence_status="Observed"
    ),
    Transaction(
        alias_id=aliases["NightCoder"],
        transaction_hash="0xTXN-NIGHT-001",
        from_wallet="0xABC123",
        to_wallet="0xPAY777",
        amount=1.25,
        currency="ETH",
        transacted_at=datetime(2026, 1, 11, 0, 15),
        source_reference="Chain-Evidence-T002",
        evidence_status="Observed"
    ),
    Transaction(
        alias_id=aliases["CipherNet"],
        transaction_hash="0xTXN-CIPHER-001",
        from_wallet="0xABC123",
        to_wallet="0xPAY777",
        amount=0.75,
        currency="ETH",
        transacted_at=datetime(2026, 1, 17, 22, 40),
        source_reference="Chain-Evidence-T003",
        evidence_status="Observed"
    ),
    Transaction(
        alias_id=aliases["CryptoKing"],
        transaction_hash="0xTXN-CRYPTO-001",
        from_wallet="0xDEF456",
        to_wallet="0xESCROW111",
        amount=0.50,
        currency="BTC",
        transacted_at=datetime(2026, 1, 15, 14, 25),
        source_reference="Chain-Evidence-T004",
        evidence_status="Observed"
    ),
    Transaction(
        alias_id=aliases["WalletGhost"],
        transaction_hash="0xTXN-GHOST-001",
        from_wallet="0xXYZ999",
        to_wallet="0xEXCHANGE222",
        amount=0.30,
        currency="BTC",
        transacted_at=datetime(2026, 1, 16, 9, 15),
        source_reference="Chain-Evidence-T005",
        evidence_status="Inferred"
    ),
    Transaction(
        alias_id=aliases["DarkMerchant"],
        transaction_hash="0xTXN-MERCHANT-001",
        from_wallet="0xLMN777",
        to_wallet="0xMARKET333",
        amount=2.00,
        currency="BTC",
        transacted_at=datetime(2026, 1, 18, 16, 35),
        source_reference="Chain-Evidence-T006",
        evidence_status="Restricted"
    )
]

db.add_all(sample_transactions)
db.commit()
db.close()

print("Sample transaction data added successfully.")