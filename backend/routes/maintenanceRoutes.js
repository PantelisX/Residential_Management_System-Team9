// backend/routes/maintenanceRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const maintenanceController = require('../controllers/maintenanceController');

router.post('/tasks', authMiddleware, maintenanceController.createTask);

router.get('/tasks', authMiddleware, maintenanceController.getTasks);

router.get('/technicians', authMiddleware, maintenanceController.getTechnicians);

module.exports = router;