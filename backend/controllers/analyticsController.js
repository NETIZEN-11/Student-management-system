const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const logger = require('../utils/logger');

const analyticsController = {
  getStudentProgress: async (req, res) => {
    try {
      const studentId = req.user.userId;

      const totalTasks = await Task.countDocuments({ assignedTo: studentId });
      const submissions = await Submission.find({ studentId });
      const submittedTasks = submissions.length;
      const gradedSubmissions = submissions.filter((s) => s.status === 'graded');
      const averageScore =
        gradedSubmissions.length > 0
          ? gradedSubmissions.reduce((sum, s) => sum + s.score, 0) / gradedSubmissions.length
          : 0;

      const completionPercentage = totalTasks > 0 ? (submittedTasks / totalTasks) * 100 : 0;

      res.status(200).json({
        totalTasks,
        submittedTasks,
        gradedTasks: gradedSubmissions.length,
        averageScore: Math.round(averageScore * 100) / 100,
        completionPercentage: Math.round(completionPercentage * 100) / 100,
      });
    } catch (error) {
      logger.error('Get student progress error:', error);
      res.status(500).json({ message: 'Failed to fetch student progress' });
    }
  },

  getAdminStats: async (req, res) => {
    try {
      // Only admin can access
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can access this' });
      }

      const totalUsers = await User.countDocuments();
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalMentors = await User.countDocuments({ role: 'mentor' });
      const totalTasks = await Task.countDocuments();
      const totalSubmissions = await Submission.countDocuments();
      const averageSubmissionScore =
        (await Submission.aggregate([
          { $match: { score: { $ne: null } } },
          { $group: { _id: null, avg: { $avg: '$score' } } },
        ])) || [];

      const stats = {
        totalUsers,
        totalStudents,
        totalMentors,
        totalTasks,
        totalSubmissions,
        averageSubmissionScore:
          averageSubmissionScore.length > 0
            ? Math.round(averageSubmissionScore[0].avg * 100) / 100
            : 0,
      };

      res.status(200).json(stats);
    } catch (error) {
      logger.error('Get admin stats error:', error);
      res.status(500).json({ message: 'Failed to fetch admin stats' });
    }
  },

  getTaskAnalytics: async (req, res) => {
    try {
      const { taskId } = req.params;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const submissions = await Submission.find({ taskId });
      const totalAssigned = task.assignedTo.length;
      const totalSubmitted = submissions.length;
      const totalGraded = submissions.filter((s) => s.status === 'graded').length;
      const averageScore =
        totalGraded > 0
          ? submissions
              .filter((s) => s.status === 'graded')
              .reduce((sum, s) => sum + s.score, 0) / totalGraded
          : 0;

      const submissionRate = totalAssigned > 0 ? (totalSubmitted / totalAssigned) * 100 : 0;

      res.status(200).json({
        taskId,
        taskTitle: task.title,
        totalAssigned,
        totalSubmitted,
        totalGraded,
        averageScore: Math.round(averageScore * 100) / 100,
        submissionRate: Math.round(submissionRate * 100) / 100,
      });
    } catch (error) {
      logger.error('Get task analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch task analytics' });
    }
  },

  getWeakStudents: async (req, res) => {
    try {
      // Only mentor and admin can access
      if (!['mentor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only mentors and admins can access this' });
      }

      const submissions = await Submission.find({ status: 'graded' })
        .populate('studentId', 'name email')
        .sort({ score: 1 })
        .limit(10);

      const weakStudents = submissions
        .filter((s) => s.score < 50)
        .map((s) => ({
          studentId: s.studentId._id,
          studentName: s.studentId.name,
          studentEmail: s.studentId.email,
          score: s.score,
          taskId: s.taskId,
        }));

      res.status(200).json({ weakStudents });
    } catch (error) {
      logger.error('Get weak students error:', error);
      res.status(500).json({ message: 'Failed to fetch weak students' });
    }
  },
};

module.exports = analyticsController;
