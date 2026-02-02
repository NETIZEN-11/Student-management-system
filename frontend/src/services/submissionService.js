import api from './api';

const submissionService = {
  submitTask: async (submissionData) => {
    try {
      const response = await api.post('/submissions', submissionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSubmissionsByTask: async (taskId) => {
    try {
      const response = await api.get(`/submissions/task/${taskId}`);
      return response.data.submissions;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStudentSubmissions: async () => {
    try {
      const response = await api.get('/submissions/my-submissions');
      return response.data.submissions;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  gradeSubmission: async (submissionId, gradeData) => {
    try {
      const response = await api.put(`/submissions/${submissionId}/grade`, gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addFeedback: async (submissionId, feedbackData) => {
    try {
      const response = await api.put(`/submissions/${submissionId}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  checkPlagiarism: async (submissionId, taskId) => {
    try {
      const response = await api.post(`/submissions/${submissionId}/plagiarism/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default submissionService;
