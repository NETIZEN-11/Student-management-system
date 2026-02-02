const Submission = require('../models/Submission');
const aiService = require('./aiService');

const plagiarismService = {
  checkPlagiarism: async (submissionId, taskId) => {
    try {
      const currentSubmission = await Submission.findById(submissionId);
      const otherSubmissions = await Submission.find({
        taskId,
        _id: { $ne: submissionId },
        submissionText: { $exists: true, $ne: '' },
      });

      let maxPlagiarismScore = 0;

      for (const otherSub of otherSubmissions) {
        const score = aiService.calculatePlagiarismScore(
          currentSubmission.submissionText,
          otherSub.submissionText
        );
        maxPlagiarismScore = Math.max(maxPlagiarismScore, score);
      }

      // Update submission with plagiarism score
      currentSubmission.plagiarismScore = Math.round(maxPlagiarismScore);
      await currentSubmission.save();

      return {
        submissionId,
        plagiarismScore: Math.round(maxPlagiarismScore),
        flagged: maxPlagiarismScore > 30,
      };
    } catch (error) {
      console.error('Plagiarism check error:', error);
      return null;
    }
  },

  checkAllSubmissions: async (taskId) => {
    try {
      const submissions = await Submission.find({ taskId });
      const results = [];

      for (const submission of submissions) {
        const result = await plagiarismService.checkPlagiarism(submission._id, taskId);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Bulk plagiarism check error:', error);
      return [];
    }
  },
};

module.exports = plagiarismService;
