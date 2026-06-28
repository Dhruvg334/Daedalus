import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Local development uses a repo-local SQLite DB. Serverless/prod uses /tmp because
# deployment filesystems are usually read-only and ephemeral.
if os.getenv("VERCEL") or os.getenv("ENVIRONMENT") == "production":
    DB_PATH = "/tmp/daedalus.db"
else:
    DB_PATH = os.path.join(BASE_DIR, "daedalus.db")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH.replace('\\\\', '/')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
