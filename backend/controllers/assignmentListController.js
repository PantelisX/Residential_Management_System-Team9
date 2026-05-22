'use strict';

const db = require('../config/db');
const notificationController = require('./notificationController');
const schedulerModel = require('../models/schedulerModel');

const AssignmentListController = {};

AssignmentListController.getPendingAssignments = async (req, res) => {
  try {
    const [tasks] = await db.query(
      `SELECT mt.task_id, mt.category, mt.description, mt.start_date, 
              t.user_id AS technician_id, t.name AS technician_name, t.email AS technician_email, t.phone AS technician_phone,
              r.address AS residence_address, r.owner AS residence_owner
       FROM MaintenanceTask mt
       LEFT JOIN users t ON mt.tech_id = t.user_id
       JOIN Residence r ON mt.residence_id = r.residence_id
       WHERE mt.status =  'open'
       AND (mt.accepted = FALSE OR mt.status IS NULL)`
    );
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching pending assignments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

AssignmentListController.acceptAssignment = async (req, res) => {
  try {
    const { task_id } = req.body;
    
    if (!task_id) {
      return res.status(400).json({ error: 'task_id is required' });
    }

    const [tasks] = await db.query(
      `SELECT mt.task_id, mt.description, mt.category, mt.start_date, mt.residence_id, 
              r.address, r.owner, mt.tech_id, t.email AS technician_email, t.name AS technician_name, t.phone AS technician_phone,
              u2.email AS resident_email, u2.name AS resident_name,
              u3.email AS owner_email, u3.name AS owner_name
       FROM MaintenanceTask mt
       JOIN Residence r ON mt.residence_id = r.residence_id
       LEFT JOIN users t ON mt.tech_id = t.user_id
       LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
       LEFT JOIN users u2 ON ur.user_id = u2.user_id
       LEFT JOIN users u3 ON r.owner = u3.email
       WHERE mt.task_id = ?`,
      [task_id]
    );

    const task = tasks[0];

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.query(
      `UPDATE MaintenanceTask 
       SET accepted = TRUE 
       WHERE task_id = ?`,
      [task_id]
    );

    await notificationController.notifyTaskAccepted(task);

    return res.status(200).json({ message: 'Assignment accepted', task });
  } catch (error) {
    console.error('Error accepting assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

AssignmentListController.declineAssignment = async (req, res) => {
  try {
    const {task_id} = req.body;
    
    if (!task_id) {
      return res.status(400).json({ error: 'task_id is required' });
    }

    const [tasks] = await db.query(
      `SELECT mt.task_id, mt.description, mt.category, mt.start_date, mt.residence_id, 
              r.address, r.owner, mt.tech_id, t.email AS technician_email, t.name AS technician_name, t.phone AS technician_phone,
              u2.email AS resident_email, u2.name AS resident_name,
              u3.email AS owner_email, u3.name AS owner_name
       FROM MaintenanceTask mt
       JOIN Residence r ON mt.residence_id = r.residence_id
       LEFT JOIN users t ON mt.tech_id = t.user_id
       LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
       LEFT JOIN users u2 ON ur.user_id = u2.user_id
       LEFT JOIN users u3 ON r.owner = u3.email
       WHERE mt.task_id = ?`,
      [task_id]
    );

    const task = tasks[0];

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.query(
      `UPDATE MaintenanceTask 
       SET accepted = FALSE, status = 'cancelled' 
       WHERE task_id = ?`,
      [task_id]
    );

    await notificationController.notifyTaskRejected(task);

    return res.status(200).json({ message: 'Assignment declined', task });
  } catch (error) {
    console.error('Error declining assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

AssignmentListController.getAcceptedAssignments = async (req, res) => {
  try {
    const tasks = await schedulerModel.getAcceptedTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching accepted assignments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

AssignmentListController.updateTaskStatus = async (req, res) => {
  try {
    const { task_id, newStatus } = req.body;

    if (!task_id || !newStatus) {
      return res.status(400).json({ error: 'task_id and newStatus are required' });
    }

    const validStatuses = ['open', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status value. Must be open, in_progress, completed, or cancelled' });
    }

    const [tasks] = await db.query(
      `SELECT mt.task_id, mt.status, mt.category, mt.description, mt.residence_id, 
              r.address, r.owner, mt.tech_id, t.email AS technician_email, t.name AS technician_name, t.phone AS technician_phone,
              u2.email AS resident_email, u2.name AS resident_name,
              u3.email AS owner_email, u3.name AS owner_name
       FROM MaintenanceTask mt
       JOIN Residence r ON mt.residence_id = r.residence_id
       LEFT JOIN users t ON mt.tech_id = t.user_id
       LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
       LEFT JOIN users u2 ON ur.user_id = u2.user_id
       LEFT JOIN users u3 ON r.owner = u3.email
       WHERE mt.task_id = ?`,
      [task_id]
    );

    const task = tasks[0];

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const oldStatus = task.status;

    await db.query(
      `UPDATE MaintenanceTask 
       SET status = ? 
       WHERE task_id = ?`,
      [newStatus, task_id]
    );

    schedulerModel.notifyStatusChange(task, oldStatus, newStatus);

    return res.status(200).json({ message: 'Task status updated', task: { task_id, newStatus } });
  } catch (error) {
    console.error('Error updating task status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = AssignmentListController;
