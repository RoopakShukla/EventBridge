from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class EventBase(BaseModel):
    name: str
    description: Optional[str]
    location: Optional[str]
    start_datetime: datetime
    end_datetime: datetime
    registration_start_datetime: datetime
    registration_end_datetime: datetime
    photos: Optional[str]
    category: Optional[str]
    status: Optional[str] = "Pending"
    flag: Optional[bool] = False

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    is_admin: bool
    is_banned: bool
    status: str
    events: List[Event] = []
    registered: List[Event] = []
    class Config:
        orm_mode = True
