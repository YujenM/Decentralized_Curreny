from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session

# Database configuration
DB_HOST = "localhost"
DB_USER = "Yujen"
DB_PASS = "iambatman123@"
DB_NAME = "FypCryptoDb"

# Using PyMySQL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# FastAPI app
app = FastAPI()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    try:
        query = text("SELECT * FROM Users")
        result = db.execute(query).fetchall()
        users = [dict(row) for row in result]  
        return {"status": "success", "users": users}
    except Exception as e:
        return {"status": "error", "details": str(e)}
