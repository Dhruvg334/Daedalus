import hashlib
import json
from typing import Any, Dict, List, Optional

class ResponseCache:
    _cache: Dict[str, Any] = {}

    @classmethod
    def generate_key(cls, profile: Dict[str, Any], career_ids: List[str]) -> str:
        """Generates a stable SHA-256 cache key based on key profile signals and career recommendations."""
        signals = {
            "interests": sorted(profile.get("interests", [])),
            "skills": sorted(profile.get("current_skills", [])),
            "subjects": sorted(profile.get("favorite_subjects", [])),
            "career_ids": career_ids
        }
        serialized = json.dumps(signals, sort_keys=True)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    @classmethod
    def get(cls, profile: Dict[str, Any], career_ids: List[str]) -> Optional[Any]:
        """Retrieves cached enhancement response if present."""
        key = cls.generate_key(profile, career_ids)
        return cls._cache.get(key)

    @classmethod
    def set(cls, profile: Dict[str, Any], career_ids: List[str], data: Any) -> None:
        """Stores enhancement response in cache."""
        key = cls.generate_key(profile, career_ids)
        cls._cache[key] = data

    @classmethod
    def clear(cls) -> None:
        """Clears all cached entries (useful for testing)."""
        cls._cache.clear()
