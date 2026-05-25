const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const {getNotifications,markNotificationAsRead} = require('../controllers/notificationController');

router.get('/',authMiddleware,getNotifications);

router.put('/:notificationId/read',authMiddleware,markNotificationAsRead);

module.exports = router;