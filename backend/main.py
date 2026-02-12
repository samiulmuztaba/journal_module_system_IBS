from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
from sqlalchemy.orm import Session
from database import get_db, engine
import schemas
import models
from typing import List, Optional

models.Base.metadata.create_all(bind=engine) # Create tables :)

# ====== Setup and middleware stuff ========
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
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
@app.get('/api/users', response_model=List[schemas.User])
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
    
    if user.role not in ['admin', 'reviewer', 'writer', 'viewer']:
        raise HTTPException(status_code=400, detail="Invalid role specified")
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

@app.put('/api/users/{user_id}', response_model=schemas.User)
def update_role(user_id: str, new_role: str, db: Session = Depends(get_db)):
    """Update user role, only admin can do this"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if new_role not in ['admin', 'reviewer', 'writer', 'viewer']:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    
    user.role = new_role
    db.commit()
    db.refresh(user)
    return user

@app.delete('/api/users/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, db: Session = Depends(get_db)):
    """Delete a user by ID"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()

# ====== Journals & Review Endpoints ======
@app.get('/api/journals', response_model=List[schemas.Journal])
def get_journals(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all the journals :)"""
    journals = db.query(models.Journal)
    if status:
        journals = journals.filter(models.Journal.status == status)
    journals = journals.all()
    return journals

@app.get('/api/journals/{journal_id}', response_model=schemas.Journal)
def get_journal(journal_id: str, db: Session = Depends(get_db)):
    """Get a specific journal by its id"""
    journal = db.query(models.Journal).filter(models.Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    return journal

@app.post('/api/journals', response_model=schemas.Journal, status_code=status.HTTP_201_CREATED)
def create_journal(journal: schemas.JournalCreate, author_id: str, db: Session = Depends(get_db)):
    """Create a new journal entry AND only writers and admin can do this"""
    author = db.query(models.User).filter(models.User.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    if author.role not in ['writer', 'admin']:
        raise HTTPException(status_code=403, detail="Only writers and admins can create journals")
    
    # Create journal
    db_journal = models.Journal(
        title=journal.title,
        abstract=journal.abstract,
        content=journal.content,
        tags=journal.tags,
        author_id=author_id,
        author_name=author.name
    )
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@app.delete('/api/journals/{journal_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_journal(journal_id: str, user_id: str, db: Session = Depends(get_db)):
    """Delete a journal entry, only the author or admin can do this"""
    journal = db.query(models.Journal).filter(models.Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role != 'admin' and journal.author_id != user_id:
        raise HTTPException(status_code=403, detail="Only the author or admins can delete this journal")
    
    db.delete(journal)
    db.commit()

@app.post('/api/journals/{journal_id}/review')
def review_journal(
    journal_id: str,
    review: schemas.ReviewSubmit,
    reviewer_id: str,
    db: Session = Depends(get_db)
):
    reviewer = db.query(models.User).filter(models.User.id == reviewer_id).first()
    if not reviewer:
        raise HTTPException(status_code=404, detail="Reviewer not found")

    if reviewer.role not in ['reviewer', 'admin']:
        raise HTTPException(status_code=403, detail="reviewer and admins can review, not someone like you lol ✍(◔◡◔)")
    
    journal = db.query(models.Journal).filter(models.Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    # Update journal
    journal.status = "approved" if review.approved else "rejected"
    journal.review_comment = review.review_comment
    journal.reviewer_id = reviewer_id
    journal.reviewer_name = reviewer.name
    journal.reviewed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(journal)
    return journal