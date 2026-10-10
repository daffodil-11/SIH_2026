from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from app.database import Base


class Alias(Base):
    __tablename__ = "aliases"

    id = Column(Integer, primary_key=True, index=True)
    alias_name = Column(String, unique=True, index=True, nullable=False)
    platform = Column(String, nullable=False)
    contact_detail = Column(String, nullable=True)
    active_hour = Column(Integer, nullable=True)
    is_restricted = Column(Boolean, default=False)


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    alias_id = Column(Integer, ForeignKey("aliases.id"), nullable=False)
    post_text = Column(Text, nullable=False)
    language = Column(String, default="English")
    topic = Column(String, nullable=True)
    posted_at = Column(DateTime, default=datetime.utcnow)
    source_reference = Column(String, nullable=True)


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    alias_id = Column(Integer, ForeignKey("aliases.id"), nullable=False)
    wallet_address = Column(String, index=True, nullable=False)
    currency = Column(String, nullable=False)
    source_reference = Column(String, nullable=True)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    alias_id = Column(
        Integer,
        ForeignKey("aliases.id"),
        nullable=False
    )

    transaction_hash = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    from_wallet = Column(String, nullable=False)
    to_wallet = Column(String, nullable=False)

    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)

    transacted_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    source_reference = Column(String, nullable=True)

    evidence_status = Column(
        String,
        default="Observed"
    )

class InvestigationReport(Base):
    __tablename__ = "investigation_reports"

    id = Column(Integer, primary_key=True, index=True)
    alias_a_id = Column(
        Integer,
        ForeignKey("aliases.id"),
        nullable=False,
    )
    alias_b_id = Column(
        Integer,
        ForeignKey("aliases.id"),
        nullable=False,
    )
    writing_style_score = Column(Float, nullable=False)
    wallet_score = Column(Float, nullable=False)
    behavior_score = Column(Float, nullable=False)
    transaction_score = Column(Float, nullable=False)
    final_confidence_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    result_json = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

from typing import List, Optional
from pydantic import BaseModel


class EvidenceItem(BaseModel):
    evidence_id: str
    category: str
    description: str
    source: str
    timestamp: str
    status: str
    weight: float
    contribution: float


class ScoreBreakdown(BaseModel):
    writing_style: float
    behaviour: float
    wallet: float
    language: float
    transactions: float


class AnalysisResult(BaseModel):
    case_id: str
    alias_a: str
    alias_b: str
    match_count: int
    similarity_percentage: float
    confidence_score: float
    score_breakdown: ScoreBreakdown
    evidence: List[EvidenceItem]
    graph_status: str
    investigator_note: str