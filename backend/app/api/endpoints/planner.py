import io
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps
from app.models.planner import BudgetItem, ChecklistItem, Guest, Notification, Payment
from app.models.booking import Booking
from app.models.vendor import Vendor
from app.models.user import UserRole

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
except ImportError:  # pragma: no cover - optional dependency for environments without reportlab
    letter = None
    canvas = None

router = APIRouter()


@router.get("/categories", response_model=list[schemas.PlannerCategoryOut])
def list_categories(db: Session = Depends(deps.get_db)):
    return crud.planner.get_categories(db)


@router.post("/categories", response_model=schemas.PlannerCategoryOut)
def create_category(category_in: schemas.PlannerCategoryCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_admin)):
    return crud.planner.create_category(db, obj_in=category_in)


@router.post("/budget", response_model=schemas.BudgetItemOut)
def create_budget_item(item_in: schemas.BudgetItemCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.create_budget_item(db, owner_id=current_user.id, obj_in=item_in)


@router.get("/budget", response_model=list[schemas.BudgetItemOut])
def list_budget_items(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.get_budget_items(db, owner_id=current_user.id)


@router.put("/budget/{item_id}", response_model=schemas.BudgetItemOut)
def update_budget_item(item_id: int, item_in: schemas.BudgetItemUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    item = db.query(BudgetItem).filter(BudgetItem.id == item_id, BudgetItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget item not found")
    return crud.planner.update_budget_item(db, db_obj=item, obj_in=item_in)


@router.delete("/budget/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget_item(item_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    item = db.query(BudgetItem).filter(BudgetItem.id == item_id, BudgetItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget item not found")
    crud.planner.delete_budget_item(db, db_obj=item)
    return None


@router.post("/checklist", response_model=schemas.ChecklistItemOut)
def create_checklist_item(item_in: schemas.ChecklistItemCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.create_checklist_item(db, owner_id=current_user.id, obj_in=item_in)


@router.get("/checklist", response_model=list[schemas.ChecklistItemOut])
def list_checklist_items(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.get_checklist_items(db, owner_id=current_user.id)


@router.put("/checklist/{item_id}", response_model=schemas.ChecklistItemOut)
def update_checklist_item(item_id: int, item_in: schemas.ChecklistItemUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    item = db.query(ChecklistItem).filter(ChecklistItem.id == item_id, ChecklistItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")
    return crud.planner.update_checklist_item(db, db_obj=item, obj_in=item_in)


@router.post("/guests", response_model=schemas.GuestOut)
def create_guest(guest_in: schemas.GuestCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.create_guest(db, owner_id=current_user.id, obj_in=guest_in)


@router.get("/guests", response_model=list[schemas.GuestOut])
def list_guests(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.get_guests(db, owner_id=current_user.id)


@router.put("/guests/{guest_id}", response_model=schemas.GuestOut)
def update_guest(guest_id: int, guest_in: schemas.GuestUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    guest = db.query(Guest).filter(Guest.id == guest_id, Guest.user_id == current_user.id).first()
    if not guest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guest not found")
    return crud.planner.update_guest(db, db_obj=guest, obj_in=guest_in)


@router.post("/reviews", response_model=schemas.ReviewOut)
def create_review(review_in: schemas.ReviewCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.create_review(db, owner_id=current_user.id, obj_in=review_in)


@router.get("/reviews", response_model=list[schemas.ReviewOut])
def list_reviews(vendor_id: int | None = None, db: Session = Depends(deps.get_db)):
    return crud.planner.get_reviews(db, vendor_id=vendor_id)


@router.post("/notifications", response_model=schemas.NotificationOut)
def create_notification(notification_in: schemas.NotificationCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.create_notification(db, owner_id=current_user.id, obj_in=notification_in)


@router.get("/notifications", response_model=list[schemas.NotificationOut])
def list_notifications(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.get_notifications(db, owner_id=current_user.id)


@router.put("/notifications/{notification_id}", response_model=schemas.NotificationOut)
def mark_notification_read(notification_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return crud.planner.mark_notification_read(db, db_obj=notification)


@router.post("/payments", response_model=schemas.PaymentOut)
def create_payment(payment_in: schemas.PaymentCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.create_payment(db, owner_id=current_user.id, obj_in=payment_in)


@router.get("/payments", response_model=list[schemas.PaymentOut])
def list_payments(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.planner.get_payments(db, owner_id=current_user.id)


@router.get("/invoice/{booking_id}")
def download_invoice(booking_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if current_user.role != UserRole.admin and booking.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    if canvas is None or letter is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="PDF generation is unavailable")

    vendor = db.query(Vendor).filter(Vendor.id == booking.vendor_id).first()
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle(f"Invoice {booking_id}")
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(50, 760, "Desi Weddings Luxury Invoice")
    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, 730, f"Booking ID: {booking.id}")
    pdf.drawString(50, 710, f"Client: {current_user.full_name}")
    pdf.drawString(50, 690, f"Vendor: {vendor.name if vendor else 'N/A'}")
    pdf.drawString(50, 670, f"Event Date: {booking.event_date.strftime('%Y-%m-%d')}")
    pdf.drawString(50, 650, f"Amount: PKR {booking.total_amount or 0}")
    pdf.drawString(50, 630, f"Status: {booking.status}")
    pdf.drawString(50, 610, "Thank you for choosing Desi Weddings.")
    pdf.save()
    buffer.seek(0)

    return Response(content=buffer.getvalue(), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=invoice-{booking_id}.pdf"})
