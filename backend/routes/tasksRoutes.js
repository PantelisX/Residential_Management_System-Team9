// backend/routes/tasksRoutes.js
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get current tasks route (only open/in_progress tasks)
router.get('/tasksRoutes', authMiddleware, tasksController.getCurrentTasks);

// Get history tasks route (completed/cancelled tasks)
router.get('/history', authMiddleware, tasksController.getHistoryTasks);

module.exports = router;