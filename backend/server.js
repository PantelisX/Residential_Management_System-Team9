const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const residenceRoutes = require("./routes/residenceRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// auth routes
app.use("/api/auth", authRoutes);

// assignment routes
app.use("/api/assignments", assignmentRoutes);
//Curr task
app.use("/api/tasks", tasksRoutes);

// residence routes
app.use("/api/residences", residenceRoutes);

// maintenance routes
app.use("/api/maintenance", maintenanceRoutes);

//notifications 
app.use('/api/notifications',notificationRoutes);

// port
const PORT = process.env.PORT || 3001;

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});