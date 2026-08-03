# Desi Wedding Management System

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

## Project Description

Desi Wedding Management System is a full-stack web application for planning and managing premium wedding experiences in Pakistan. The platform combines a modern React frontend with a FastAPI backend, PostgreSQL storage, and Docker-based deployment to support vendor discovery, booking workflows, planner tools, and administrative oversight.

The current implementation includes:
- customer-facing landing and authentication experience
- vendor browsing with category and city filters
- booking creation and management
- a planner dashboard for budget, guest, checklist, reviews, notifications, payments, and invoice generation
- an admin panel for managing vendors, bookings, users, payments, and planner data

## Features

### Implemented and Available

- User registration, login, logout, and profile access
- Role-based access for Admin and Customer users
- Vendor catalog with search, category filtering, city filtering, and detail pages
- Booking creation, listing, updating, and deletion
- Planner tools for:
  - budget tracking
  - checklist management
  - guest list management
  - reviews
  - notifications
  - payments
  - invoice download (PDF via ReportLab, when available)
- Admin dashboard for managing vendors, bookings, users, payments, and planner items
- Seeded sample vendors and a default admin account
- Dockerized frontend, backend, database, and Nginx reverse proxy setup

### Current Vendor Categories

The implemented vendor categories include:
- Venues
- Transport
- Cuisine
- Photography
- Decor

> Separate modules such as Makeup Artist or DJ are not currently implemented in the codebase.

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Lucide Icons
- Sonner toast notifications

### Backend
- FastAPI
- SQLAlchemy ORM
- Pydantic / Pydantic Settings
- JWT-based authentication
- PostgreSQL driver via psycopg2
- ReportLab for invoice PDF generation

### Database
- PostgreSQL 16
- Database name: desi_wedding
- Default credentials: postgres / postgres

### DevOps
- Docker
- Docker Compose
- Nginx
- GitHub Actions CI/CD

## Project Architecture

The application follows a simple layered architecture:

- Frontend: React app served by Vite and routed through Nginx
- Backend: FastAPI REST API with routers for auth, users, vendors, bookings, and planner features
- Database: PostgreSQL for persistent application data
- Container Layer: Docker Compose orchestrates frontend, backend, database, and Nginx

Typical request flow:

1. User interacts with the React frontend
2. Frontend sends HTTP requests to the FastAPI backend
3. Backend queries PostgreSQL through SQLAlchemy models
4. Responses are returned to the UI and rendered in the dashboard or admin panel

## Folder Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   └── router.py
│   │   ├── core/
│   │   ├── crud/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   ├── alembic/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── .github/workflows/ci-cd.yml
```

## Prerequisites

Before running the project locally, make sure you have:

- Docker Desktop or Docker Engine
- Docker Compose
- Python 3.12+ (for local backend development)
- Node.js 20+ and npm (for local frontend development)

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd "Desi Wedding Management System"
```

## Environment Variables

The backend uses environment variables loaded from [backend/.env](backend/.env) when present.

| Variable | Description | Default |
| --- | --- | --- |
| DATABASE_URL | PostgreSQL connection string | postgresql+psycopg2://postgres:postgres@db:5432/desi_wedding |
| SECRET_KEY | JWT signing key | CHANGE_THIS_SECRET |
| ACCESS_TOKEN_EXPIRE_MINUTES | Access token lifetime in minutes | 10080 |
| ALGORITHM | JWT algorithm | HS256 |
| BACKEND_CORS_ORIGINS | Allowed frontend origins | localhost ports and 127.0.0.1 |
| SMTP_HOST | SMTP host for mail features | smtp.example.com |
| SMTP_PORT | SMTP port | 587 |
| SMTP_USER | SMTP username | user@example.com |
| SMTP_PASSWORD | SMTP password | password |

Example backend env file:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/desi_wedding
SECRET_KEY=your-secret-key
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:4173,http://localhost:80
```

## How to Run Locally

### Option 1: Docker Compose (Recommended)

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:5173/
- Backend API: http://localhost:8000/
- API Docs: http://localhost:8000/docs

### Option 2: Manual Local Development

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then visit:
- Frontend: http://localhost:5173/
- Backend docs: http://localhost:8000/docs

## Docker Setup

The project uses Docker Compose to run all services together.

### Services

- db: PostgreSQL 16 container
- backend: FastAPI app on port 8000
- frontend: Vite dev server on port 5173
- nginx: reverse proxy on port 80

### Useful Docker Commands

```bash
docker compose up --build
docker compose down
docker compose logs -f backend
docker compose ps
```

## Default Admin Credentials

The backend seeds a default administrator on first startup.

- Email: admin@desi.com
- Password: admin123

## User Roles

- Admin: can manage vendors, users, bookings, planner data, and payments
- Customer: can browse vendors, create bookings, and manage personal planner items

## Main Modules

The current implementation includes the following planning and management modules:

- Hall / Venue booking support through vendor listings and bookings
- Car / transport booking support through vendor listings and bookings
- Catering support through vendor categories and bookings
- Decoration support through vendor categories and bookings
- Photography support through vendor categories and bookings
- Guest List management
- Budget Tracker
- RSVP tracking
- Reviews and ratings
- Booking History
- Notifications
- Payments
- Invoice export

## API Documentation

FastAPI auto-generated API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Information

The application uses PostgreSQL with the following default configuration:

- Host: db (inside Docker) or localhost (outside Docker)
- Port: 5432
- Database: desi_wedding
- User: postgres
- Password: postgres

Database initialization is handled by SQLAlchemy model creation during backend startup.

## Docker & Docker Compose

Docker Compose is the recommended way to run the project in a local environment.

Configuration is defined in [docker-compose.yml](docker-compose.yml).

## Nginx Configuration

Nginx is used as a reverse proxy and is configured in [nginx/nginx.conf](nginx/nginx.conf).

It routes:
- /api/ requests to the backend service
- other requests to the frontend service

## CI/CD

The repository includes a GitHub Actions workflow in [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) that:
- installs backend dependencies
- runs backend tests
- installs frontend dependencies
- builds the frontend

## Screenshots

Below are the available project screenshots from the repository.

### Project Images
- [Home Page](Project%20Picture/Home%20Page.png)
- [Vendor Listing Page](Project%20Picture/Vendor%20Listing%20Page.png)
- [Dashboard](Project%20Picture/Dashboard.png)
- [Admin Panel](Project%20Picture/Admin%20Panel.png)

## Future Improvements

Potential enhancements for future releases:
- richer booking workflow with checkout and payment integration
- real email/SMS notifications
- improved analytics and reporting
- vendor approval workflow
- multi-language and multi-currency support
- richer admin reporting and audit logs

## Troubleshooting

### Frontend cannot reach backend
- Check that the backend container is running with `docker compose ps`
- Review logs with `docker compose logs backend`
- Ensure the frontend is using the correct API proxy target

### Port conflicts
- If port 5173, 8000, or 80 is already in use, stop the conflicting service or change the port mapping in [docker-compose.yml](docker-compose.yml)

### Login issues
- Use the seeded admin credentials listed above
- If needed, restart the backend container so the initial admin record is created

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Author

**Talal Liaquat**

Bachelor of Science in Computer Science (BSCS)  
Sindh Madressatul Islam University (SMIU), Karachi

Developed as a full-stack **Desi Wedding Management System** featuring React, FastAPI, PostgreSQL, Docker, JWT Authentication, and a premium luxury user interface for Pakistani wedding planning and vendor management.
