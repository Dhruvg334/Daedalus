import uuid
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.persona import DemoPersona

def seed():
    print("🌱 Seeding database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(DemoPersona).count() > 0:
        print("✅ Database already contains personas. Skipping seed.")
        db.close()
        return

    personas = [
        {
            "name": "Aarav",
            "description": "High Schooler interested in Tech & Business",
            "profile_json": {
                "age": 16,
                "education_stage": "high_school",
                "location": "India",
                "interests": ["coding", "business", "content creation"],
                "favorite_subjects": ["Computer Science", "Mathematics", "Economics"],
                "current_skills": ["basic Python", "Canva", "public speaking"],
                "work_style_preferences": ["building", "creative", "independent"],
                "career_fears": ["AI replacing coders"],
                "dream_careers": ["software engineer"],
                "disliked_careers": ["pure theory"],
                "weekly_time_available": "5-7 hours"
            }
        },
        {
            "name": "Maya",
            "description": "Creative Arts student exploring Digital Design",
            "profile_json": {
                "age": 17,
                "education_stage": "high_school",
                "location": "USA",
                "interests": ["digital art", "psychology", "ux design"],
                "favorite_subjects": ["Art", "English", "Psychology"],
                "current_skills": ["Sketching", "Photoshop"],
                "work_style_preferences": ["visual", "collaborative"],
                "career_fears": ["unstable income"],
                "dream_careers": ["UX Designer"],
                "disliked_careers": ["finance"],
                "weekly_time_available": "10 hours"
            }
        },
        {
            "name": "Riya",
            "description": "Medical Aspirant with interest in Bio-Tech",
            "profile_json": {
                "age": 18,
                "education_stage": "college_freshman",
                "location": "UK",
                "interests": ["biology", "data science"],
                "favorite_subjects": ["Biology", "Chemistry", "Statistics"],
                "current_skills": ["R basics", "Lab techniques"],
                "work_style_preferences": ["analytical", "structured"],
                "career_fears": ["burnout"],
                "dream_careers": ["Bioinformatics Scientist"],
                "disliked_careers": ["sales"],
                "weekly_time_available": "15 hours"
            }
        },
        {
            "name": "Kabir",
            "description": "Finance student interested in FinTech",
            "profile_json": {
                "age": 19,
                "education_stage": "college_sophomore",
                "location": "Canada",
                "interests": ["finance", "blockchain"],
                "favorite_subjects": ["Economics", "Accounting", "CS"],
                "current_skills": ["Excel", "Trading basics"],
                "work_style_preferences": ["fast-paced", "competitive"],
                "career_fears": ["AI automation in finance"],
                "dream_careers": ["Algorithmic Trader"],
                "disliked_careers": ["education"],
                "weekly_time_available": "8 hours"
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
    db.close()
    print("✨ Seeding complete!")

if __name__ == "__main__":
    seed()
