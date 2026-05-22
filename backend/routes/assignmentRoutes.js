const express = require('express');

const router = express.Router();

const AssignmentListController = require('../controllers/assignmentListController');

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/pending', authMiddleware, AssignmentListController.getPendingAssignments);

router.post('/accept', authMiddleware, AssignmentListController.acceptAssignment);

router.post('/decline', authMiddleware, AssignmentListController.declineAssignment);

router.get('/accepted', authMiddleware, AssignmentListController.getAcceptedAssignments);

router.put('/status', authMiddleware, AssignmentListController.updateTaskStatus);

module.exports = router;