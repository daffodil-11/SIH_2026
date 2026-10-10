from fastapi import APIRouter


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


@router.get("/")
def get_transactions():
    return [
        {
            "id": 1,
            "transaction_hash": "TX-1048-AF91",
            "network": "Ethereum",
            "sender": "0x7A91...F31C",
            "receiver": "0xB284...7AC9",
            "amount": "1.42 ETH",
            "timestamp": "2026-10-05T14:22:00Z",
            "relationship": "Wallet-to-wallet transfer",
            "status": "Observed",
        },
        {
            "id": 2,
            "transaction_hash": "TX-2091-CB72",
            "network": "Bitcoin",
            "sender": "bc1q...9K2M",
            "receiver": "bc1q...4P8R",
            "amount": "0.083 BTC",
            "timestamp": "2026-10-02T08:47:00Z",
            "relationship": "Common counterparty",
            "status": "Inferred",
        },
        {
            "id": 3,
            "transaction_hash": "TX-3317-DE44",
            "network": "Ethereum",
            "sender": "0xB284...7AC9",
            "receiver": "0x7A91...F31C",
            "amount": "0.64 ETH",
            "timestamp": "2026-09-28T19:11:00Z",
            "relationship": "Potential link",
            "status": "Inferred",
        },
    ]