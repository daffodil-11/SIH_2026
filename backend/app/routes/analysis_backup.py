import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Alias, Post, Transaction, Wallet
from app.schemas import (
    AliasComparisonRequest,
    BehaviorSimilarityResponse,
    WalletSimilarityResponse,
    WritingStyleRequest,
    WritingStyleResponse,
)


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.get("/transaction/{alias_id_1}/{alias_id_2}")
def analyze_transaction_link(
    alias_id_1: int,
    alias_id_2: int,
    db: Session = Depends(get_db),
):
    alias_1 = db.query(Alias).filter(Alias.id == alias_id_1).first()
    alias_2 = db.query(Alias).filter(Alias.id == alias_id_2).first()

    if not alias_1 or not alias_2:
        raise HTTPException(
            status_code=404,
            detail="One or both alias IDs do not exist.",
        )

    transactions_1 = (
        db.query(Transaction)
        .filter(Transaction.alias_id == alias_id_1)
        .all()
    )

    transactions_2 = (
        db.query(Transaction)
        .filter(Transaction.alias_id == alias_id_2)
        .all()
    )

    receivers_1 = {
        transaction.to_wallet
        for transaction in transactions_1
        if transaction.to_wallet
    }

    receivers_2 = {
        transaction.to_wallet
        for transaction in transactions_2
        if transaction.to_wallet
    }

    shared_receivers = list(
        receivers_1.intersection(receivers_2)
    )

    references_1 = {
        transaction.source_reference
        for transaction in transactions_1
        if transaction.source_reference
    }

    references_2 = {
        transaction.source_reference
        for transaction in transactions_2
        if transaction.source_reference
    }

    shared_references = list(
        references_1.intersection(references_2)
    )

    score = 0

    if shared_receivers:
        score += 60

    if shared_references:
        score += 40

    score = min(score, 100)

    if score >= 80:
        confidence_level = "High"
    elif score >= 50:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    return {
        "alias_1": {
            "id": alias_1.id,
            "alias_name": alias_1.alias_name,
        },
        "alias_2": {
            "id": alias_2.id,
            "alias_name": alias_2.alias_name,
        },
        "transaction_analysis": {
            "shared_receiver_wallets": shared_receivers,
            "shared_source_references": shared_references,
            "transaction_link_score": score,
            "confidence_level": confidence_level,
        },
    }


@router.get("/identity-link/{alias_id_1}/{alias_id_2}")
def analyze_identity_link(
    alias_id_1: int,
    alias_id_2: int,
    db: Session = Depends(get_db),
):
    alias_1 = db.query(Alias).filter(Alias.id == alias_id_1).first()
    alias_2 = db.query(Alias).filter(Alias.id == alias_id_2).first()

    if not alias_1 or not alias_2:
        raise HTTPException(
            status_code=404,
            detail="One or both alias IDs do not exist.",
        )

    transactions_1 = (
        db.query(Transaction)
        .filter(Transaction.alias_id == alias_id_1)
        .all()
    )

    transactions_2 = (
        db.query(Transaction)
        .filter(Transaction.alias_id == alias_id_2)
        .all()
    )

    receiver_wallets_1 = {
        transaction.to_wallet
        for transaction in transactions_1
        if transaction.to_wallet
    }

    receiver_wallets_2 = {
        transaction.to_wallet
        for transaction in transactions_2
        if transaction.to_wallet
    }

    shared_receiver_wallets = list(
        receiver_wallets_1.intersection(receiver_wallets_2)
    )

    references_1 = {
        transaction.source_reference
        for transaction in transactions_1
        if transaction.source_reference
    }

    references_2 = {
        transaction.source_reference
        for transaction in transactions_2
        if transaction.source_reference
    }

    shared_source_references = list(
        references_1.intersection(references_2)
    )

    transaction_score = 0

    if shared_receiver_wallets:
        transaction_score += 60

    if shared_source_references:
        transaction_score += 40

    transaction_score = min(transaction_score, 100)

    wallet_score = 0

    if shared_receiver_wallets:
        wallet_score = 80

    final_score = round(
        (transaction_score * 0.6) + (wallet_score * 0.4),
        2,
    )

    if final_score >= 80:
        confidence_level = "High"
        conclusion = (
            "Strong evidence suggests that both aliases may be "
            "controlled by the same individual or group."
        )
    elif final_score >= 50:
        confidence_level = "Medium"
        conclusion = (
            "Some evidence links these aliases. Further investigation "
            "is recommended."
        )
    else:
        confidence_level = "Low"
        conclusion = (
            "There is currently insufficient evidence to establish "
            "a strong identity link."
        )

    return {
        "investigation_type": "Cross-Platform Identity Link Analysis",
        "alias_1": {
            "id": alias_1.id,
            "alias_name": alias_1.alias_name,
        },
        "alias_2": {
            "id": alias_2.id,
            "alias_name": alias_2.alias_name,
        },
        "evidence": {
            "shared_receiver_wallets": shared_receiver_wallets,
            "shared_source_references": shared_source_references,
            "transaction_score": transaction_score,
            "wallet_score": wallet_score,
        },
        "final_identity_link_score": final_score,
        "confidence_level": confidence_level,
        "conclusion": conclusion,
    }


STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "for",
    "from",
    "has",
    "have",
    "he",
    "her",
    "his",
    "i",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "or",
    "our",
    "she",
    "that",
    "the",
    "their",
    "them",
    "they",
    "this",
    "to",
    "was",
    "we",
    "were",
    "will",
    "with",
    "you",
    "your",
}


def extract_meaningful_words(posts):
    combined_text = " ".join(
        post.post_text for post in posts
    ).lower()

    words = re.findall(
        r"\b[a-zA-Z]{3,}\b",
        combined_text,
    )

    return {
        word
        for word in words
        if word not in STOP_WORDS
    }


@router.post(
    "/writing-style",
    response_model=WritingStyleResponse,
)
def compare_writing_style(
    request: WritingStyleRequest,
    db: Session = Depends(get_db),
):
    alias_a = (
        db.query(Alias)
        .filter(Alias.id == request.alias_a_id)
        .first()
    )

    alias_b = (
        db.query(Alias)
        .filter(Alias.id == request.alias_b_id)
        .first()
    )

    if not alias_a or not alias_b:
        raise HTTPException(
            status_code=404,
            detail="One or both alias IDs do not exist.",
        )

    if request.alias_a_id == request.alias_b_id:
        raise HTTPException(
            status_code=400,
            detail="Please select two different aliases.",
        )

    alias_a_posts = (
        db.query(Post)
        .filter(Post.alias_id == request.alias_a_id)
        .all()
    )

    alias_b_posts = (
        db.query(Post)
        .filter(Post.alias_id == request.alias_b_id)
        .all()
    )

    if not alias_a_posts or not alias_b_posts:
        raise HTTPException(
            status_code=400,
            detail=(
                "Both aliases must have at least one post "
                "for writing-style comparison."
            ),
        )

    words_a = extract_meaningful_words(alias_a_posts)
    words_b = extract_meaningful_words(alias_b_posts)

    common_words = sorted(words_a.intersection(words_b))
    all_unique_words = words_a.union(words_b)

    if all_unique_words:
        similarity_score = round(
            (len(common_words) / len(all_unique_words)) * 100,
            2,
        )
    else:
        similarity_score = 0.0

    if similarity_score >= 60:
        message = (
            "High writing-style similarity detected between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )
    elif similarity_score >= 30:
        message = (
            "Moderate writing-style similarity detected between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )
    else:
        message = (
            "Low writing-style similarity detected between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )

    return {
        "alias_a_id": request.alias_a_id,
        "alias_b_id": request.alias_b_id,
        "similarity_score": similarity_score,
        "common_words": common_words,
        "common_word_count": len(common_words),
        "alias_a_post_count": len(alias_a_posts),
        "alias_b_post_count": len(alias_b_posts),
        "message": message,
    }


@router.post(
    "/wallet-similarity",
    response_model=WalletSimilarityResponse,
)
def compare_wallets(
    request: AliasComparisonRequest,
    db: Session = Depends(get_db),
):
    alias_a = (
        db.query(Alias)
        .filter(Alias.id == request.alias_a_id)
        .first()
    )

    alias_b = (
        db.query(Alias)
        .filter(Alias.id == request.alias_b_id)
        .first()
    )

    if not alias_a or not alias_b:
        raise HTTPException(
            status_code=404,
            detail="One or both alias IDs do not exist.",
        )

    if request.alias_a_id == request.alias_b_id:
        raise HTTPException(
            status_code=400,
            detail="Please select two different aliases.",
        )

    alias_a_wallets = (
        db.query(Wallet)
        .filter(Wallet.alias_id == request.alias_a_id)
        .all()
    )

    alias_b_wallets = (
        db.query(Wallet)
        .filter(Wallet.alias_id == request.alias_b_id)
        .all()
    )

    if not alias_a_wallets or not alias_b_wallets:
        raise HTTPException(
            status_code=400,
            detail=(
                "Both aliases must have at least one wallet "
                "for wallet comparison."
            ),
        )

    addresses_a = {
        wallet.wallet_address.lower().strip()
        for wallet in alias_a_wallets
        if wallet.wallet_address
    }

    addresses_b = {
        wallet.wallet_address.lower().strip()
        for wallet in alias_b_wallets
        if wallet.wallet_address
    }

    common_wallet_addresses = sorted(
        addresses_a.intersection(addresses_b)
    )

    all_wallet_addresses = addresses_a.union(addresses_b)

    if all_wallet_addresses:
        similarity_score = round(
            (
                len(common_wallet_addresses)
                / len(all_wallet_addresses)
            ) * 100,
            2,
        )
    else:
        similarity_score = 0.0

    if common_wallet_addresses:
        message = (
            "Shared wallet evidence found between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )
    else:
        message = (
            "No identical wallet addresses were found between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )

    return {
        "alias_a_id": request.alias_a_id,
        "alias_b_id": request.alias_b_id,
        "similarity_score": similarity_score,
        "common_wallet_addresses": common_wallet_addresses,
        "common_wallet_count": len(common_wallet_addresses),
        "alias_a_wallet_count": len(addresses_a),
        "alias_b_wallet_count": len(addresses_b),
        "message": message,
    }


@router.post(
    "/behavior-similarity",
    response_model=BehaviorSimilarityResponse,
)
def compare_behavior(
    request: AliasComparisonRequest,
    db: Session = Depends(get_db),
):
    alias_a = (
        db.query(Alias)
        .filter(Alias.id == request.alias_a_id)
        .first()
    )

    alias_b = (
        db.query(Alias)
        .filter(Alias.id == request.alias_b_id)
        .first()
    )

    if not alias_a or not alias_b:
        raise HTTPException(
            status_code=404,
            detail="One or both alias IDs do not exist.",
        )

    if request.alias_a_id == request.alias_b_id:
        raise HTTPException(
            status_code=400,
            detail="Please select two different aliases.",
        )

    if alias_a.active_hour is None or alias_b.active_hour is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "Both aliases must have an active_hour value "
                "for behavior comparison."
            ),
        )

    raw_difference = abs(
        alias_a.active_hour - alias_b.active_hour
    )

    hour_difference = min(
        raw_difference,
        24 - raw_difference,
    )

    behavior_score = round(
        max(0, 100 - (hour_difference / 12 * 100)),
        2,
    )

    if behavior_score >= 70:
        message = (
            "High activity-hour similarity detected between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )
    elif behavior_score >= 40:
        message = (
            "Moderate activity-hour similarity detected between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )
    else:
        message = (
            "Low activity-hour similarity detected between "
            f"{alias_a.alias_name} and {alias_b.alias_name}."
        )

    return {
        "alias_a_id": request.alias_a_id,
        "alias_b_id": request.alias_b_id,
        "alias_a_active_hour": alias_a.active_hour,
        "alias_b_active_hour": alias_b.active_hour,
        "hour_difference": hour_difference,
        "behavior_score": behavior_score,
        "message": message,
    }