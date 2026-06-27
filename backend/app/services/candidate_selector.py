from typing import Any, Dict, List

def select_candidates(career_library: List[Dict[str, Any]], classification: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Selects careers belonging to primary or secondary clusters, guaranteeing a minimum pool size."""
    primary = classification.get("primary_cluster")
    secondaries = set(classification.get("secondary_clusters", []))
    
    candidates = []
    for career in career_library:
        cluster = career.get("cluster")
        if cluster == primary or cluster in secondaries:
            candidates.append(career)
            
    # Guarantee at least 15 candidates for ranking and exploratory path generation
    if len(candidates) < 15:
        existing_ids = {c["career_id"] for c in candidates}
        for career in career_library:
            if career["career_id"] not in existing_ids:
                candidates.append(career)
                
    return candidates
