const express = require('express');
const router = express.Router();
const AssignmentListController = require('../controllers/assignmentListController');

router.get('/pending', AssignmentListController.getPendingAssignments);
router.post('/accept', AssignmentListController.acceptAssignment);
router.post('/decline', AssignmentListController.declineAssignment);
router.get('/accepted', AssignmentListController.getAcceptedAssignments);

module.exports = router;
