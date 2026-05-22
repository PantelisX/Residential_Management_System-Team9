// backend/routes/residenceRoutes.js
const express = require('express');
const router = express.Router();
const { getResidencesForUser } = require('../controllers/residenceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route to get user's residences
router.get('/', authMiddleware, getResidencesForUser);

module.exports = router;
