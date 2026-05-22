---
name: js-server
description: Use this skill when the user requests the initial setup of the Express server, the addition of new global middlewares (such as CORS or body-parsers), or the registration of new routes in `server.js`.
---

# Central Server Management Guidelines (`server.js`)

## 1. `server.js` Architecture
The server is based on the Express framework and follows this loading order:

1. **Imports:** Packages (`express`, `cors`, `path`, `dotenv`) followed by the route files.
2. **Initialization:** Creation of `app = express()`.
3. **Global Middlewares:** `cors()`, `express.json()`, `express.urlencoded()`, and static folders (`/uploads`).
4. **Routes Mounting:** Registration of API endpoints with the `/api` prefix.
5. **App Listen:** Start the server on the predefined PORT (from `.env` or fallback `5000`).

## 2. Pattern for Registering New Routes
When a new routes file is created (e.g. `homeRoutes.js`), the Agent should guide the user to connect it in `server.js` following this pattern:

```javascript
// 1. Import the Route (together with the other routes at the top)
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes'); // <-- Example of a new addition

// 2. Mount the Route to the API (above app.listen)
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes); // <-- Example of a new addition