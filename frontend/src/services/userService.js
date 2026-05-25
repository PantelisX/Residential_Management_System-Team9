import api from './api';

const userService = {

  /**
   * Get all technicians
   * @returns {Promise} Array of technicians
   */
  getTechnicians: async () => {

    try {

      const response = await api.get(
        '/api/maintenance/technicians'
      );

      return response.data;

    } catch (error) {

      throw error.response?.data || error.message;
    }
  },

  /**
   * Get user profile data
   * @returns {Promise} User profile data
   */
  getProfile: async () => {

    try {

      const response = await api.get(
        '/api/auth/profile'
      );

      return response.data;

    } catch (error) {

      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData
   * @returns {Promise}
   */
  updateProfile: async (profileData) => {

    try {

      const response = await api.put(
        '/api/auth/profile',
        profileData
      );

      return response.data;

    } catch (error) {

      throw error.response?.data || error.message;
    }
  }
};

export default userService;