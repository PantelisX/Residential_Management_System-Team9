'use strict';

const db = require('../config/db');

const SchedulerModel = {};

SchedulerModel.getUpcomingTasksByOneMonth = async () => {
  const [tasks] = await db.query(
    `SELECT mt.task_id, mt.status, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN users u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN users u2 ON ur.user_id = u2.user_id
     LEFT JOIN users u3 ON r.owner = u3.email
     WHERE mt.start_date = DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
     AND mt.accepted = TRUE`
  );
  return tasks;
};

SchedulerModel.getUpcomingTasksByOneDay = async () => {
  const [tasks] = await db.query(
    `SELECT mt.task_id,mt.status, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN users u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN users u2 ON ur.user_id = u2.user_id
     LEFT JOIN users u3 ON r.owner = u3.email
     WHERE mt.start_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
     AND mt.accepted = TRUE`
  );
  return tasks;
};

SchedulerModel.getAcceptedTasks = async () => {
  const [tasks] = await db.query(
    `SELECT mt.task_id, mt.status, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN users u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN users u2 ON ur.user_id = u2.user_id
     LEFT JOIN users u3 ON r.owner = u3.email
     WHERE mt.accepted = TRUE
     AND mt.status != 'completed'
     AND mt.status != 'cancelled'`
  );
  return tasks;
};

SchedulerModel.getRejectedTasks = async () => {
  const [tasks] = await db.query(
    `SELECT mt.task_id, mt.status, mt.start_date, mt.description, mt.category, mt.residence_id, r.address, r.owner, mt.tech_id, u.email AS technician_email, u.name AS technician_name, u.phone AS technician_phone, u2.email AS resident_email, u2.name AS resident_name, u3.email AS owner_email, u3.name AS owner_name
     FROM MaintenanceTask mt
     JOIN Residence r ON mt.residence_id = r.residence_id
     LEFT JOIN users u ON mt.tech_id = u.user_id
     LEFT JOIN UserResidence ur ON mt.residence_id = ur.residence_id
     LEFT JOIN users u2 ON ur.user_id = u2.user_id
     LEFT JOIN users u3 ON r.owner = u3.email
     WHERE mt.accepted = FALSE`
  );
  return tasks;
};

SchedulerModel.notifyStatusChange = (task, oldStatus, newStatus) => {
  return true;
};

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
      break;
  }

  return notifications;
};

/**
 * Get notifications for a specific user
 * Used for popup notifications in frontend
 */
SchedulerModel.getUserNotifications = async (userId) => {

  const [tasks] = await db.query(

    `SELECT
      mt.task_id,
      mt.status,
      mt.category,
      mt.description,
      mt.start_date,
      r.address
    FROM MaintenanceTask mt
    JOIN Residence r
      ON mt.residence_id = r.residence_id
    WHERE mt.tech_id = ?
    AND mt.status IN (
      'in_progress',
      'completed',
      'cancelled'
    )
    ORDER BY mt.task_id DESC`,
    
    [userId]
  );

  return tasks;
};

/**
 * Create notification
 */
SchedulerModel.createNotification =
  async (
    userId,
    title,
    message,
    description,
    startDate,
    endDate
  ) => {

    const sql = `
      INSERT INTO Notifications (
        user_id,
        title,
        message,
        description,
        start_date,
        end_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.execute(
      sql,
      [
        userId,
        title,
        message,
        description,
        startDate,
        endDate
      ]
    );
};

/**
 * Get unread notifications
 */
SchedulerModel.getUnreadNotifications =
  async (userId) => {

    const sql = `
      SELECT *
      FROM Notifications
      WHERE user_id = ?
      AND is_read = FALSE
      ORDER BY notification_id DESC
    `;

    const [rows] =
      await db.execute(
        sql,
        [userId]
      );

    return rows;
};

/**
 * Mark notification as read
 */
SchedulerModel.markAsRead =
  async (notificationId) => {

    const sql = `
      UPDATE Notifications
      SET is_read = TRUE
      WHERE notification_id = ?
    `;

    await db.execute(
      sql,
      [notificationId]
    );
};

// Delete notifications older than 5 days to prevent clutter
SchedulerModel.deleteOldNotifications =
  async () => {

  await db.query(

    `DELETE FROM Notifications
     WHERE created_at <
     NOW() - INTERVAL 5 DAY`
  );
};

// Check if a notification already exists to prevent duplicates
SchedulerModel.notificationExists =
  async (
    userId,
    title,
    startDate
  ) => {

  const [rows] = await db.query(

    `SELECT notification_id
     FROM Notifications
     WHERE user_id = ?
     AND title = ?
     AND start_date = ?`,

    [
      userId,
      title,
      startDate
    ]
  );

  return rows.length > 0;
};

 module.exports = SchedulerModel;
