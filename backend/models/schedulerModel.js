'use strict';

const connection = require('../config/db');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

const SchedulerModel = {};

/**
 * Retrieves maintenance tasks scheduled to start in exactly 1 month
 * Only returns tasks that have been accepted by a technician
 * Used for sending advance reminders to technicians and residents
 */
SchedulerModel.getUpcomingTasksByOneMonth = async () => {
  const tasks = await query(
    `SELECT mt.task_id, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN User u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN User u2 ON ur.user_id = u2.user_id
     LEFT JOIN User u3 ON r.owner = u3.email
     WHERE mt.start_date = DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
     AND mt.accepted = TRUE`
  );
  return tasks;
};

/**
 * Retrieves maintenance tasks scheduled to start in exactly 1 day
 * Only returns tasks that have been accepted by a technician
 * Used for sending day-before reminders to technicians and residents
 */
SchedulerModel.getUpcomingTasksByOneDay = async () => {
  const tasks = await query(
    `SELECT mt.task_id, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN User u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN User u2 ON ur.user_id = u2.user_id
     LEFT JOIN User u3 ON r.owner = u3.email
     WHERE mt.start_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
     AND mt.accepted = TRUE`
  );
  return tasks;
};

/**
 * Retrieves all maintenance tasks that have been accepted by technicians
 * Returns complete task details with technician and resident information
 * Used to track active/ongoing maintenance work
 */
SchedulerModel.getAcceptedTasks = async () => {
  const tasks = await query(
    `SELECT mt.task_id, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN User u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN User u2 ON ur.user_id = u2.user_id
     LEFT JOIN User u3 ON r.owner = u3.email
     WHERE mt.accepted = TRUE`
  );
  return tasks;
};

/**
 * Retrieves all maintenance tasks that have been rejected by technicians
 * Returns task details with technician and resident information
 * Used to track tasks needing reassignment or attention
 */
SchedulerModel.getRejectedTasks = async () => {
  const tasks = await query(
    `SELECT mt.task_id, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN User u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN User u2 ON ur.user_id = u2.user_id
     LEFT JOIN User u3 ON r.owner = u3.email
     WHERE mt.accepted = FALSE`
  );
  return tasks;
};

/**
 * Generates notification when task status changes
 * Only triggers for specific transitions:
 *   - "open" → "in_progress" (task starts)
 *   - "in_progress" → "completed" (task completes)
 * Prints notification details to console for logging
 * @param {Object} task - Task object with technician/resident info
 * @param {string} oldStatus - Previous task status
 * @param {string} newStatus - New task status
 * @returns {boolean} true if notification generated, false otherwise
 */
SchedulerModel.notifyStatusChange = (task, oldStatus, newStatus) => {
  if ((oldStatus === 'open' && newStatus === 'in_progress') || 
      (oldStatus === 'in_progress' && newStatus === 'completed')) {
    console.log(`Notification: Task ${task.task_id} status changed from "${oldStatus}" to "${newStatus}"`);
    console.log(`  Technician: ${task.technician_name} (${task.technician_email})`);
    console.log(`  Resident: ${task.resident_name} (${task.resident_email})`);
    console.log(`  Owner: ${task.owner_name} (${task.owner_email})`);
    console.log(`  Location: ${task.address}`);
    console.log(`  Category: ${task.category}`);
    console.log(`  Description: ${task.description}`);
    return true;
  }
  return false;
};

/**
 * Generates notification objects for various maintenance events
 * Supports multiple notification types with recipient and message details
 * Simulates notifications by printing to console (can be extended)
 * @param {string} type - Notification type to generate
 * @param {Array} data - Array of task objects
 * @returns {Array} Array of notification objects
 */
SchedulerModel.generateNotification = (type, data) => {
  const notifications = [];

  switch (type) {
    case 'upcoming_1_month':
      data.forEach(task => {
        notifications.push({
          type: 'upcoming_maintenance_1_month',
          recipient: task.technician_email,
          title: 'Upcoming Maintenance Task Reminder',
          message: `Maintenance task for ${task.category} will start on ${task.start_date} at ${task.address}. Description: ${task.description}`,
          task_id: task.task_id
        });
        if (task.resident_email) {
          notifications.push({
            type: 'upcoming_maintenance_1_month',
            recipient: task.resident_email,
            title: 'Upcoming Maintenance Task Reminder',
            message: `Maintenance task for ${task.category} will start on ${task.start_date} at your residence. Description: ${task.description}`,
            task_id: task.task_id
          });
        }
        if (task.owner_email) {
          notifications.push({
            type: 'upcoming_maintenance_1_month',
            recipient: task.owner_email,
            title: 'Upcoming Maintenance Task Reminder',
            message: `Maintenance task for ${task.category} will start on ${task.start_date} at your property. Description: ${task.description}`,
            task_id: task.task_id
          });
        }
      });
      break;

    case 'upcoming_1_day':
      data.forEach(task => {
        notifications.push({
          type: 'upcoming_maintenance_1_day',
          recipient: task.technician_email,
          title: 'Upcoming Maintenance Task Reminder',
          message: `Maintenance task for ${task.category} starts tomorrow (${task.start_date}) at ${task.address}. Description: ${task.description}`,
          task_id: task.task_id
        });
        if (task.resident_email) {
          notifications.push({
            type: 'upcoming_maintenance_1_day',
            recipient: task.resident_email,
            title: 'Upcoming Maintenance Task Reminder',
            message: `Maintenance task for ${task.category} starts tomorrow (${task.start_date}) at your residence. Description: ${task.description}`,
            task_id: task.task_id
          });
        }
        if (task.owner_email) {
          notifications.push({
            type: 'upcoming_maintenance_1_day',
            recipient: task.owner_email,
            title: 'Upcoming Maintenance Task Reminder',
            message: `Maintenance task for ${task.category} starts tomorrow (${task.start_date}) at your property. Description: ${task.description}`,
            task_id: task.task_id
          });
        }
      });
      break;

    case 'task_accepted':
      data.forEach(task => {
        notifications.push({
          type: 'task_accepted',
          recipient: task.technician_email,
          title: 'Maintenance Task Accepted',
          message: `You have accepted maintenance task for ${task.category} at ${task.address}. Start date: ${task.start_date}`,
          task_id: task.task_id
        });
        if (task.resident_email) {
          notifications.push({
            type: 'task_accepted',
            recipient: task.resident_email,
            title: 'Maintenance Task Accepted',
            message: `Maintenance task for ${task.category} at your residence has been accepted by technician ${task.technician_name}. Start date: ${task.start_date}`,
            task_id: task.task_id
          });
        }
        if (task.owner_email) {
          notifications.push({
            type: 'task_accepted',
            recipient: task.owner_email,
            title: 'Maintenance Task Accepted',
            message: `Maintenance task for ${task.category} at your property has been accepted by technician ${task.technician_name}. Start date: ${task.start_date}`,
            task_id: task.task_id
          });
        }
      });
      break;

    case 'task_rejected':
      data.forEach(task => {
        notifications.push({
          type: 'task_rejected',
          recipient: task.technician_email,
          title: 'Maintenance Task Status',
          message: `Maintenance task for ${task.category} at ${task.address} has been rejected.`,
          task_id: task.task_id
        });
        if (task.resident_email) {
          notifications.push({
            type: 'task_rejected',
            recipient: task.resident_email,
            title: 'Maintenance Task Status',
            message: `Maintenance task for ${task.category} at your residence has been rejected by the technician.`,
            task_id: task.task_id
          });
        }
        if (task.owner_email) {
          notifications.push({
            type: 'task_rejected',
            recipient: task.owner_email,
            title: 'Maintenance Task Status',
            message: `Maintenance task for ${task.category} at your property has been rejected by the technician.`,
            task_id: task.task_id
          });
        }
      });
      break;

    case 'status_changed':
      data.forEach(task => {
        console.log(`Notification: Status change for Task ${task.task_id}`);
        console.log(`  Technician: ${task.technician_name} (${task.technician_email})`);
        console.log(`  Resident: ${task.resident_name} (${task.resident_email})`);
        console.log(`  Owner: ${task.owner_name} (${task.owner_email})`);
        console.log(`  Location: ${task.address}`);
        console.log(`  Category: ${task.category}`);
        console.log(`  Description: ${task.description}`);
      });
      break;
  }

  return notifications;
};

module.exports = SchedulerModel;