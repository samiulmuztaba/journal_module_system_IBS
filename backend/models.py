from database import Base
from sqlalchemy import Column, DateTime, Integer, String, DateTime, JSON
import uuid

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime)
    role = Column(String, default='user')

class JournalEntry(Base):
    __tablename__ = 'journal_entries'

    id = Column(Integer, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    author_name = Column(String)
    author_id = Column(Integer)
    journal_data = Column(JSON, nullable=False)
    date = Column(DateTime)
    acceptance_status = Column(String, default='pending')