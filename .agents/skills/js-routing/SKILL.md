---
name: js-routing
description: Use this skill when the user requests creation or modification of Express Routes, Controllers, HTTP methods, or protected endpoints with Middlewares.
---

# Express Architecture Guidelines (Routes, Controllers & Middlewares)

## 1. Separation of Concerns
- **Routes (`/backend/routes/`):** Define the endpoints. If an endpoint requires user authentication, insert the `authMiddleware` as the second parameter before the controller.
- **Controllers (`/backend/controllers/`):** Contain the business logic. They can access the authenticated user data through `req.user` (which is set by the middleware).
- **Middlewares (`/backend/middlewares/`):** Handle cross-cutting concerns such as Authentication (JWT).

## 2. Code Structure Pattern (Based on the Project)

### Example of a Protected Route with Middleware
When an endpoint requires authentication, include the `authMiddleware` as shown in the following pattern:

```javascript
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const authMiddleware = require("../middlewares/authMiddleware");

// The authMiddleware is placed before the controller to protect the route
router.get("/dashboard", authMiddleware, homeController.getDashboardData);

module.exports = router;