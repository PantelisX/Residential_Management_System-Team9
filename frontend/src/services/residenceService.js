import api from './api';

const residenceService = {
  /**
   * Get all residences for the logged-in user
   * @returns {Promise} Response with residences array
   */
  getUserResidences: async () => {
    try {
      const response = await api.get('/api/residences');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default residenceService;
