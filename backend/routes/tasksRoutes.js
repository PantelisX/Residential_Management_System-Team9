// backend/routes/tasksRoutes.js
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get current tasks route (only open/in_progress tasks)
router.get('/current', authMiddleware, tasksController.getCurrentTasks);

module.exports = router;