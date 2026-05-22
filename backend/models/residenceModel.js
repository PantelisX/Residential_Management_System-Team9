// backend/models/residenceModel.js
const db = require('../config/db');

/**
 * Get all residences for a specific user with active task count
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of residences with task counts
 */
async function getUserResidences(userId) {
  const sql = `
    SELECT 
      r.residence_id,
      r.address,
      r.description,
      r.owner,
      ur.user_role,
      COALESCE(COUNT(CASE WHEN mt.status != 'completed' THEN 1 END), 0) as active_task_count
    FROM UserResidence ur
    JOIN Residence r ON ur.residence_id = r.residence_id
    LEFT JOIN MaintenanceTask mt ON r.residence_id = mt.residence_id
    WHERE ur.user_id = ?
    GROUP BY r.residence_id, r.address, r.description, r.owner, ur.user_role
    ORDER BY r.address ASC
  `;
  
  const [rows] = await db.query(sql, [userId]);
  return rows;
}

async function createResidence(userId, address, description) {

  const [result] = await db.execute(
    `
    INSERT INTO Residence (address, description)
    VALUES (?, ?)
    `,
    [address, description]
  );

  const residenceId = result.insertId;

  await db.execute(
    `
    INSERT INTO UserResidence (user_id, residence_id, user_role)
    VALUES (?, ?, ?)
    `,
    [userId, residenceId, 'owner']
  );

  return residenceId;
}

module.exports = {
  getUserResidences,
  createResidence
};
