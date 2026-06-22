import uuid
import sys
import os

# Add the backend directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.persona import DemoPersona
from app.models.user import User
from app.models.simulation import Simulation
from app.models.feedback import Feedback

# --- FORCE SQLITE ---
SQLITE_URL = "sqlite:///./daedalus.db"

def seed():
    print(f"🚀 HACKATHON SEEDER: Forcing SQLite at {SQLITE_URL}")

    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    print("🛠️  Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(DemoPersona).count() > 0:
            print("✅ Database already contains personas. Skipping seed.")
            return

        print("🌱 Inserting demo personas...")
        personas = [
            {
                "name": "Aarav",
                "description": "High Schooler interested in Tech & Business",
                "profile_json": {
                    "age": 16, "interests": ["coding", "business"],
                    "education_stage": "high_school", "location": "India",
                    "favorite_subjects": ["CS", "Math"], "current_skills": ["Python"],
                    "work_style_preferences": ["building"], "career_fears": ["AI"],
                    "dream_careers": ["Engineer"], "disliked_careers": ["Research"],
                    "weekly_time_available": "5h"
                }
            },
            {
                "name": "Maya",
                "description": "Creative Arts student exploring Digital Design",
                "profile_json": {
                    "age": 17, "interests": ["art", "design"],
                    "education_stage": "high_school", "location": "USA",
                    "favorite_subjects": ["Art", "Design"], "current_skills": ["Sketching"],
                    "work_style_preferences": ["visual"], "career_fears": ["income"],
                    "dream_careers": ["Designer"], "disliked_careers": ["finance"],
                    "weekly_time_available": "10h"
                }
            }
        ]

        for p in personas:
            db_persona = DemoPersona(
                id=uuid.uuid4(),
                name=p["name"],
                description=p["description"],
                profile_json=p["profile_json"]
            )
            db.add(db_persona)

        db.commit()
        print("✨ Seeding complete!")
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
