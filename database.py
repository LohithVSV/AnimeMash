from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL=os.environ.get("DATABASE_URL")
DATABASE_URL=DATABASE_URL.replace("postgresql://","postgresql+psycopg2://")

engine=create_engine(DATABASE_URL)
Base=declarative_base()
SessionLocal=sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()