from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr



class EventBase(BaseModel):
    name: str
    description: Optional[str]
    location: Optional[str]
    start_datetime: datetime
    end_datetime: datetime
    registration_start_datetime: datetime
    registration_end_datetime: datetime
    photos: Optional[List[str]]
    category: Optional[str]
    status: Optional[str] = "pending"
    flag: Optional[bool] = False

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    class Config:
        from_attribute = True

class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone_number: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    is_admin: bool
    is_banned: bool
    status: bool
    events: List[Event] = []
    registered: List[Event] = []
    class Config:
        from_attribute = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    
class UserCreate(UserBase):
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str