# Residential Management System - Team9

A full-stack residential management application with authentication, maintenance tasks, and notifications.

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **MySQL Workbench** (optional, for database management) - [Download here](https://www.mysql.com/products/workbench/)

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
   JWT_SECRET=kjh2387sdf87sdf98sdf\
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

### Frontend
- React 18
- Vite
- Material UI (MUI)
- React Router
- Axios for API calls

## Notes

- The default login credentials need to be created through the registration page
- Ensure both backend and frontend servers are running simultaneously
- The `.env` file must be properly configured before running the backend

## Team Members

Team 9 - Residential Management System Project
