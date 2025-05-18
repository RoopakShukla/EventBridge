from fastapi import FastAPI, Depends , HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, get_current_user, get_current_admin
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/events/", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db, event)

@app.get("/users/", response_model=list[schemas.User])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@app.get("/events/", response_model=list[schemas.Event])
def read_events(db: Session = Depends(get_db)):
    return crud.get_events(db)

@app.post("/signup", response_model=schemas.User)
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

@app.post("/login", response_model=schemas.Token)
def login(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": str(user.id)}, expires_delta=timedelta(minutes=30))
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/admin-only")
def admin_area(current_admin: models.User = Depends(get_current_admin)):
    return {"message": f"Welcome admin {current_admin.name}!"}

@app.get("/users/{user_id}/events/", response_model=list[schemas.Event])
def read_user_events(user_id: int, db: Session = Depends(get_db)):
    return crud.get_events_by_user(db, user_id)

@app.delete("/events/{event_id}/")
def delete_event(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_event(db, event_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found or not authorized")
    return {"ok": True}