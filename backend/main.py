from fastapi import FastAPI, Depends , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, get_current_user, get_current_admin
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from admin import setup_admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

setup_admin(app)

origins = [
    "http://localhost:3000",
    "http://localhost:3000/",
    "https://your-frontend-domain.com",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost",
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/events/", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db, event)

@app.get("/users/", response_model=list[schemas.User])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@app.get("/events/", response_model=list[schemas.Event])
def read_events(db: Session = Depends(get_db)):
    return crud.get_approved_events(db)

@app.get("/events/all/", response_model=list[schemas.Event])
def read_all_events(db: Session = Depends(get_db)):
    return crud.get_events(db)

@app.post("/signup/", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_data = user.model_dump()
    user_data["password"] = hash_password(user_data["password"])
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login/", response_model=schemas.Token)
def login(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": str(user.id)}, expires_delta=timedelta(minutes=30))
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/admin-only/")
def admin_area(current_admin: models.User = Depends(get_current_admin)):
    return {"message": f"Welcome admin {current_admin.name}!"}

@app.get("/users/{user_id}/events/", response_model=list[schemas.Event])
def read_user_events(user_id: int, db: Session = Depends(get_db)):
    return crud.get_events_by_user(db, user_id)

@app.get("/events/{event_id}/", response_model=schemas.Event)
def read_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.status == "approved").filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.delete("/events/{event_id}/")
def delete_event(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_event(db, event_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"ok": True}

@app.get("/events/{event_id}/registered/")
def get_registered_users(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event.attendees


@app.post("/admin/ban/{user_id}/")
def ban_user(user_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_banned = True
    db.commit()
    return {"message": "User banned"}

@app.post("/admin/events/{event_id}/approve/")
def approve_event(event_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.status = "approved"
    db.commit()
    return {"message": "Event approved"}

@app.post("/admin/events/{event_id}/reject/")
def reject_event(event_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.status = "rejected"
    db.commit()
    return {"message": "Event rejected"}

@app.post("/events/{event_id}/register/")
def register_for_event(event_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.attendees.append(current_user)
    db.commit()
    return {"message": "Registered"}

@app.post("/events/{event_id}/unregister/")
def unregister_for_event(event_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.attendees.remove(current_user)
    db.commit()
    return {"message": "Unregistered"}

@app.post("/admin/events/{event_id}/flag/")
def flag_event(event_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.flag = True
    db.commit()
    return {"message": "Event flagged"}

@app.post("/admin/events/{event_id}/unflag/")
def unflag_event(event_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.flag = False
    db.commit()
    return {"message": "Event unflagged"}