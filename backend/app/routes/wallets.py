from fastapi import APIRouter


router = APIRouter(
    prefix="/wallets",
    tags=["Wallets"],
)


@router.get("/")
def get_wallets():
    return [
        {
            "id": 1,
            "address": "0x7A91...F31C",
            "network": "Ethereum",
            "alias_name": "ShadowFox",
            "transaction_count": 12,
            "first_seen": "2026-01-14",
            "last_seen": "2026-10-05",
            "status": "Observed",
        },
        {
            "id": 2,
            "address": "bc1q...9K2M",
            "network": "Bitcoin",
            "alias_name": "NightCipher",
            "transaction_count": 8,
            "first_seen": "2026-02-20",
            "last_seen": "2026-10-02",
            "status": "Inferred",
        },
        {
            "id": 3,
            "address": "0xB284...7AC9",
            "network": "Ethereum",
            "alias_name": "GhostNode",
            "transaction_count": 5,
            "first_seen": "2026-03-11",
            "last_seen": "2026-09-28",
            "status": "Observed",
        },
    ]