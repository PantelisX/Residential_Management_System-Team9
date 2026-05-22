# Backend Scripts for Task Management and Residence Data

This directory contains utility scripts for retrieving and analyzing residence, user, and task history data from the maintenance_system database.

## Scripts

### 1. retrieveResidenceData.js
Retrieves residence data with all associated users and task counts.

**Usage:**
```bash
# Get all residences
node backend/scripts/retrieveResidenceData.js

# Get specific residence by ID
node backend/scripts/retrieveResidenceData.js 1
```

**Output includes:**
- Residence ID, address, owner, description
- Total number of users associated with the residence
- List of users with their roles (tenant, owner, manager)
- Count of completed, cancelled, and active tasks

---

### 2. retrieveUserData.js
Retrieves user data with their associated residences and task statistics.

**Usage:**
```bash
# Get all users
node backend/scripts/retrieveUserData.js

# Get specific user by ID
node backend/scripts/retrieveUserData.js 5
```

**Output includes:**
- User ID, name, email, phone
- Technician status
- Total number of residences the user is associated with
- List of residences with user roles
- Count of completed, cancelled, and active tasks across all their residences

---

### 3. retrieveTaskHistory.js
Retrieves completed and cancelled task history with residence and user information.

**Usage:**
```bash
# Get all task history
node backend/scripts/retrieveTaskHistory.js

# Get task history for specific user (by user ID)
node backend/scripts/retrieveTaskHistory.js 5

# Get task history for specific residence (by residence ID)
node backend/scripts/retrieveTaskHistory.js 5 1

# Format: node retrieveTaskHistory.js [userId] [residenceId]
```

**Output includes:**
- Task ID, residence address, task category, description
- Task status (completed/cancelled), start date, end date
- Duration in days
- Owner name and email
- Summary statistics (total, completed, cancelled counts)

---

## Prerequisites

- Node.js installed
- Database connection configured in `backend/config/db.js`
- MySQL maintenance_system database populated with data

## Examples

### View all residences and their users:
```bash
node backend/scripts/retrieveResidenceData.js
```

### Get specific user's residences and tasks:
```bash
node backend/scripts/retrieveUserData.js 3
```

### Get task history for a specific user:
```bash
node backend/scripts/retrieveTaskHistory.js 3
```

### Get task history for a specific residence:
```bash
node backend/scripts/retrieveTaskHistory.js null 2
# Note: Use null or omit the first parameter to skip user filtering
```

---

## Error Handling

All scripts include error handling and will exit with status code 1 if an error occurs, or 0 on success. Check the console output for detailed error messages.
