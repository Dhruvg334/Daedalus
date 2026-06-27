import re
from typing import Any, Dict, List, Set

# Re-use ALIASES mapping to expand user profile signals
ALIASES: Dict[str, Set[str]] = {
    "ai": {"ai", "artificial", "intelligence", "genai", "generative", "llm", "machine", "learning", "ml"},
    "coding": {"coding", "code", "programming", "python", "javascript", "js", "software", "web", "app", "developer"},
    "design": {"design", "figma", "ux", "ui", "visual", "prototype", "art", "creative"},
    "business": {"business", "startup", "entrepreneurship", "entrepreneur", "founder", "venture", "sales", "marketing", "strategy", "growth", "operator", "leadership"},
    "finance": {"finance", "investment", "investing", "markets", "market", "stocks", "stock", "trading", "banking", "fintech", "economics", "valuation", "wealth", "portfolio"},
    "data": {"data", "analytics", "statistics", "excel", "sql", "dashboard", "research"},
    "healthcare": {"health", "healthcare", "medicine", "biology", "bio", "medical", "chemistry"},
    "education": {"education", "teaching", "learning", "mentor", "course", "tutor"},
    "security": {"security", "cybersecurity", "hacking", "privacy", "network"},
    "climate": {"climate", "sustainability", "environment", "energy", "green"},
    "creator": {"creator", "content", "youtube", "music", "film", "social", "storytelling", "writing", "instagram", "reels", "editing"},
    "music": {"music", "singing", "singer", "guitar", "guitarist", "piano", "vocals", "vocal", "song", "songs", "songwriting", "dj", "djs", "producer", "artist", "band", "stage", "performance"},
    "sports": {"sports", "fitness", "athlete", "training", "gym", "coach", "coaching", "nutrition"},
    "robotics": {"robotics", "hardware", "electronics", "iot", "arduino", "sensor", "physics"},
    "policy": {"policy", "law", "ethics", "governance", "government", "debate", "society"},
}

def _tokens_from(values: List[str]) -> Set[str]:
    tokens: Set[str] = set()
    for value in values:
        if value is None:
            continue
        text = str(value).lower()
        for token in re.findall(r"[a-z0-9+#.]+", text):
            if len(token) > 1:
                tokens.add(token)
        compact = text.strip().replace(" ", "_")
        if compact and len(compact) > 1:
            tokens.add(compact)
    return tokens

def _expand_tokens(tokens: Set[str]) -> Set[str]:
    expanded = set(tokens)
    for canonical, aliases in ALIASES.items():
        if tokens & aliases or canonical in tokens:
            expanded.add(canonical)
    return expanded

def _profile_tokens(profile: Dict[str, Any]) -> Set[str]:
    values: List[str] = []
    for key in [
        "interests",
        "favorite_subjects",
        "current_skills",
        "work_style_preferences",
        "career_fears",
        "dream_careers",
        "disliked_careers",
    ]:
        raw = profile.get(key, [])
        if isinstance(raw, list):
            values.extend(raw)
    if profile.get("optional_profile_text"):
        values.append(profile["optional_profile_text"])
    return _expand_tokens(_tokens_from(values))

def classify_profile(profile: Dict[str, Any], career_library: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Classifies user profile into weighted semantic clusters based on career library options."""
    profile_tokens = _profile_tokens(profile)
    
    # Aggregate cluster tokens from careers in the library
    cluster_keywords: Dict[str, Set[str]] = {}
    for career in career_library:
        cluster = career["cluster"]
        if cluster not in cluster_keywords:
            cluster_keywords[cluster] = set()
        
        # Combine related terms for the cluster
        interest_tokens = _expand_tokens(_tokens_from(career.get("related_interests", [])))
        subject_tokens = _expand_tokens(_tokens_from(career.get("related_subjects", [])))
        skill_tokens = _expand_tokens(_tokens_from(career.get("required_skills", [])))
        style_tokens = _expand_tokens(_tokens_from(career.get("work_styles", [])))
        title_tokens = _expand_tokens(_tokens_from([career.get("title", ""), cluster]))
        
        cluster_keywords[cluster].update(interest_tokens | subject_tokens | skill_tokens | style_tokens | title_tokens)

    # Compute overlap score for each cluster
    scores: Dict[str, float] = {}
    for cluster, keywords in cluster_keywords.items():
        overlap = profile_tokens & keywords
        if not overlap:
            scores[cluster] = 0.0
            continue
        # Weight by overlap count
        score = len(overlap) / max(2, len(profile_tokens))
        scores[cluster] = round(score, 4)

    # Normalize weights so they sum to 1.0 (if there are non-zero scores)
    total_score = sum(scores.values())
    weights: Dict[str, float] = {}
    if total_score > 0:
        for cluster, score in scores.items():
            if score > 0:
                weights[cluster] = round(score / total_score, 4)
    else:
        # Default fallback weight if no overlaps found
        default_cluster = "Software & AI" if "Software & AI" in cluster_keywords else list(cluster_keywords.keys())[0]
        weights[default_cluster] = 1.0

    # Sort clusters by weight descending
    sorted_clusters = sorted(weights.items(), key=lambda x: x[1], reverse=True)
    
    primary_cluster = sorted_clusters[0][0]
    secondary_clusters = [cluster for cluster, w in sorted_clusters[1:] if w > 0]
    
    # If no secondary clusters have positive weight, pick the next highest score or next in library
    if not secondary_clusters:
        all_clusters = list(cluster_keywords.keys())
        secondary_candidates = [c for c in all_clusters if c != primary_cluster]
        secondary_clusters = secondary_candidates[:2]

    return {
        "primary_cluster": primary_cluster,
        "secondary_clusters": secondary_clusters,
        "weights": weights
    }
