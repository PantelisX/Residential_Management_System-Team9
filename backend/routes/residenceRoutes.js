// backend/routes/residenceRoutes.js
const express = require('express');
const router = express.Router();

const {
  getResidencesForUser,
  createResidence
} = require('../controllers/residenceController');

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getResidencesForUser);

router.post('/', authMiddleware, createResidence);

module.exports = router;