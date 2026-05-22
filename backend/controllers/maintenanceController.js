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
    const { residence_id, category, description, start_date, tech_id } = req.body;
    
    const userId = req.user.user_id;
    
    if (!residence_id || !category || !description || !start_date || !tech_id) {
      return res.status(400).json({ 
        error: 'All fields (residence_id, category, description, start_date, tech_id) are required' 
      });
    }

    const hasAccess = await maintenanceModel.checkAccess(userId, residence_id);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Access denied: You do not have permission to create tasks for this residence.' 
      });
    }
    
    const result = await maintenanceModel.createTask({
      residence_id,
      category,
      description,
      start_date,
      tech_id
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
 * Get all maintenance tasks for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getTasks = async (req, res, next) => {

  try {

    const userId = req.user.user_id;

    const tasks = await maintenanceModel.getTasks(userId);

    res.json({
      tasks
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
  getTasks,
  getTechnicians
};