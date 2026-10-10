from fastapi import APIRouter, HTTPException

router = APIRouter(
    tags=["Analysis"],
)

# Mock identity-link analysis result
@router.get("/identity-link/{alias_a_id}/{alias_b_id}")
def analyze_identity_link(alias_a_id: int, alias_b_id: int):
    # Simple mock logic for now
    if alias_a_id == alias_b_id:
        raise HTTPException(status_code=400, detail="Alias A and Alias B must be different")

    # Deterministic mock result based on IDs
    base_score = 60 + ((alias_a_id + alias_b_id) % 30)
    writing_score = 50 + ((alias_a_id * 7 + alias_b_id * 3) % 40)
    wallet_score = 40 + ((alias_a_id * 5 + alias_b_id * 9) % 50)
    behaviour_score = 55 + ((alias_a_id * 11 + alias_b_id * 2) % 35)

    final_score = round((writing_score * 0.35 + wallet_score * 0.35 + behaviour_score * 0.30), 1)

    if final_score >= 80:
        risk_level = "High"
    elif final_score >= 60:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    common_words = ["opsec", "market", "vendor", "escrow"]
    common_wallets = [
        "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    ]

    return {
        "alias_a_id": alias_a_id,
        "alias_b_id": alias_b_id,
        "final_confidence_score": final_score,
        "risk_level": risk_level,
        "writing_style_score": round(writing_score, 1),
        "wallet_score": round(wallet_score, 1),
        "behaviour_score": round(behaviour_score, 1),
        "common_words": common_words,
        "common_wallets": common_wallets,
    }

@router.get("/reports")
def get_reports():
    return [
        {
            "id": "REPORT-001",
            "case_id": "CASE-001",
            "alias_a": "ShadowFox",
            "alias_b": "NightCipher",
            "confidence_score": 78.0,
            "risk_level": "Medium",
            "evidence_count": 5,
            "status": "Investigator Review Required",
            "created_at": "2026-10-07T10:30:00Z",
        }
    ]