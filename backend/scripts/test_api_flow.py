import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api/v1"
EMAIL = f"test_{uuid.uuid4().hex[:4]}@example.com"
PASSWORD = "password123"

def test_flow():
    print("🚀 Starting API Integration Test...\n")

    # 1. Health Check
    print("1. Checking Health...")
    r = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {r.status_code}, Response: {r.json()}")

    # 2. Register
    print("\n2. Registering User...")
    user_data = {"email": EMAIL, "password": PASSWORD, "full_name": "Test User"}
    r = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    print(f"   Status: {r.status_code}")

    # 3. Login
    print("\n3. Logging In...")
    login_data = {"username": EMAIL, "password": PASSWORD}
    r = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    token = r.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print(f"   Token acquired: {token[:10]}...")

    # 4. Get Demo Personas
    print("\n4. Fetching Demo Personas...")
    r = requests.get(f"{BASE_URL}/demo-personas", headers=headers)
    print(f"   Count: {len(r.json())}")

    # 5. Run Simulation
    print("\n5. Running Simulation (Mock)...")
    sim_request = {
        "student_profile": {
            "name": "Aarav",
            "age": 16,
            "education_stage": "high_school",
            "location": "India",
            "interests": ["coding"],
            "favorite_subjects": ["CS"],
            "current_skills": ["Python"],
            "work_style_preferences": ["building"],
            "career_fears": ["AI"],
            "dream_careers": ["Engineer"],
            "disliked_careers": ["Research"],
            "weekly_time_available": "10h"
        },
        "options": {"include_trace": True, "include_demo_fallback": True, "preferred_number_of_paths": 3}
    }
    r = requests.post(f"{BASE_URL}/simulate/", json=sim_request, headers=headers)
    print(f"   Status: {r.status_code}")
    sim_data = r.json()
    print(f"   Simulation ID: {sim_data['simulation']['simulation_id']}")

    # 6. Fetch History
    print("\n6. Fetching Simulation History...")
    r = requests.get(f"{BASE_URL}/simulations/", headers=headers)
    print(f"   Simulations in DB: {len(r.json())}")

    print("\n✅ API Flow Test Completed Successfully!")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")
