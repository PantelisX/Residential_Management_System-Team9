const connection = require("../config/db");
const util = require("util");

// Promisify the query method for async/await usage
const query = util.promisify(connection.query).bind(connection);

/**
 * Creates a history record for a completed or cancelled maintenance task
 * Fetches task and residence data from the database
 * @param {number} taskId - The maintenance task ID
 * @param {string} completionDate - Optional completion date (defaults to today)
 * @returns {Promise} { success: true, historyId: number }
 */
exports.createHistoryRecord = async (taskId, completionDate = null) => {
  try {
    // Use current date if not provided
    if (!completionDate) {
      const today = new Date().toISOString().split("T")[0];
      completionDate = today;
    }

    // Step 1: Fetch the MaintenanceTask to validate it exists and get required data
    const taskSql = `SELECT * FROM MaintenanceTask WHERE task_id = ?`;
    const taskResult = await query(taskSql, [taskId]);

    if (!taskResult || taskResult.length === 0) {
      throw new Error(`Task not found with ID: ${taskId}`);
    }

    const task = taskResult[0];

    // Step 2: Validate task status is 'completed' or 'cancelled'
    if (task.status !== "completed" && task.status !== "cancelled") {
      throw new Error(
        `Cannot archive task with status '${task.status}'. Only 'completed' or 'cancelled' tasks can be archived.`
      );
    }

    // Step 3: Fetch the Residence to get the address
    const residenceSql = `SELECT address FROM Residence WHERE residence_id = ?`;
    const residenceResult = await query(residenceSql, [task.residence_id]);

    if (!residenceResult || residenceResult.length === 0) {
      throw new Error(
        `Residence not found with ID: ${task.residence_id}`
      );
    }

    const address = residenceResult[0].address;

    // Step 4: Insert the history record into TaskHistory table
    const insertSql = `
      INSERT INTO TaskHistory (task_id, address, category, description, completion_date)
      VALUES (?, ?, ?, ?, ?)
    `;

    const insertResult = await query(insertSql, [
      taskId,
      address,
      task.category,
      task.description,
      completionDate,
    ]);

    return {
      success: true,
      historyId: insertResult.insertId,
      message: `Task ${taskId} archived successfully`,
    };
  } catch (error) {
    console.error("Error creating history record:", error.message);
    throw error;
  }
};

/**
 * Retrieves history records for a specific task
 * @param {number} taskId - The maintenance task ID
 * @returns {Promise} Array of history records
 */
exports.getHistoryByTaskId = async (taskId) => {
  try {
    const sql = `SELECT * FROM TaskHistory WHERE task_id = ?`;
    const result = await query(sql, [taskId]);
    return result || [];
  } catch (error) {
    console.error("Error fetching history by task ID:", error.message);
    throw error;
  }
};

/**
 * Retrieves all history records from the database
 * @returns {Promise} Array of all history records
 */
exports.getAllHistory = async () => {
  try {
    const sql = `SELECT * FROM TaskHistory ORDER BY completion_date DESC`;
    const result = await query(sql);
    return result || [];
  } catch (error) {
    console.error("Error fetching all history records:", error.message);
    throw error;
  }
};

/**
 * Retrieves history records filtered by maintenance category
 * @param {string} category - Category enum (electrical, plumbing, hvac, landscaping, other)
 * @returns {Promise} Array of history records matching the category
 */
exports.getHistoryByCategory = async (category) => {
  try {
    const validCategories = [
      "electrical",
      "plumbing",
      "hvac",
      "landscaping",
      "other",
    ];

    if (!validCategories.includes(category)) {
      throw new Error(
        `Invalid category '${category}'. Must be one of: ${validCategories.join(
          ", "
        )}`
      );
    }

    const sql = `SELECT * FROM TaskHistory WHERE category = ? ORDER BY completion_date DESC`;
    const result = await query(sql, [category]);
    return result || [];
  } catch (error) {
    console.error("Error fetching history by category:", error.message);
    throw error;
  }
};

/**
 * Retrieves history records for a specific residence
 * @param {string} address - The residence address
 * @returns {Promise} Array of history records for that address
 */
exports.getHistoryByAddress = async (address) => {
  try {
    const sql = `SELECT * FROM TaskHistory WHERE address = ? ORDER BY completion_date DESC`;
    const result = await query(sql, [address]);
    return result || [];
  } catch (error) {
    console.error("Error fetching history by address:", error.message);
    throw error;
  }
};

/**
 * Deletes a history record
 * @param {number} historyId - The history record ID
 * @returns {Promise} { success: true, affectedRows: number }
 */
exports.deleteHistoryRecord = async (historyId) => {
  try {
    const sql = `DELETE FROM TaskHistory WHERE history_id = ?`;
    const result = await query(sql, [historyId]);

    if (result.affectedRows === 0) {
      throw new Error(`History record not found with ID: ${historyId}`);
    }

    return {
      success: true,
      affectedRows: result.affectedRows,
      message: `History record ${historyId} deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting history record:", error.message);
    throw error;
  }
};

/**
 * Helper function: Archives a task if its status is 'completed' or 'cancelled'
 * Automatically uses current date as completion date
 * @param {number} taskId - The maintenance task ID
 * @returns {Promise} { success: true, historyId, archived: true } or { archived: false, reason: string }
 */
exports.archiveTaskIfTerminal = async (taskId) => {
  try {
    // Check current task status
    const taskSql = `SELECT status FROM MaintenanceTask WHERE task_id = ?`;
    const taskResult = await query(taskSql, [taskId]);

    if (!taskResult || taskResult.length === 0) {
      return {
        archived: false,
        reason: `Task not found with ID: ${taskId}`,
      };
    }

    const status = taskResult[0].status;

    // If status is 'completed' or 'cancelled', archive it
    if (status === "completed" || status === "cancelled") {
      const result = await exports.createHistoryRecord(taskId);
      return {
        success: true,
        historyId: result.historyId,
        archived: true,
        status: status,
      };
    }

    return {
      archived: false,
      reason: `Task status is '${status}', not terminal. Only 'completed' or 'cancelled' tasks can be archived.`,
    };
  } catch (error) {
    console.error("Error in archiveTaskIfTerminal:", error.message);
    throw error;
  }
};

/**
 * Gets statistics about archived tasks
 * @returns {Promise} { totalArchived: number, byCategory: object, byStatus: object }
 */
exports.getHistoryStatistics = async () => {
  try {
    // Total count
    const totalSql = `SELECT COUNT(*) as total FROM TaskHistory`;
    const totalResult = await query(totalSql);
    const totalArchived = totalResult[0].total;

    // By category
    const categorySql = `
      SELECT category, COUNT(*) as count
      FROM TaskHistory
      GROUP BY category
    `;
    const categoryResult = await query(categorySql);
    const byCategory = {};
    categoryResult.forEach((row) => {
      byCategory[row.category] = row.count;
    });

    return {
      totalArchived,
      byCategory,
      lastArchived: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching history statistics:", error.message);
    throw error;
  }
};
