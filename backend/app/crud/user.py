from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser:
    def get(self, db: Session, id: int):
        return db.query(User).filter(User.id == id).first()

    def get_by_email(self, db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: UserCreate):
        db_obj = User(
            full_name=obj_in.full_name,
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: User, obj_in: UserUpdate):
        if obj_in.full_name is not None:
            db_obj.full_name = obj_in.full_name
        if obj_in.email is not None:
            db_obj.email = obj_in.email
        if obj_in.role is not None:
            db_obj.role = obj_in.role
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, db_obj: User):
        db.delete(db_obj)
        db.commit()
        return db_obj

    def authenticate(self, db: Session, *, email: str, password: str):
        user = self.get_by_email(db, email=email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

user = CRUDUser()
