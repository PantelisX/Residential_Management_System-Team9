const db = require('../config/db');

const checkAccess = async (userId, residenceId) => {
  const sql = `SELECT * FROM UserResidence WHERE user_id = ? AND residence_id = ?`;
  const [rows] = await db.promise().execute(sql, [userId, residenceId]);
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
    const [result] = await db.promise().execute(sql, params);
    return result;
  } catch (error) {
    throw new Error('Failed to create maintenance task: ' + error.message);
  }
};

module.exports = {
  checkAccess,
  createTask
};