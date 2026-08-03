from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship

from app.db.base import Base

class UserRole(str, PyEnum):
    customer = "customer"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.customer, nullable=False)

    bookings = relationship("Booking", back_populates="owner")
    budget_items = relationship("BudgetItem", back_populates="owner")
    checklist_items = relationship("ChecklistItem", back_populates="owner")
    guests = relationship("Guest", back_populates="owner")
    reviews = relationship("Review", back_populates="owner")
    notifications = relationship("Notification", back_populates="owner")
    payments = relationship("Payment", back_populates="owner")
