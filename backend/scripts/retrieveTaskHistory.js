/**
 * backend/scripts/retrieveTaskHistory.js
 * Script to retrieve task history data (completed and cancelled tasks) with residence information
 * Usage: node retrieveTaskHistory.js [userId] [residenceId]
 */

const db = require('../config/db');

/**
 * Retrieve task history with filters
 * @param {number} userId - Optional user ID to filter by
 * @param {number} residenceId - Optional residence ID to filter by
 */
const getTaskHistory = async (userId, residenceId) => {
  try {
    let query = `
      SELECT 
        mt.task_id,
        mt.residence_id,
        r.address,
        r.owner,
        mt.category,
        mt.description,
        mt.status,
        mt.start_date,
        mt.end_date,
        DATEDIFF(mt.end_date, mt.start_date) as duration_days,
        u.name as owner_name,
        u.email as owner_email
      FROM MaintenanceTask mt
      JOIN Residence r ON mt.residence_id = r.residence_id
      LEFT JOIN users u ON r.owner = u.name
      WHERE mt.status IN ('completed', 'cancelled')
    `;

    let params = [];

    if (userId) {
      query += `
        AND r.residence_id IN (
          SELECT residence_id FROM UserResidence WHERE user_id = ?
        )
      `;
      params.push(userId);
    }

    if (residenceId) {
      query += ' AND mt.residence_id = ?';
      params.push(residenceId);
    }

    query += ' ORDER BY mt.end_date DESC';

    const [rows] = await db.promise().query(query, params);
    return rows;
  } catch (error) {
    console.error('Error retrieving task history:', error);
    throw error;
  }
};

/**
 * Main execution
 */
const main = async () => {
  try {
    const userId = process.argv[2] ? parseInt(process.argv[2]) : null;
    const residenceId = process.argv[3] ? parseInt(process.argv[3]) : null;
    
    const data = await getTaskHistory(userId, residenceId);

    if (data.length === 0) {
      console.log('No task history found.');
      process.exit(0);
    }

    console.log('\n=== Task History ===\n');
    console.table(data);

    // Print summary statistics
    const completed = data.filter(t => t.status === 'completed').length;
    const cancelled = data.filter(t => t.status === 'cancelled').length;
    
    console.log('\n=== Summary ===');
    console.log(`Total Tasks: ${data.length}`);
    console.log(`Completed: ${completed}`);
    console.log(`Cancelled: ${cancelled}`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('Script error:', error.message);
    process.exit(1);
  }
};

main();
