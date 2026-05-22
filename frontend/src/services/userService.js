import api from './api';

const userService = {
  getTechnicians: async () => {
    try {
      // ΔΙΟΡΘΩΜΕΝΟ URL
      const response = await api.get('/api/maintenance/technicians');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService;