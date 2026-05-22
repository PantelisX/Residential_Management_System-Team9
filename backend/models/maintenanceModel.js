const db = require('../config/db');

const checkAccess = async (userId, residenceId) => {
  const sql = `SELECT * FROM UserResidence WHERE user_id = ? AND residence_id = ?`;
  const [rows] = await db.execute(sql, [userId, residenceId]);
  return rows.length > 0;
};

/**
 * Create a new maintenance task
 * @param {Object} taskData - Task data including residence_id, category, description, start_date
 * @returns {Promise} Inserted task details
 */
const createTask = async (taskData) => {
  const sql = `
    INSERT INTO MaintenanceTask (
      residence_id, 
      category, 
      description, 
      start_date,
      status,
      accepted,
      tech_id
    ) VALUES (?, ?, ?, ?, 'open', FALSE, ?)
  `;
  
  const params = [
    taskData.residence_id,
    taskData.category,
    taskData.description,
    taskData.start_date,
    taskData.tech_id
  ];
  
  try {
    const [result] = await db.execute(sql, params);
    return result;
  } catch (error) {
    throw new Error('Failed to create maintenance task: ' + error.message);
  }
};

/**
 * Get all maintenance tasks for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of maintenance tasks
 */
const getTasks = async (userId) => {

  const sql = `
    SELECT
      mt.task_id,
      mt.category,
      mt.description,
      mt.status,
      mt.start_date,
      mt.end_date,
      r.address
    FROM MaintenanceTask mt
    JOIN Residence r
      ON mt.residence_id = r.residence_id
    JOIN UserResidence ur
      ON r.residence_id = ur.residence_id
    WHERE ur.user_id = ?
    AND mt.status IN ('open', 'in_progress')
    ORDER BY mt.task_id DESC
  `;

  const [rows] = await db.execute(sql, [userId]);

  return rows;
};
module.exports = {
  checkAccess,
  createTask,
  getTasks
};