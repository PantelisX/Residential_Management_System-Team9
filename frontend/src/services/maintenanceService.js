import api from './api';

const maintenanceService = {
  /**
   * Get all maintenance tasks
   * @returns {Promise} List of maintenance tasks
   */
  getTasks: async () => {
    try {
      const response = await api.get('/api/maintenance/tasks');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific maintenance task by ID
   * @param {number} taskId - Task ID
   * @returns {Promise} Task details
   */
  getTaskById: async (taskId) => {
    try {
      const response = await api.get(`/api/maintenance/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new maintenance task
   * @param {Object} taskData - Task data
   * @returns {Promise} Created task response
   */
  createTask: async (taskData) => {
    try {
      const response = await api.post('/api/maintenance/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a maintenance task
   * @param {number} taskId - Task ID
   * @param {Object} updates - Task updates
   * @returns {Promise} Updated task response
   */
  updateTask: async (taskId, updates) => {
    try {
      const response = await api.put(`/api/maintenance/tasks/${taskId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a maintenance task
   * @param {number} taskId - Task ID
   * @returns {Promise} Deletion response
   */
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/api/maintenance/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get history tasks (completed and cancelled tasks)
   * @returns {Promise<{success: boolean, tasks: Array, totalCount: number}>} History tasks data
   */
  getHistoryTasks: async () => {
    try {
      const response = await api.get('/api/tasks/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default maintenanceService;
