const Submission = require('../models/Submission');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const aiService = require('../services/aiService');
const plagiarismService = require('../services/plagiarismService');
const leaderboardService = require('../services/leaderboardService');
const logger = require('../utils/logger');

const submissionController = {
  submitTask: async (req, res) => {
    try {
      const { taskId, submissionText, submissionLink } = req.body;
      const studentId = req.user.userId;

      // Check if task exists
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check if student is assigned to task
      if (!task.assignedTo.includes(studentId)) {
        return res.status(403).json({ message: 'You are not assigned to this task' });
      }

      // Check if submission already exists
      const existingSubmission = await Submission.findOne({ taskId, studentId });
      if (existingSubmission) {
        return res.status(400).json({ message: 'You have already submitted this task' });
      }

      // Check if late
      const isLate = new Date() > new Date(task.dueDate);

      const submission = new Submission({
        taskId,
        studentId,
        submissionText,
        submissionLink,
        isLate,
        status: 'submitted',
      });

      await submission.save();
      await submission.populate('studentId', 'name email');

      // Update task status
      await Task.findByIdAndUpdate(taskId, { status: 'submitted' });

      logger.info(`Submission created: ${submission._id}`);
      res.status(201).json({ message: 'Task submitted successfully', submission });
    } catch (error) {
      logger.error('Submit task error:', error);
      res.status(500).json({ message: 'Failed to submit task' });
    }
  },

  getSubmissionsByTask: async (req, res) => {
    try {
      const taskId = req.params.taskId;

      const submissions = await Submission.find({ taskId })
        .populate('studentId', 'name email')
        .populate('reviewedBy', 'name email')
        .sort({ submittedAt: -1 });

      res.status(200).json({ submissions });
    } catch (error) {
      logger.error('Get submissions error:', error);
      res.status(500).json({ message: 'Failed to fetch submissions' });
    }
  },

  getStudentSubmissions: async (req, res) => {
    try {
      const studentId = req.user.userId;

      const submissions = await Submission.find({ studentId })
        .populate('taskId', 'title description dueDate')
        .populate('reviewedBy', 'name email')
        .sort({ submittedAt: -1 });

      res.status(200).json({ submissions });
    } catch (error) {
      logger.error('Get student submissions error:', error);
      res.status(500).json({ message: 'Failed to fetch submissions' });
    }
  },

  gradeSubmission: async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { score, feedback } = req.body;

      // Only mentor and admin can grade
      if (!['mentor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only mentors and admins can grade submissions' });
      }

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      // Generate AI feedback
      const aiGeneratedFeedback = aiService.generateFeedback(submission.submissionText, score);

      submission.score = score;
      submission.feedback = feedback;
      submission.aiGeneratedFeedback = aiGeneratedFeedback;
      submission.status = 'graded';
      submission.reviewedBy = req.user.userId;
      submission.reviewedAt = new Date();

      await submission.save();

      // Update student points
      await leaderboardService.updateStudentPoints(submission.studentId, score);

      // Create notification
      await Notification.create({
        userId: submission.studentId,
        type: 'grade_updated',
        title: 'Your Submission Has Been Graded',
        message: `Your submission has been graded with a score of ${score}`,
        relatedId: submissionId,
        relatedModel: 'Submission',
      });

      logger.info(`Submission graded: ${submissionId}`);
      res.status(200).json({ message: 'Submission graded successfully', submission });
    } catch (error) {
      logger.error('Grade submission error:', error);
      res.status(500).json({ message: 'Failed to grade submission' });
    }
  },

  addFeedback: async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { feedback } = req.body;

      // Only mentor and admin can add feedback
      if (!['mentor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only mentors and admins can add feedback' });
      }

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      submission.feedback = feedback;
      submission.status = 'reviewed';
      submission.reviewedBy = req.user.userId;
      submission.reviewedAt = new Date();

      await submission.save();

      // Create notification
      await Notification.create({
        userId: submission.studentId,
        type: 'feedback_added',
        title: 'Feedback on Your Submission',
        message: 'Your submission has received feedback',
        relatedId: submissionId,
        relatedModel: 'Submission',
      });

      logger.info(`Feedback added to submission: ${submissionId}`);
      res.status(200).json({ message: 'Feedback added successfully', submission });
    } catch (error) {
      logger.error('Add feedback error:', error);
      res.status(500).json({ message: 'Failed to add feedback' });
    }
  },

  checkPlagiarism: async (req, res) => {
    try {
      const { submissionId, taskId } = req.params;

      // Only mentor and admin can check plagiarism
      if (!['mentor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only mentors and admins can check plagiarism' });
      }

      const result = await plagiarismService.checkPlagiarism(submissionId, taskId);

      res.status(200).json({ result });
    } catch (error) {
      logger.error('Plagiarism check error:', error);
      res.status(500).json({ message: 'Failed to check plagiarism' });
    }
  },
};

module.exports = submissionController;
