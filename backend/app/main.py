from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.router import router as api_router
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.planner import PlannerCategory
from app.models.user import User, UserRole
from app.models.vendor import Vendor


def seed_initial_data() -> None:
    db: Session = SessionLocal()
    try:
        Base.metadata.create_all(bind=engine)
        if db.query(PlannerCategory).count() == 0:
            categories = [
                PlannerCategory(name="Venues", description="Luxury wedding halls and marquee venues", icon="building"),
                PlannerCategory(name="Transport", description="Premium bridal cars and guest transport", icon="car"),
                PlannerCategory(name="Cuisine", description="Catering and fine dining services", icon="utensils"),
                PlannerCategory(name="Photography", description="Photography and cinematic wedding coverage", icon="camera"),
                PlannerCategory(name="Decor", description="Floral, lighting, and stage decor", icon="sparkles"),
            ]
            db.add_all(categories)
        if db.query(Vendor).count() == 0:
            vendors = [
                Vendor(name="Golden Palace Marquees", category="Venues", city="Lahore", price=180000, rating=4.9, description="Opulent marquee venue with luxury hospitality."),
                Vendor(name="Royal Ride Chauffeurs", category="Transport", city="Karachi", price=45000, rating=4.8, description="Elegant wedding car fleet for baraat and guest transport."),
                Vendor(name="Saffron Banquets", category="Cuisine", city="Islamabad", price=120000, rating=4.7, description="Gourmet catering with signature Pakistani menus."),
                Vendor(name="Noor & Lumi Photography", category="Photography", city="Lahore", price=95000, rating=5.0, description="Editorial-style wedding photography with cinematic storytelling."),
                Vendor(name="Velvet Bloom Decor", category="Decor", city="Karachi", price=110000, rating=4.8, description="Statement décor, florals, and lighting for grand celebrations."),
            ]
            db.add_all(vendors)
        if db.query(User).filter(User.role == UserRole.admin).count() == 0:
            admin_user = User(
                full_name="Admin User",
                email="admin@desi.com",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.admin,
            )
            db.add(admin_user)
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


seed_initial_data()

app = FastAPI(
    title="Desi Wedding Management System API",
    description="Backend API for the Desi Wedding Management System for Pakistani Weddings.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/", status_code=200)
def root() -> dict[str, str]:
    return {
        "status": "success",
        "application": "Desi Wedding Management System API",
        "version": "1.0.0",
        "message": "Backend is running successfully",
    }

@app.get("/health", status_code=200)
def health_check() -> dict[str, str]:
    return {"status": "healthy"}
