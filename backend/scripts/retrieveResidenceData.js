/**
 * backend/scripts/retrieveResidenceData.js
 * Script to retrieve residence data with associated user information
 * Usage: node retrieveResidenceData.js [residenceId]
 */

const db = require('../config/db');

/**
 * Retrieve residence data with all associated users
 * @param {number} residenceId - Optional residence ID to filter by
 */
const getResidenceData = async (residenceId) => {
  try {
    let query = `
      SELECT 
        r.residence_id,
        r.address,
        r.owner,
        r.description,
        COUNT(DISTINCT ur.user_id) as total_users,
        GROUP_CONCAT(DISTINCT CONCAT(u.name, ' (', ur.user_role, ')') SEPARATOR ', ') as users,
        COUNT(DISTINCT CASE WHEN mt.status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(DISTINCT CASE WHEN mt.status = 'cancelled' THEN 1 END) as cancelled_tasks,
        COUNT(DISTINCT CASE WHEN mt.status IN ('open', 'in_progress') THEN 1 END) as active_tasks
      FROM Residence r
      LEFT JOIN UserResidence ur ON r.residence_id = ur.residence_id
      LEFT JOIN users u ON ur.user_id = u.user_id
      LEFT JOIN MaintenanceTask mt ON r.residence_id = mt.residence_id
    `;

    let params = [];

    if (residenceId) {
      query += ' WHERE r.residence_id = ?';
      params.push(residenceId);
    }

    query += ' GROUP BY r.residence_id, r.address, r.owner, r.description';

    const [rows] = await db.promise().query(query, params);
    return rows;
  } catch (error) {
    console.error('Error retrieving residence data:', error);
    throw error;
  }
};

/**
 * Main execution
 */
const main = async () => {
  try {
    const residenceId = process.argv[2] ? parseInt(process.argv[2]) : null;
    const data = await getResidenceData(residenceId);

    if (data.length === 0) {
      console.log('No residence data found.');
      process.exit(0);
    }

    console.log('\n=== Residence Data ===\n');
    console.table(data);

    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('Script error:', error.message);
    process.exit(1);
  }
};

main();
