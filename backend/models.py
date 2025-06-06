from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, DateTime, Enum, Text, ARRAY
from datetime import datetime , timezone
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

# Event status enum
class EventStatus(enum.Enum):
    approved = "approved"
    pending = "pending"
    rejected = "rejected"

# Association tables
user_events = Table(
    "user_events",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("event_id", Integer, ForeignKey("events.id"))
)

registered_events = Table(
    "registered_events",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("event_id", Integer, ForeignKey("events.id"))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True ,nullable=False , unique=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=False)
    password = Column(String, nullable=False)

    is_admin = Column(Boolean, default=False)
    is_banned = Column(Boolean, default=False)
    status = Column(Boolean, default=False)
    
    events = relationship("Event", secondary=user_events, back_populates="creators")
    registered = relationship("Event", secondary=registered_events, back_populates="attendees")

    def __str__(self):
        username = self.username
        email = self.email
        return f"{username} ({email})"

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String)
    
    start_datetime = Column(DateTime)
    end_datetime = Column(DateTime)
    registration_start_datetime = Column(DateTime)
    registration_end_datetime = Column(DateTime)
    
    photos = Column(ARRAY(String)) 
    category = Column(String)
    status = Column(Enum(EventStatus), default=EventStatus.pending)
    flag = Column(Boolean, default=False)
    
    creators = relationship("User", secondary=user_events, back_populates="events")
    attendees = relationship("User", secondary=registered_events, back_populates="registered")

    def __str__(self):
        return f"{self.name}"

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.now(tz=timezone.utc))
    details = Column(Text)

    user = relationship("User")