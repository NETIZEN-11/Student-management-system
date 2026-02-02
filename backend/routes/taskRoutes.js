const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Order matters - specific routes before generic ones
router.get('/my-tasks', authMiddleware, taskController.getStudentTasks);
router.post('/', authMiddleware, roleMiddleware(['mentor', 'admin']), taskController.createTask);
router.get('/', authMiddleware, taskController.getAllTasks);
router.get('/:id', authMiddleware, taskController.getTaskById);
router.put('/:id', authMiddleware, roleMiddleware(['mentor', 'admin']), taskController.updateTask);
router.delete('/:id', authMiddleware, roleMiddleware(['mentor', 'admin']), taskController.deleteTask);

module.exports = router;
