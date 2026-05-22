import api from './api';

const userService = {
  getTechnicians: async () => {
    try {
      const response = await api.get('/api/users/technicians');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService;