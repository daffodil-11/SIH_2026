from typing import Any


WEIGHTS = {
    "writing_style": 0.35,
    "wallet": 0.25,
    "behaviour": 0.20,
    "transactions": 0.15,
    "language": 0.05,
}


def clamp_score(value: float) -> float:
    return round(max(0.0, min(100.0, value)), 2)


def calculate_similarity(
    writing_style_score: float,
    wallet_score: float,
    behaviour_score: float,
    transaction_score: float,
    language_score: float,
) -> dict[str, Any]:
    weighted_components = {
        "writing_style": clamp_score(writing_style_score)
        * WEIGHTS["writing_style"],
        "wallet": clamp_score(wallet_score) * WEIGHTS["wallet"],
        "behaviour": clamp_score(behaviour_score)
        * WEIGHTS["behaviour"],
        "transactions": clamp_score(transaction_score)
        * WEIGHTS["transactions"],
        "language": clamp_score(language_score)
        * WEIGHTS["language"],
    }

    final_confidence_score = round(
        sum(weighted_components.values()),
        2,
    )

    if final_confidence_score >= 75:
        risk_level = "High"
    elif final_confidence_score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    explanations = [
        {
            "factor": "Writing style",
            "raw_score": clamp_score(writing_style_score),
            "weight": WEIGHTS["writing_style"],
            "contribution": round(
                weighted_components["writing_style"],
                2,
            ),
            "reason": "Sentence structure, punctuation, and word usage similarity.",
        },
        {
            "factor": "Wallet evidence",
            "raw_score": clamp_score(wallet_score),
            "weight": WEIGHTS["wallet"],
            "contribution": round(
                weighted_components["wallet"],
                2,
            ),
            "reason": "Shared or connected wallet evidence.",
        },
        {
            "factor": "Behaviour",
            "raw_score": clamp_score(behaviour_score),
            "weight": WEIGHTS["behaviour"],
            "contribution": round(
                weighted_components["behaviour"],
                2,
            ),
            "reason": "Activity timing and posting behaviour similarity.",
        },
        {
            "factor": "Transactions",
            "raw_score": clamp_score(transaction_score),
            "weight": WEIGHTS["transactions"],
            "contribution": round(
                weighted_components["transactions"],
                2,
            ),
            "reason": "Transaction relationship and flow evidence.",
        },
        {
            "factor": "Language",
            "raw_score": clamp_score(language_score),
            "weight": WEIGHTS["language"],
            "contribution": round(
                weighted_components["language"],
                2,
            ),
            "reason": "Detected language compatibility between samples.",
        },
    ]

    return {
        "final_confidence_score": final_confidence_score,
        "risk_level": risk_level,
        "weighted_components": weighted_components,
        "explanations": explanations,
    }