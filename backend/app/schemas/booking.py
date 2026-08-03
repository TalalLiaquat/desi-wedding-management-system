from pydantic import BaseModel, ConfigDict
from datetime import datetime


class BookingBase(BaseModel):
    vendor_id: int
    event_date: datetime
    notes: str | None = None
    total_amount: float | None = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    vendor_id: int | None = None
    event_date: datetime | None = None
    notes: str | None = None
    total_amount: float | None = None
    status: str | None = None


class BookingOut(BookingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
