import api from './api';

const taskService = {
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAllTasks: async (filters = {}) => {
    try {
      const response = await api.get('/tasks', { params: filters });
      return response.data.tasks;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTaskById: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data.task;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStudentTasks: async () => {
    try {
      const response = await api.get('/tasks/my-tasks');
      return response.data.tasks;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default taskService;
