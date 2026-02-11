from sqlalchemy import Column, Integer, String, DateTime, JSON, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default='viewer')  # admin, reviewer, writer, viewer
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    journals = relationship("Journal", back_populates="author", foreign_keys="Journal.author_id")
    reviews = relationship("Journal", back_populates="reviewer", foreign_keys="Journal.reviewer_id")

class Journal(Base):
    __tablename__ = 'journals'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    abstract = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(JSON)  # ["tag1", "tag2"]
    
    author_id = Column(String, ForeignKey('users.id'), nullable=False)
    author_name = Column(String)  
    
    status = Column(String, default='pending')  # pending, approved, rejected
    
    submitted_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    
    reviewer_id = Column(String, ForeignKey('users.id'), nullable=True)
    reviewer_name = Column(String, nullable=True)
    review_comment = Column(Text, nullable=True)

    # Relationships
    author = relationship("User", back_populates="journals", foreign_keys=[author_id])
    reviewer = relationship("User", back_populates="reviews", foreign_keys=[reviewer_id])