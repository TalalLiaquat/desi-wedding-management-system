# Desi Wedding Management System Backend

This backend is built with FastAPI, SQLAlchemy, Alembic, and JWT authentication.

## Setup

1. Create a `.env` file in `backend` with your environment variables.
2. Build the Docker image:
   ```bash
   docker build -t desi-wedding-backend .
   ```
3. Run the backend with Docker Compose:
   ```bash
   docker compose up --build
   ```

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/vendors`
- `GET /api/bookings`

## Notes

The backend is designed for extensibility with vendor, booking, guest, invitation, and payment management.
