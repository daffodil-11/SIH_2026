import re
from typing import Dict, List, Set

from sqlalchemy.orm import Session

from app.models import Post


STOP_WORDS = {
    "the", "and", "for", "with", "that", "this", "from",
    "through", "only", "after", "before", "are", "was",
    "will", "have", "has", "use", "using", "should",
    "into", "your", "their", "they", "them", "you",
    "our", "but", "not", "all", "can", "get"
}


def clean_words(text: str) -> Set[str]:
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())

    return {
        word for word in words
        if word not in STOP_WORDS
    }


def get_alias_words(posts: List[Post]) -> Set[str]:
    all_words = set()

    for post in posts:
        all_words.update(clean_words(post.post_text))

    return all_words


def calculate_writing_similarity(
    db: Session,
    alias_a_id: int,
    alias_b_id: int
) -> Dict:
    alias_a_posts = db.query(Post).filter(
        Post.alias_id == alias_a_id
    ).all()

    alias_b_posts = db.query(Post).filter(
        Post.alias_id == alias_b_id
    ).all()

    if not alias_a_posts or not alias_b_posts:
        return {
            "similarity_score": 0,
            "common_words": [],
            "common_word_count": 0,
            "message": "One or both aliases do not have forum posts."
        }

    alias_a_words = get_alias_words(alias_a_posts)
    alias_b_words = get_alias_words(alias_b_posts)

    common_words = sorted(alias_a_words.intersection(alias_b_words))
    total_unique_words = alias_a_words.union(alias_b_words)

    if not total_unique_words:
        similarity_score = 0
    else:
        similarity_score = round(
            (len(common_words) / len(total_unique_words)) * 100,
            2
        )

    return {
        "similarity_score": similarity_score,
        "common_words": common_words,
        "common_word_count": len(common_words),
        "alias_a_post_count": len(alias_a_posts),
        "alias_b_post_count": len(alias_b_posts),
        "message": "Writing-style similarity calculated successfully."
    }