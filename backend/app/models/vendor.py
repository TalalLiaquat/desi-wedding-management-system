from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship

from app.db.base import Base

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    city = Column(String, nullable=True)
    price = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    description = Column(Text, nullable=True)

    bookings = relationship("Booking", back_populates="vendor")
    reviews = relationship("Review", back_populates="vendor")
