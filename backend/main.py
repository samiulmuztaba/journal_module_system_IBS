from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
from sqlalchemy.orm import Session
from database import get_db, create_engine
import schemas
import models
from typing import List

models.Base.metadata.create_all(bind=create_engine) # Create tables :)

# ====== Setup and middleware stuff ========
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======== Helper function to hash passwords =========
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


@app.get("/")
def read_root():
    """root endpoint"""
    return {"message": "IBS Journal API"}

# ========================= User Endpoints =========================
@app.get('/api/users', response_model=List[models.User])
def get_users(db: Session = Depends(get_db)):
    "Get the users list"
    users = db.query(models.User).all()
    return users

@app.get("/api/users/{user_id}", response_model=schemas.User)
def get_user(user_id: str, db: Session = Depends(get_db)):
    "Or get the user by it's id, -_-"
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post('/api/users', response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user only if that user didn't exist (email check (☞ﾟヮﾟ)☞)"""
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post('/api/users/login')
def login(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    """Logs user in with the RIGHT credentials, kinda obvious ¯\_(ツ)_/¯"""
    user = db.query(models.User).filter(models.User.email == user_login.email).first()
    if not user or not verify_password(user_login.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }