import time
from fastapi import APIRouter
from sqlalchemy import text

from langdetect import detect, DetectorFactory
from deep_translator import GoogleTranslator

from app.database import get_db

DetectorFactory.seed = 0

router = APIRouter(prefix="/multilingual", tags=["Multilingual"])

# Simple in-memory cache to avoid re-translating the same text
translation_cache = {}


@router.get("/")
def get_multilingual_analysis(target_language: str = "en"):
    db = next(get_db())

    posts = db.execute(text("""
        SELECT p.id, a.alias_name, p.post_text, p.language, p.posted_at
        FROM posts p
        JOIN aliases a ON p.alias_id = a.id
    """)).fetchall()

    results = []

    for row in posts:
        post_id = row[0]
        alias_name = row[1]
        original_text = row[2] or ""
        stored_language = row[3] or "Unknown"
        posted_at = row[4]

        detected_language = "unknown"
        translated_text = original_text
        translation_status = "Not translated"
        translation_error = None

        if original_text.strip():
            try:
                detected_language = detect(original_text)
            except Exception as detect_error:
                detected_language = "unknown"
                translation_error = f"Language detection failed: {detect_error}"

            cache_key = (original_text, target_language)

            if detected_language and detected_language != target_language:
                if cache_key in translation_cache:
                    translated_text = translation_cache[cache_key]
                    translation_status = "Translated (cached)"
                else:
                    try:
                        # Small delay to avoid Google rate limit
                        time.sleep(1.2)
                        translated_text = GoogleTranslator(
                            source="auto",
                            target=target_language
                        ).translate(original_text)
                        translation_cache[cache_key] = translated_text
                        translation_status = "Translated"
                    except Exception as translate_error:
                        translation_status = "Translation failed"
                        translation_error = str(translate_error)
            else:
                translation_status = "Already in target language"

        results.append({
            "post_id": post_id,
            "alias_name": alias_name,
            "original_text": original_text,
            "stored_language": stored_language,
            "detected_language": detected_language,
            "translated_text": translated_text,
            "translation_status": translation_status,
            "translation_error": translation_error,
            "posted_at": str(posted_at),
        })

    db.close()

    return {
        "target_language": target_language,
        "total_posts": len(results),
        "posts": results,
    }


@router.get("/translate-single")
def translate_single_post(post_id: int, target_language: str = "en"):
    db = next(get_db())

    row = db.execute(text("""
        SELECT p.post_text
        FROM posts p
        WHERE p.id = :post_id
    """), {"post_id": post_id}).fetchall()

    db.close()

    if not row:
        return {"error": "Post not found"}

    original_text = row[0][0] or ""

    cache_key = (original_text, target_language)

    if cache_key in translation_cache:
        return {
            "post_id": post_id,
            "original_text": original_text,
            "translated_text": translation_cache[cache_key],
            "status": "Translated (cached)",
        }

    try:
        time.sleep(1.2)
        translated_text = GoogleTranslator(
            source="auto",
            target=target_language
        ).translate(original_text)
        translation_cache[cache_key] = translated_text

        return {
            "post_id": post_id,
            "original_text": original_text,
            "translated_text": translated_text,
            "status": "Translated",
        }
    except Exception as translate_error:
        return {
            "post_id": post_id,
            "original_text": original_text,
            "translated_text": original_text,
            "status": "Translation failed",
            "error": str(translate_error),
        }