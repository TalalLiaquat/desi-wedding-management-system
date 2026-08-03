import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_desi_wedding.db")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.db.session import get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_desi_wedding.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()


@pytest.fixture()
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_auth_and_budget_workflow(client):
    register_response = client.post(
        "/api/auth/register",
        json={"full_name": "Test User", "email": "test@example.com", "password": "secret123"},
    )
    assert register_response.status_code == 200

    login_response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "secret123"},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]
    budget_response = client.post(
        "/api/planner/budget",
        json={"name": "Decor", "amount": 15000, "category": "decor"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert budget_response.status_code == 200
    assert budget_response.json()["amount"] == 15000
