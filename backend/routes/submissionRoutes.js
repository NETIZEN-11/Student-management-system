const express = require('express');
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Order matters - specific routes before generic ones
router.get('/my-submissions', authMiddleware, submissionController.getStudentSubmissions);
router.post('/', authMiddleware, submissionController.submitTask);
router.get('/task/:taskId', authMiddleware, submissionController.getSubmissionsByTask);
router.put('/:submissionId/grade', authMiddleware, roleMiddleware(['mentor', 'admin']), submissionController.gradeSubmission);
router.put('/:submissionId/feedback', authMiddleware, roleMiddleware(['mentor', 'admin']), submissionController.addFeedback);
router.post('/:submissionId/plagiarism/:taskId', authMiddleware, roleMiddleware(['mentor', 'admin']), submissionController.checkPlagiarism);

module.exports = router;
