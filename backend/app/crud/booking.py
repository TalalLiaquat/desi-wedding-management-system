from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingUpdate


class CRUDBooking:
    def get(self, db: Session, id: int):
        return db.query(Booking).filter(Booking.id == id).first()

    def get_multi_by_owner(self, db: Session, owner_id: int, skip: int = 0, limit: int = 100):
        return db.query(Booking).filter(Booking.user_id == owner_id).offset(skip).limit(limit).all()

    def create_with_owner(self, db: Session, *, obj_in: BookingCreate, owner_id: int):
        db_obj = Booking(
            user_id=owner_id,
            vendor_id=obj_in.vendor_id,
            event_date=obj_in.event_date,
            notes=obj_in.notes,
            total_amount=obj_in.total_amount,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Booking, obj_in: BookingUpdate):
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, db_obj: Booking):
        db.delete(db_obj)
        db.commit()
        return db_obj


booking = CRUDBooking()
