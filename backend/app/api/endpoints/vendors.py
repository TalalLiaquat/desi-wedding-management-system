from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps
from app.models.vendor import Vendor

router = APIRouter()


@router.get("/", response_model=list[schemas.VendorOut])
def list_vendors(skip: int = 0, limit: int = 25, search: str | None = None, category: str | None = None, city: str | None = None, db: Session = Depends(deps.get_db)):
    query = db.query(Vendor)
    if search:
        query = query.filter(Vendor.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Vendor.category.ilike(f"%{category}%"))
    if city:
        query = query.filter(Vendor.city.ilike(f"%{city}%"))
    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=schemas.VendorOut)
def create_vendor(vendor_in: schemas.VendorCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_admin)):
    return crud.vendor.create(db, obj_in=vendor_in)


@router.get("/{vendor_id}", response_model=schemas.VendorOut)
def get_vendor(vendor_id: int, db: Session = Depends(deps.get_db)):
    vendor = crud.vendor.get(db, id=vendor_id)
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return vendor


@router.put("/{vendor_id}", response_model=schemas.VendorOut)
def update_vendor(vendor_id: int, vendor_in: schemas.VendorUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_admin)):
    vendor = crud.vendor.get(db, id=vendor_id)
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return crud.vendor.update(db, db_obj=vendor, obj_in=vendor_in)


@router.delete("/{vendor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vendor(vendor_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_admin)):
    vendor = crud.vendor.get(db, id=vendor_id)
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    crud.vendor.delete(db, db_obj=vendor)
    return None
