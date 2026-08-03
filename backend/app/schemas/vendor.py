from pydantic import BaseModel, ConfigDict


class VendorBase(BaseModel):
    name: str
    category: str
    city: str | None = None
    price: float | None = None
    rating: float | None = None
    description: str | None = None


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    city: str | None = None
    price: float | None = None
    rating: float | None = None
    description: str | None = None


class VendorOut(VendorBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
