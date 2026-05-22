'use strict';

const schedulerModel = require('../models/schedulerModel');

/**
 * Sends upcoming task reminders for tasks scheduled in 1 month
 * Retrieves tasks and generates notifications for technicians and residents
 */
const sendUpcomingMonthNotifications = async () => {
  const tasks = await schedulerModel.getUpcomingTasksByOneMonth();
  const notifications = schedulerModel.generateNotification('upcoming_1_month', tasks);
  return notifications;
};

/**
 * Sends upcoming task reminders for tasks scheduled in 1 day
 * Retrieves tasks and generates notifications for technicians and residents
 */
const sendUpcomingDayNotifications = async () => {
  const tasks = await schedulerModel.getUpcomingTasksByOneDay();
  const notifications = schedulerModel.generateNotification('upcoming_1_day', tasks);
  return notifications;
};

/**
 * Generates notification when a task is accepted by a technician
 * Sends notifications to both the technician and resident/owner
 * @param {Object} task - The accepted task object
 * @returns {Array} Array of notification objects
 */
const notifyTaskAccepted = (task) => {
  const notifications = schedulerModel.generateNotification('task_accepted', [task]);
  return notifications;
};

/**
 * Generates notification when a task is rejected by a technician
 * Sends notifications to both the technician and resident/owner
 * @param {Object} task - The rejected task object
 * @returns {Array} Array of notification objects
 */
const notifyTaskRejected = (task) => {
  const notifications = schedulerModel.generateNotification('task_rejected', [task]);
  return notifications;
};

/**
 * Handles task status change notifications
 * Calls the model's notifyStatusChange to log the change
 * @param {Object} task - The task object
 * @param {string} oldStatus - Previous status (open or in_progress)
 * @param {string} newStatus - New status (in_progress or completed)
 * @returns {boolean} true if notification was generated, false otherwise
 */
const notifyTaskStatusChange = (task, oldStatus, newStatus) => {
  return schedulerModel.notifyStatusChange(task, oldStatus, newStatus);
};

module.exports = {
  sendUpcomingMonthNotifications,
  sendUpcomingDayNotifications,
  notifyTaskAccepted,
  notifyTaskRejected,
  notifyTaskStatusChange
};