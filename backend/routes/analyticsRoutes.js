const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Order matters - specific routes before generic ones
router.get('/student-progress', authMiddleware, analyticsController.getStudentProgress);
router.get('/admin-stats', authMiddleware, roleMiddleware(['admin']), analyticsController.getAdminStats);
router.get('/weak-students', authMiddleware, roleMiddleware(['mentor', 'admin']), analyticsController.getWeakStudents);
router.get('/task/:taskId', authMiddleware, analyticsController.getTaskAnalytics);

module.exports = router;
