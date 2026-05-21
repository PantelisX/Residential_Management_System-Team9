---
name: sql-database
description: Use this skill when the user requests database connection setup, SQL queries, API endpoints, or table management for the `maintenance_system` database.
---

# SQL & Database Management Guidelines (`maintenance_system`)

## 1. Security & Coding Rules
- **SQL Injection Protection:** Never use string interpolation (e.g. `${id}`) inside SQL queries. Always use Parameterized Queries with placeholders (e.g. `?` or `$1` depending on the driver).
- **Credential Management:** Never hardcode database credentials. Use environment variables through `process.env`.
- **Asynchronous Code:** All database operations must use `async/await` and be wrapped inside `try/catch` blocks for proper error handling.

## 2. Database Schema Reference
Base all queries and logic exclusively on the following table structure of the `maintenance_system` database:

### Table: `Residence`
- `residence_id` (INT, PK)
- `address` (VARCHAR)
- `owner` (VARCHAR)
- `description` (TEXT)

### Table: `MaintenanceTask`
- `task_id` (INT, PK)
- `residence_id` (INT, FK -> Residence.residence_id)
- `status` (ENUM: `'open'`, `'in_progress'`, `'completed'`, `'cancelled'`)
- `accepted` (BOOLEAN, DEFAULT FALSE)
- `tech_id` (INT)
- `category` (ENUM: `'electrical'`, `'plumbing'`, `'hvac'`, `'landscaping'`, `'other'`)
- `description` (TEXT)
- `start_date` (DATE)
- `end_date` (DATE)

### Table: `TaskHistory`
- `history_id` (INT, PK)
- `task_id` (INT, FK -> MaintenanceTask.task_id)
- `address` (VARCHAR)
- `category` (ENUM: `'electrical'`, `'plumbing'`, `'hvac'`, `'landscaping'`, `'other'`)
- `description` (TEXT)
- `completion_date` (DATE)

### Table: `User`
- `user_id` (INT, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `phone` (VARCHAR)
- `password` (VARCHAR)
- `is_technician` (BOOLEAN, DEFAULT FALSE)

### Table: `UserResidence` (Many-to-Many Relationship)
- `user_id` (INT, PK, FK -> User.user_id ON DELETE CASCADE)
- `residence_id` (INT, PK, FK -> Residence.residence_id ON DELETE CASCADE)
- `user_role` (ENUM: `'tenant'`, `'owner'`, `'manager'`)

## 3. Common Queries & Examples
When the user requests statistics or reports, remember the ENUM values:

- For maintenance tasks, filter using the `category` (`'electrical'`, `'plumbing'`, etc.) or the `status` (`'open'`, `'in_progress'`, etc.).
- For user roles in residences, use the `user_role` values (`'tenant'`, `'owner'`, `'manager'`).