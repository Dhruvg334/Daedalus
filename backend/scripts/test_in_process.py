import sys
import os
import uuid

# Add backend directory to Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

db_path = os.path.join(backend_dir, "daedalus.db")
if os.path.exists(db_path):
    try:
        os.remove(db_path)
    except Exception:
        pass

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine

def test_api_pipeline():
    print("=== Starting In-Process API Pipeline Integration Tests...\n")
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as client:
        # 1. Health Check
        print("1. Checking Health...")
        r = client.get("/api/v1/health")
        assert r.status_code == 200, f"Health check failed: {r.text}"
        print(f"   Status: {r.status_code}, Response: {r.json()}")

        # 2. Register
        email = f"test_{uuid.uuid4().hex[:6]}@example.com"
        password = "password123"
        print(f"\n2. Registering User ({email})...")
        user_data = {"email": email, "password": password, "full_name": "Pipeline Tester"}
        r = client.post("/api/v1/auth/register", json=user_data)
        assert r.status_code == 200, f"Register failed: {r.text}"
        print(f"   Status: {r.status_code}, User: {r.json().get('email')}")

        # 3. Login
        print("\n3. Logging In...")
        login_data = {"username": email, "password": password}
        r = client.post("/api/v1/auth/login", data=login_data)
        assert r.status_code == 200, f"Login failed: {r.text}"
        token = r.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print(f"   Token acquired: {token[:15]}...")

        # 4. Get Demo Personas
        print("\n4. Fetching Demo Personas...")
        r = client.get("/api/v1/demo-personas", headers=headers)
        assert r.status_code == 200, f"Demo personas failed: {r.text}"
        personas = r.json().get("personas", [])
        print(f"   Count: {len(personas)}")
        assert len(personas) > 0, "No personas found"

        # 5. Run Simulation
        print("\n5. Running Simulation (Deterministic / Mock)...")
        sim_request = {
            "student_profile": {
                "name": "Aarav",
                "age": 16,
                "education_stage": "high_school",
                "location": "India",
                "interests": ["coding", "artificial intelligence", "ml"],
                "favorite_subjects": ["Computer Science", "Mathematics"],
                "current_skills": ["basic Python"],
                "work_style_preferences": ["building", "independent"],
                "career_fears": ["AI replacing coders"],
                "dream_careers": ["software engineer", "AI scientist"],
                "disliked_careers": ["pure theory research"],
                "weekly_time_available": "5-7 hours",
                "optional_profile_text": "I want to build real AI apps."
            },
            "options": {
                "include_trace": True,
                "include_demo_fallback": True,
                "preferred_number_of_paths": 3
            }
        }
        r = client.post("/api/v1/simulate/", json=sim_request, headers=headers)
        assert r.status_code == 200, f"Simulation failed: {r.text}"
        
        res_data = r.json()
        assert res_data["success"] is True
        simulation = res_data["simulation"]
        print(f"   Simulation ID generated: {simulation['simulation_id']}")
        
        # Verify EXACTLY 3 paths are returned
        career_paths = simulation["career_paths"]
        print(f"   Number of career paths returned: {len(career_paths)}")
        assert len(career_paths) == 3, f"Expected exactly 3 paths, got {len(career_paths)}"
        
        # Verify uniqueness of career recommendations
        career_ids = [path["career_id"] for path in career_paths]
        print(f"   Career IDs: {career_ids}")
        assert len(set(career_ids)) == 3, f"Expected 3 unique career recommendations, found duplicates: {career_ids}"

        # Verify semantic classification is present in trace
        steps = simulation["trace"]["steps"]
        step_ids = [step["step_id"] for step in steps]
        print(f"   Trace steps executed: {step_ids}")
        assert "semantic_classification" in step_ids, "semantic_classification trace step missing"
        assert "candidate_filtering" in step_ids, "candidate_filtering trace step missing"
        
        # Print out classification result
        classification_step = next(step for step in steps if step["step_id"] == "semantic_classification")
        print(f"   Classification details: {classification_step['detail']}")
        assert "primary_cluster" in classification_step["detail"], "primary_cluster missing from classification details"
        
        # Verify fallback templates were utilized correctly
        for path in career_paths:
            assert len(path["learning_roadmap"]) == 3, f"Learning roadmap should contain 3 steps, got {len(path['learning_roadmap'])}"
            assert "{first_gap}" not in path["learning_roadmap"][0]["title"], "Templates placeholders not formatted properly"
            assert "{name}" not in path["future_self"]["narrative"], "Template placeholders in future_self not formatted"
        
        # 6. Fetch Simulation History
        print("\n6. Fetching Simulation History...")
        r = client.get("/api/v1/simulations/", headers=headers)
        assert r.status_code == 200, f"Fetch simulations history failed: {r.text}"
        simulations_db = r.json()
        print(f"   Simulations in DB: {len(simulations_db)}")
        assert len(simulations_db) >= 1, "Expected at least 1 simulation in DB history"

        print("\nSUCCESS: API Flow & Integration Pipeline Test Passed Successfully!")

if __name__ == "__main__":
    try:
        test_api_pipeline()
    except Exception as e:
        import traceback
        traceback.print_exc()
        sys.exit(1)
