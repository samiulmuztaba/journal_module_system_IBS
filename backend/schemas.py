from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Journal Schemas
class JournalBase(BaseModel):
    title: str
    abstract: str
    content: str
    tags: List[str] = []

class JournalCreate(JournalBase):
    pass

class Journal(JournalBase):
    id: str
    author_id: str
    author_name: str
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewer_id: Optional[str] = None
    reviewer_name: Optional[str] = None
    review_comment: Optional[str] = None

    class Config:
        from_attributes = True

# Review Schema
class ReviewSubmit(BaseModel):
    review_comment: str
    approved: bool