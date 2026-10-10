from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class AliasResponse(BaseModel):
    id: int
    alias_name: str
    platform: str
    contact_detail: Optional[str] = None
    active_hour: Optional[int] = None
    is_restricted: bool

model_config = ConfigDict(from_attributes=True)

class PostResponse(BaseModel):
    id: int
    alias_id: int
    post_text: str
    language: str
    topic: Optional[str] = None
    posted_at: datetime
    source_reference: Optional[str] = None

model_config = ConfigDict(from_attributes=True)


class WritingStyleRequest(BaseModel):
    alias_a_id: int
    alias_b_id: int


class WritingStyleResponse(BaseModel):
    alias_a_id: int
    alias_b_id: int
    similarity_score: float
    common_words: List[str]
    common_word_count: int
    alias_a_post_count: int
    alias_b_post_count: int
    message: str

class WalletResponse(BaseModel):
    id: int
    alias_id: int
    wallet_address: str
    currency: str
    source_reference: Optional[str] = None

model_config = ConfigDict(from_attributes=True)
class WalletSimilarityResponse(BaseModel):
    alias_a_id: int
    alias_b_id: int
    similarity_score: float
    common_wallet_addresses: list
    common_wallet_count: int
    alias_a_wallet_count: int
    alias_b_wallet_count: int
    message: str

class AliasComparisonRequest(BaseModel):
    alias_a_id: int
    alias_b_id: int

class IdentityLinkResponse(BaseModel):
    alias_a_id: int
    alias_b_id: int
    writing_style_score: float
    wallet_score: float
    behavior_score: float
    hour_difference: int
    final_confidence_score: float
    risk_level: str
    common_wallet_addresses: list
    common_wallet_count: int
    common_words: list
    common_word_count: int
    message: str
class BehaviorSimilarityResponse(BaseModel):
    alias_a_id: int
    alias_b_id: int
    alias_a_active_hour: int
    alias_b_active_hour: int
    hour_difference: int
    behavior_score: float
    message: str

class TransactionResponse(BaseModel):
    id: int
    alias_id: int
    transaction_hash: str
    from_wallet: str
    to_wallet: str
    amount: float
    currency: str
    transacted_at: datetime
    source_reference: Optional[str] = None
    evidence_status: str

model_config = ConfigDict(from_attributes=True)

class InvestigationReportResponse(BaseModel):
    id: int
    alias_a_id: int
    alias_b_id: int
    writing_style_score: float
    wallet_score: float
    behavior_score: float
    transaction_score: float
    final_confidence_score: float
    risk_level: str
    result_json: str
    created_at: datetime

model_config = ConfigDict(from_attributes=True)
