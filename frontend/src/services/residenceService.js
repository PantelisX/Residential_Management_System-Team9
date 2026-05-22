import api from './api';

const residenceService = {

  /**
   * Get all residences for the logged-in user
   */
  getUserResidences: async () => {
    try {
      const response = await api.get('/api/residences');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new residence
   */
  createResidence: async (data) => {
    try {
      const response = await api.post('/api/residences', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

};

export default residenceService;