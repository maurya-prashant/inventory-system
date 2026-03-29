from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "postgresql://your_user:your_password@localhost:5432/your_db"
engine = create_engine(db_url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
