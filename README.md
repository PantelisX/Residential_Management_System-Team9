# Residential Management System - Team9

A full-stack residential management application with authentication, maintenance tasks, and notifications.

## Build Status

![Backend Tests](https://github.com/PantelisX/Residential_Management_System-Team9/actions/workflows/backend-tests.yml/badge.svg)
![Frontend Tests](https://github.com/PantelisX/Residential_Management_System-Team9/actions/workflows/frontend-tests.yml/badge.svg)
![Backend Lint](https://github.com/PantelisX/Residential_Management_System-Team9/actions/workflows/backend-lint.yml/badge.svg)
![Frontend Lint](https://github.com/PantelisX/Residential_Management_System-Team9/actions/workflows/frontend-lint.yml/badge.svg)
![Docker Build](https://github.com/PantelisX/Residential_Management_System-Team9/actions/workflows/docker-build.yml/badge.svg)
![Docker Compose Build](https://github.com/PantelisX/Residential_Management_System-Team9/actions/workflows/docker-compose-build.yml/badge.svg)


## Prerequisites

Before running this project, make sure you have:

### Docker Deployment

- Docker (v20.10+)
- Docker Compose (v2.0+)

### Manual Deployment

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **MySQL Workbench** (optional, for database management) - [Download here](https://www.mysql.com/products/workbench/)

## Quick Start with Docker

### Clone Repository

```bash
git clone https://github.com/PantelisX/Residential_Management_System-Team9.git
cd Residential_Management_System-Team9
```

### Build and Start Containers

```bash
docker compose build
docker compose up
```

Or run in detached mode:

```bash
docker compose up -d
```

### Application URLs

| Service | URL |
|----------|----------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MySQL Database | localhost:3306 |

### Stop Containers

```bash
docker compose down
```

---

## Docker Architecture

The application is containerized using Docker and consists of three services:

### Frontend Container
- React + Vite application
- Served through Nginx
- Available on port 3000

### Backend Container
- Node.js / Express API
- Available on port 5000
- Connects to MySQL through Docker network

### Database Container
- MySQL 8.0
- Available on port 3306
- Automatically initialized through the provided SQL script

All services are orchestrated through Docker Compose.

## Manual Installation & Run

## Database Setup

1. Open MySQL Workbench or MySQL command line
2. Run the SQL file located at: `src/database/sql/maintenanceDatabase.sql`
3. Ensure the database `maintenance_system` is created
4. Update database credentials in `.env` file if needed:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=maintenance_system
   DB_PORT=3306
   JWT_SECRET=kjh2387sdf87sdf98sdf
   ```

## Installation & Run

### Terminal 1 - Backend

```bash
cd Residential_Management_System-Team9/backend
npm install
cd ../
node backend/server.js
```

The backend server will start on **port 5000**.

### Terminal 2 - Frontend

```bash
cd Residential_Management_System-Team9/frontend
npm install
npm run dev
```

The frontend will start on the default Vite port (usually **port 3000** or **5173**).

## Testing

### Backend Tests
Run the backend test suite with Jest:

```bash
cd backend
npm test
```

Current status:

- 2/2 tests passing


### Frontend Tests
Run the frontend test suite with Vitest:

```bash
cd frontend
npm test
```

Current status:

- 1/1 tests passing


## Linting

### Backend
Check for code style issues in the backend:

```bash
cd backend
npm run lint
```

### Frontend
Check for code style issues in the frontend:

```bash
cd frontend
npm run lint
```

## Docker Commands

### Build Images

```bash
docker compose build
```

### Start Containers

```bash
docker compose up
```

### Start Containers (Background)

```bash
docker compose up -d
```

### Stop Containers

```bash
docker compose down
```

### Rebuild After Changes

```bash
docker compose down
docker compose up -d --build
```


## Continuous Integration (CI/CD)

The project uses GitHub Actions for automated validation.

### Docker Build Workflow

File:

```text
.github/workflows/docker-build.yml
```

Features:

- Builds backend Docker image
- Builds frontend Docker image
- Pushes images to GitHub Container Registry (GHCR)
- Runs backend tests
- Runs frontend tests
- Uses Docker layer caching for faster builds

### Docker Compose Workflow

File:

```text
.github/workflows/docker-compose-build.yml
```

Features:

- Builds the complete application stack
- Verifies Docker Compose configuration
- Runs containerized tests

### Additional Workflows

- Backend Tests
- Frontend Tests
- Backend Lint
- Frontend Lint

All workflows run automatically on Push and Pull Request events.


## Docker Validation

The Docker environment was tested successfully through the following workflows:

### User Features

- User Registration
- User Login
- Residence Creation
- Maintenance Task Creation

### Infrastructure Validation

- Frontend ↔ Backend communication
- Backend ↔ MySQL communication
- Docker networking
- Container startup and shutdown
- Database initialization

All functionality operated successfully within the Docker environment.


## How to Use

1. Open your browser and navigate to `http://localhost:3000` (or the Vite port shown in terminal)
2. You will be redirected to the login page
3. Click "Register" to create a new account
4. After logging in, you can access:
   - Residences management
   - Current tasks
   - History
   - Assignments
   - Profile

## Features

- User registration and authentication (JWT-based)
- Residential management
- Maintenance tasks (electrical, plumbing, HVAC, landscaping)
- Task history tracking
- Notifications system
- Profile management

## Tech Stack

### Backend
- Node.js + Express.js
- MySQL + mysql2
- JWT authentication
- bcrypt for password hashing
- CORS enabled
- Jest

### Frontend
- React 18
- Vite
- Material UI (MUI)
- React Router
- Axios for API calls
- Vitest

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)


## Notes

- Docker Desktop is recommended for Windows users.
- The default login credentials need to be created through the registration page
- Ensure both backend and frontend servers are running simultaneously
- The `.env` file must be properly configured before running the backend
- For Docker deployment, the backend connects to the database using the service name `db`.
- For manual deployment, the backend connects using `localhost`.
- Ensure Docker Desktop is running before executing Docker commands.


## Team Members

Team 9 - Residential Management System Project
