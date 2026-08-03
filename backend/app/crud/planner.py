from sqlalchemy.orm import Session

from app.models.planner import BudgetItem, ChecklistItem, Guest, Notification, Payment, PlannerCategory, Review
from app.schemas.planner import (
    BudgetItemCreate,
    BudgetItemUpdate,
    ChecklistItemCreate,
    ChecklistItemUpdate,
    GuestCreate,
    GuestUpdate,
    NotificationCreate,
    NotificationOut,
    PaymentCreate,
    PaymentOut,
    PlannerCategoryCreate,
    PlannerCategoryOut,
    ReviewCreate,
    ReviewOut,
)


class CRUDPlanner:
    def create_category(self, db: Session, *, obj_in: PlannerCategoryCreate):
        db_obj = PlannerCategory(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_categories(self, db: Session, *, skip: int = 0, limit: int = 50):
        return db.query(PlannerCategory).filter(PlannerCategory.is_active.is_(True)).offset(skip).limit(limit).all()

    def create_budget_item(self, db: Session, *, owner_id: int, obj_in: BudgetItemCreate):
        db_obj = BudgetItem(user_id=owner_id, **obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_budget_items(self, db: Session, *, owner_id: int):
        return db.query(BudgetItem).filter(BudgetItem.user_id == owner_id).order_by(BudgetItem.created_at.desc()).all()

    def update_budget_item(self, db: Session, *, db_obj: BudgetItem, obj_in: BudgetItemUpdate):
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_budget_item(self, db: Session, *, db_obj: BudgetItem):
        db.delete(db_obj)
        db.commit()
        return db_obj

    def create_checklist_item(self, db: Session, *, owner_id: int, obj_in: ChecklistItemCreate):
        db_obj = ChecklistItem(user_id=owner_id, **obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_checklist_items(self, db: Session, *, owner_id: int):
        return db.query(ChecklistItem).filter(ChecklistItem.user_id == owner_id).order_by(ChecklistItem.created_at.desc()).all()

    def update_checklist_item(self, db: Session, *, db_obj: ChecklistItem, obj_in: ChecklistItemUpdate):
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_guest(self, db: Session, *, owner_id: int, obj_in: GuestCreate):
        db_obj = Guest(user_id=owner_id, **obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_guests(self, db: Session, *, owner_id: int):
        return db.query(Guest).filter(Guest.user_id == owner_id).order_by(Guest.created_at.desc()).all()

    def update_guest(self, db: Session, *, db_obj: Guest, obj_in: GuestUpdate):
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_review(self, db: Session, *, owner_id: int, obj_in: ReviewCreate):
        db_obj = Review(user_id=owner_id, **obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_reviews(self, db: Session, *, vendor_id: int | None = None):
        query = db.query(Review)
        if vendor_id is not None:
            query = query.filter(Review.vendor_id == vendor_id)
        return query.order_by(Review.created_at.desc()).all()

    def create_notification(self, db: Session, *, owner_id: int, obj_in: NotificationCreate):
        db_obj = Notification(user_id=owner_id, **obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_notifications(self, db: Session, *, owner_id: int):
        return db.query(Notification).filter(Notification.user_id == owner_id).order_by(Notification.created_at.desc()).all()

    def mark_notification_read(self, db: Session, *, db_obj: Notification):
        db_obj.is_read = True
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_payment(self, db: Session, *, owner_id: int, obj_in: PaymentCreate):
        db_obj = Payment(user_id=owner_id, **obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_payments(self, db: Session, *, owner_id: int):
        return db.query(Payment).filter(Payment.user_id == owner_id).order_by(Payment.created_at.desc()).all()


planner = CRUDPlanner()
