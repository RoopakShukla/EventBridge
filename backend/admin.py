from sqladmin import Admin, ModelView
import models
from database import engine

class UserAdmin(ModelView, model=models.User):
    column_list = [models.User.id, models.User.username, models.User.email, models.User.phone_number, models.User.is_admin, models.User.is_banned, models.User.status]

class EventAdmin(ModelView, model=models.Event):
    column_list = [models.Event.id, models.Event.name, models.Event.start_datetime, models.Event.end_datetime, models.Event.registration_start_datetime, models.Event.registration_end_datetime, models.Event.category, models.Event.status]


def setup_admin(app):
    admin = Admin(app, engine)

    admin.add_view(UserAdmin)
    admin.add_view(EventAdmin)
