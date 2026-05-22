import api from './api';

const assignmentApi = {

  getPendingAssignments: () => api.get('/api/assignments/pending'),

  getAcceptedAssignments: () => api.get('/api/assignments/accepted'),

  acceptAssignment: (taskId) => api.post('/api/assignments/accept', {task_id: taskId}),

  declineAssignment: (taskId) =>api.post('/api/assignments/decline', {task_id: taskId}),

  updateTaskStatus: (taskId, newStatus) => api.put('/api/assignments/status', {task_id: taskId,newStatus})};

export default assignmentApi;