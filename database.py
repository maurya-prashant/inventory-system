from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "postgresql://flask_user:prashant2511@localhost:5432/flask"
engine = create_engine(db_url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)