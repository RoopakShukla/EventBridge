from sqlalchemy.orm import Session
import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_users(db: Session):
    return db.query(models.User).all()

def get_events(db: Session):
    return db.query(models.Event).all()

def get_approved_events(db: Session):
    return db.query(models.Event).filter(models.Event.status == "approved").filter(models.Event.flag == False).all()

def get_events_by_user(db: Session, user_id: int):
    return db.query(models.Event).join(models.Event.creators).filter(models.User.id == user_id).all()

def update_event(db: Session, event_id: int, event_data: schemas.EventCreate, user_id: int):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        return None
    # Check if user is a creator
    if user_id not in [u.id for u in event.creators]:
        return None
    for key, value in event_data.model_dump().items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

def delete_event(db: Session, event_id: int, user_id: int):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        return False
    if user_id not in [u.id for u in event.creators]:
        return False
    db.delete(event)
    db.commit()
    return True


def log_action(db: Session, user_id: int, action: str, details: str = ""):
    from models import AuditLog
    log = AuditLog(user_id=user_id, action=action, details=details)
    db.add(log)
    db.commit()
    