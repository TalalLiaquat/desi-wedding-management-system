from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PlannerCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True


class PlannerCategoryCreate(PlannerCategoryBase):
    pass


class PlannerCategoryOut(PlannerCategoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BudgetItemBase(BaseModel):
    name: str
    category: str
    amount: float = Field(ge=0)
    notes: Optional[str] = None


class BudgetItemCreate(BudgetItemBase):
    pass


class BudgetItemOut(BudgetItemBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BudgetItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = Field(default=None, ge=0)
    notes: Optional[str] = None


class ChecklistItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    due_date: Optional[datetime] = None


class ChecklistItemCreate(ChecklistItemBase):
    pass


class ChecklistItemOut(ChecklistItemBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChecklistItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime] = None


class GuestBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    rsvp_status: str = "pending"
    notes: Optional[str] = None


class GuestCreate(GuestBase):
    pass


class GuestOut(GuestBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GuestUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    rsvp_status: Optional[str] = None
    notes: Optional[str] = None


class ReviewBase(BaseModel):
    vendor_id: int
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    pass


class ReviewOut(ReviewBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationBase(BaseModel):
    title: str
    message: str


class NotificationCreate(NotificationBase):
    pass


class NotificationOut(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaymentBase(BaseModel):
    amount: float = Field(ge=0)
    cardholder_name: str
    card_last4: str


class PaymentCreate(PaymentBase):
    booking_id: Optional[int] = None


class PaymentOut(PaymentBase):
    id: int
    user_id: int
    booking_id: Optional[int]
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
