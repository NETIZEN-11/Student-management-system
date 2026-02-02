const express = require('express');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Order matters - specific routes before generic ones
router.post('/', authMiddleware, groupController.createGroup);
router.get('/', authMiddleware, groupController.getAllGroups);
router.post('/add-member', authMiddleware, groupController.addMember);
router.post('/remove-member', authMiddleware, groupController.removeMember);
router.get('/:id', authMiddleware, groupController.getGroupById);
router.delete('/:id', authMiddleware, groupController.deleteGroup);

module.exports = router;
