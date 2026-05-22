// backend/controllers/tasksController.js
const db = require('../config/db'); // Assuming db connection is set up here

/**
 * Fetches current tasks for logged-in user
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 */
exports.getCurrentTasks = async (req, res) => {
  try {
    const { startDate, category } = req.query;
    const userId = req.user.user_id;

    // Query to fetch tasks for user's residences with status 'open' or 'in_progress', filtered by date and category
    let query = `
      SELECT mt.*, r.address
      FROM MaintenanceTask mt
      JOIN UserResidence ur ON mt.residence_id = ur.residence_id
      JOIN Residence r ON mt.residence_id = r.residence_id
      WHERE ur.user_id = ?
      AND mt.status IN ('open', 'in_progress')
    `;

    let queryParams = [userId];

    if (startDate) {
      query += ' AND mt.start_date >= ?';
      queryParams.push(startDate);
    }

    if (category) {
      query += ' AND mt.category = ?';
      queryParams.push(category);
    }

    const [rows] = await db.query(query, queryParams);
    
    // Get total count for filtered tasks
    const [totalCountResult] = await db.query(
      `SELECT COUNT(*) AS total FROM (
        ${query}
      ) as filtered_tasks`,
      queryParams
    );

    const totalCount = totalCountResult[0].total;

    res.json({
      tasks: rows,
      totalCount,
      success: true
    });
  } catch (error) {
    console.error('Error fetching current tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
};