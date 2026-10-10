from fastapi import APIRouter, HTTPException

router = APIRouter(
    tags=["Evidence"],
)

# Mock evidence data
EVIDENCE_DB = [
    {
        "id": "EV-001",
        "case_id": "CASE-001",
        "alias_id": 1,
        "alias_name": "ShadowFox",
        "type": "post",
        "title": "Vendor reputation thread",
        "content": "Always check vendor history before trusting escrow. Opsec matters.",
        "source": "Dark Forum",
        "timestamp": "2026-09-15T14:22:00Z",
        "risk_indicator": "vendor discussion",
    },
    {
        "id": "EV-002",
        "case_id": "CASE-001",
        "alias_id": 2,
        "alias_name": "NightCipher",
        "type": "message",
        "title": "Private message about market",
        "content": "Market is down, move to backup. Keep opsec tight.",
        "source": "Marketplace",
        "timestamp": "2026-09-18T09:10:00Z",
        "risk_indicator": "market downtime",
    },
    {
        "id": "EV-003",
        "case_id": "CASE-001",
        "alias_id": 1,
        "alias_name": "ShadowFox",
        "type": "post",
        "title": "Escrow best practices",
        "content": "Use multi-sig escrow when possible. Never reuse addresses.",
        "source": "Dark Forum",
        "timestamp": "2026-09-22T18:45:00Z",
        "risk_indicator": "escrow discussion",
    },
    {
        "id": "EV-004",
        "case_id": "CASE-001",
        "alias_id": 4,
        "alias_name": "ZeroTrace",
        "type": "file",
        "title": "Operational notes",
        "content": "Do not mix wallets. Rotate IPs. No personal info anywhere.",
        "source": "Dark Forum",
        "timestamp": "2026-09-25T11:30:00Z",
        "risk_indicator": "opsec guidelines",
    },
]

@router.get("/evidence")
def list_evidence(case_id: str = "CASE-001"):
    # Filter by case_id
    return [e for e in EVIDENCE_DB if e["case_id"] == case_id]

@router.get("/evidence/{evidence_id}")
def get_evidence(evidence_id: str):
    for e in EVIDENCE_DB:
        if e["id"] == evidence_id:
            return e
    raise HTTPException(status_code=404, detail="Evidence not found")