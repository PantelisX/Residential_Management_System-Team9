// backend/controllers/maintenanceController.js
const maintenanceModel = require('../models/maintenanceModel');
const userModel = require('../models/userModel');

/**
 * Create a new maintenance task
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const createTask = async (req, res, next) => {
  try {
    const { residence_id, category, description, start_date } = req.body;
    
    if (!residence_id || !category || !description || !start_date) {
      return res.status(400).json({ 
        error: 'All fields (residence_id, category, description, start_date) are required' 
      });
    }

    const result = await maintenanceModel.createTask({
      residence_id,
      category,
      description,
      start_date
    });

    res.status(201).json({ 
      message: 'Task created successfully',
      taskId: result.insertId 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all technicians
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getTechnicians = async (req, res, next) => {
  try {
    const technicians = await userModel.getTechnicians();
    res.json(technicians);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTechnicians
};

module.exports = {
  createTask
};