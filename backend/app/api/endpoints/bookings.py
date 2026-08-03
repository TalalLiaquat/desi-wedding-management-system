from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps
from app.models.booking import Booking
from app.models.user import UserRole

router = APIRouter()


@router.post("/", response_model=schemas.BookingOut)
def create_booking(booking_in: schemas.BookingCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.booking.create_with_owner(db=db, obj_in=booking_in, owner_id=current_user.id)


@router.get("/", response_model=list[schemas.BookingOut])
def list_bookings(skip: int = 0, limit: int = 25, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    if current_user.role == UserRole.admin:
        return db.query(Booking).offset(skip).limit(limit).all()
    return crud.booking.get_multi_by_owner(db=db, owner_id=current_user.id, skip=skip, limit=limit)


@router.put("/{booking_id}", response_model=schemas.BookingOut)
def update_booking(booking_id: int, booking_in: schemas.BookingUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    booking = crud.booking.get(db, id=booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if current_user.role != UserRole.admin and booking.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return crud.booking.update(db, db_obj=booking, obj_in=booking_in)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    booking = crud.booking.get(db, id=booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if current_user.role != UserRole.admin and booking.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    crud.booking.delete(db, db_obj=booking)
    return None
