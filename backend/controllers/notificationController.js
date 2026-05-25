'use strict';

const schedulerModel = require('../models/schedulerModel');
const userModel = require('../models/userModel');

//const notificationModel = require('../models/schedulerModel');

/**
 * Sends upcoming task reminders for tasks scheduled in 1 month
 */
const sendUpcomingMonthNotifications = async () => {

  const tasks =
    await schedulerModel.getUpcomingTasksByOneMonth();

  const notifications =
    schedulerModel.generateNotification(
      'upcoming_1_month',
      tasks
    );

  return notifications;
};

/**
 * Sends upcoming task reminders for tasks scheduled in 1 day
 */
const sendUpcomingDayNotifications = async () => {

  const tasks =
    await schedulerModel.getUpcomingTasksByOneDay();

  const notifications =
    schedulerModel.generateNotification(
      'upcoming_1_day',
      tasks
    );

  return notifications;
};

/**
 * Generates notification when a task is accepted
 */
const notifyTaskAccepted = async (task) => {

  const notifications =
    schedulerModel.generateNotification(
      'task_accepted',
      [task]
    );

  for (const notification of notifications) {

    const technician = await userModel.getUserByEmail(notification.recipient);

      if (technician) {

      await schedulerModel.createNotification(
        technician.user_id,
        notification.title,
        notification.message,
        task.description,
        task.start_date,
        task.end_date || null
      );
    }
  }

  return notifications;
};

/**
 * Generates notification when a task is rejected
 */
const notifyTaskRejected = async (task) => {

  const notifications =
    schedulerModel.generateNotification(
      'task_rejected',
      [task]
    );

  return notifications;
};

/**
 * Handles task status change notifications
 */
const notifyTaskStatusChange = async (
  task,
  oldStatus,
  newStatus
) => {

  console.log(task);

  /**
 * Notify resident
 */
if (task.resident_email) {

  const resident =
    await userModel.getUserByEmail(
      task.resident_email
    );

  if (resident) {

    await schedulerModel.createNotification(

      resident.user_id,

      'Maintenance Update',

      `The ${task.category} task at
       ${task.address}
       changed from ${oldStatus}
       to ${newStatus}.`,

      task.description,

      task.start_date,

      task.end_date || null
    );
  }
}

/**
 * Notify owner
 */
if (task.owner_email) {

  const owner =
    await userModel.getUserByEmail(
      task.owner_email
    );

  if (owner) {

    await schedulerModel.createNotification(

      owner.user_id,

      'Maintenance Update',

      `The ${task.category} task at
       ${task.address}
       changed from ${oldStatus}
       to ${newStatus}.`,

      task.description,

      task.start_date,

      task.end_date || null
    );
  }
}

  return schedulerModel.notifyStatusChange(
    task,
    oldStatus,
    newStatus
  );
};

/**
 * Get unread notifications
 */
/**
 * Get unread notifications
 */
const getNotifications = async (req, res) => {

  try {
    const userId = req.user.user_id;
    /**
 * Create 1 day reminders
 */
const upcomingDayTasks =
  await schedulerModel.getUpcomingTasksByOneDay();

for (const task of upcomingDayTasks) {

  if (
    task.resident_email === req.user.email
  ) {

    const message =
      `Reminder:
       maintenance task starts tomorrow
       at ${task.address}.`;

    const exists =
      await schedulerModel.notificationExists(
        userId,
        'Upcoming Maintenance Reminder',
        task.start_date
      );

    if (!exists) {

      await schedulerModel.createNotification(

        userId,

        'Upcoming Maintenance Reminder',

        message,

        task.description || null,

        task.start_date || null,

        task.end_date || null
      );
    }
  }
}

/**
 * Create 1 month reminders
 */
const upcomingMonthTasks =
  await schedulerModel.getUpcomingTasksByOneMonth();

for (const task of upcomingMonthTasks) {

  if (
    task.resident_email === req.user.email
  ) {

    const message =
      `Reminder:
       maintenance task scheduled
       in one month
       at ${task.address}.`;

    const exists =
      await schedulerModel.notificationExists(
        userId,
        'Future Maintenance Reminder',
        task.start_date
      );

    if (!exists) {

      await schedulerModel.createNotification(

        userId,

        'Future Maintenance Reminder',

        message,

        task.description || null,

        task.start_date || null,

        task.end_date || null
      );
    }
  } 
}

  const notifications = await schedulerModel.getUnreadNotifications(userId);
  res.json({ notifications});

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 */
const markNotificationAsRead =
  async (req, res) => {

    try {

      const {
        notificationId
      } = req.params;

      await schedulerModel
        .markAsRead(
          notificationId
        );

      res.json({
        message:
          'Notification marked as read'
      });

    } catch (error) {

      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
};

module.exports = {
  sendUpcomingMonthNotifications,
  sendUpcomingDayNotifications,
  notifyTaskAccepted,
  notifyTaskRejected,
  notifyTaskStatusChange,
  getNotifications,
  markNotificationAsRead
};