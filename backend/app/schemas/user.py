from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional


class UserBase(BaseModel):
    full_name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None


class UserOut(UserBase):
    id: int
    role: str

    model_config = ConfigDict(from_attributes=True)
