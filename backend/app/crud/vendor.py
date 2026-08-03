from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate


class CRUDVendor:
    def get(self, db: Session, id: int):
        return db.query(Vendor).filter(Vendor.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Vendor).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: VendorCreate):
        db_obj = Vendor(
            name=obj_in.name,
            category=obj_in.category,
            city=obj_in.city,
            price=obj_in.price,
            rating=obj_in.rating,
            description=obj_in.description,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Vendor, obj_in: VendorUpdate):
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, db_obj: Vendor):
        db.delete(db_obj)
        db.commit()
        return db_obj


vendor = CRUDVendor()
