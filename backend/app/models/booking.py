from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Enum, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

class BookingStatus(str, PyEnum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    confirmed = "confirmed"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    event_date = Column(DateTime, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.pending, nullable=False)
    notes = Column(Text, nullable=True)
    total_amount = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="bookings")
    vendor = relationship("Vendor", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking")
