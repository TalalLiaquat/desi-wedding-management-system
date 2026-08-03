from fastapi import APIRouter

from app.api.endpoints import auth, bookings, planner, users, vendors

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["Auth"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(vendors.router, prefix="/vendors", tags=["Vendors"])
router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
router.include_router(planner.router, prefix="/planner", tags=["Planner"])
