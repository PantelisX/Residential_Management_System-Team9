import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const assignmentApi = {
  getPendingAssignments: () => axios.get(`${API_URL}/assignments/pending`),
  getAcceptedAssignments: () => axios.get(`${API_URL}/assignments/accepted`),
  acceptAssignment: (taskId) => axios.post(`${API_URL}/assignments/accept`, { task_id: taskId }),
  declineAssignment: (taskId) => axios.post(`${API_URL}/assignments/decline`, { task_id: taskId }),
  updateTaskStatus: (taskId, newStatus) => axios.put(`${API_URL}/assignments/status`, { task_id: taskId, newStatus })
};

export default assignmentApi;
