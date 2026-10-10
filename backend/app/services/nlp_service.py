import re
from collections import Counter
from typing import Any

from lingua import Language, LanguageDetectorBuilder


detector = LanguageDetectorBuilder.from_languages(
    Language.ENGLISH,
    Language.HINDI,
    Language.RUSSIAN,
    Language.GERMAN,
    Language.FRENCH,
    Language.SPANISH,
).build()


def tokenize(text: str) -> list[str]:
    return re.findall(r"\b[a-zA-Z]{2,}\b", text.lower())


def detect_language(text: str) -> dict[str, Any]:
    if not text.strip():
        return {
            "language": "Unknown",
            "confidence": 0.0,
        }

    language = detector.detect_language_of(text)

    if language is None:
        return {
            "language": "Unknown",
            "confidence": 0.0,
        }

    confidence = detector.compute_language_confidence(text, language)

    return {
        "language": language.name,
        "confidence": round(confidence * 100, 2),
    }


def stylometry_features(text: str) -> dict[str, Any]:
    tokens = tokenize(text)
    sentences = re.split(r"[.!?]+", text)
    sentences = [sentence.strip() for sentence in sentences if sentence.strip()]

    word_count = len(tokens)
    character_count = len(text)
    sentence_count = len(sentences)

    average_word_length = (
        sum(len(token) for token in tokens) / word_count
        if word_count
        else 0
    )

    average_sentence_length = (
        word_count / sentence_count
        if sentence_count
        else 0
    )

    punctuation_counts = {
        "commas": text.count(","),
        "semicolons": text.count(";"),
        "exclamations": text.count("!"),
        "questions": text.count("?"),
        "dashes": text.count("-"),
    }

    word_frequency = Counter(tokens)

    return {
        "word_count": word_count,
        "character_count": character_count,
        "sentence_count": sentence_count,
        "average_word_length": round(average_word_length, 3),
        "average_sentence_length": round(average_sentence_length, 3),
        "punctuation": punctuation_counts,
        "top_words": [
            word
            for word, count in word_frequency.most_common(20)
            if count >= 1
        ],
    }


def compare_stylometry(text_a: str, text_b: str) -> dict[str, Any]:
    features_a = stylometry_features(text_a)
    features_b = stylometry_features(text_b)

    common_words = sorted(
        set(features_a["top_words"]).intersection(features_b["top_words"])
    )

    word_score = min(
        len(common_words) * 10,
        100,
    )

    sentence_difference = abs(
        features_a["average_sentence_length"]
        - features_b["average_sentence_length"]
    )

    sentence_score = max(
        0,
        100 - sentence_difference * 10,
    )

    punctuation_a = features_a["punctuation"]
    punctuation_b = features_b["punctuation"]

    punctuation_difference = sum(
        abs(punctuation_a[key] - punctuation_b[key])
        for key in punctuation_a
    )

    punctuation_score = max(
        0,
        100 - punctuation_difference * 8,
    )

    writing_style_score = round(
        word_score * 0.35
        + sentence_score * 0.35
        + punctuation_score * 0.30,
        2,
    )

    return {
        "writing_style_score": writing_style_score,
        "common_words": common_words,
        "features_a": features_a,
        "features_b": features_b,
    } 