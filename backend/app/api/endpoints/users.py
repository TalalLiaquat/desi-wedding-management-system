from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter()


@router.get("/me", response_model=schemas.UserOut)
def read_user_me(current_user=Depends(deps.get_current_active_user)):
    return current_user


@router.put("/me", response_model=schemas.UserOut)
def update_user_me(user_in: schemas.UserUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.user.update(db, db_obj=current_user, obj_in=user_in)

@router.get("/", response_model=list[schemas.UserOut])
def read_users(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_admin)):
    return crud.user.get_multi(db)

@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user_in: schemas.UserUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_admin)):
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return crud.user.update(db, db_obj=user, obj_in=user_in)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_admin)):
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    crud.user.delete(db, db_obj=user)
    return None
