import api from './api';

const tasksService = {
  /**
   * Fetches the current maintenance tasks based on time and category filters.
   * @param {Object} filters - The filters to apply to the query.
   * @param {string} [filters.startDate] - The starting date for tasks in 'YYYY-MM-DD' format (optional).
   * @param {string} [filters.category] - The task category enum to filter by (optional).
   * @returns {Promise<{success: boolean, tasks: Array, totalCount: number}>} An object containing the filtered tasks and their total count.
   */
  getCurrentTasks: async (filters) => {
    try {
      const response = await api.get('/api/tasks/current', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default tasksService;