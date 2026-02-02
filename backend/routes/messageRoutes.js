const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Order matters - specific routes before generic ones
router.get('/inbox', authMiddleware, messageController.getInbox);
router.post('/', authMiddleware, messageController.sendMessage);
router.get('/conversation/:userId', authMiddleware, messageController.getConversation);
router.put('/:messageId/read', authMiddleware, messageController.markAsRead);
router.delete('/:messageId', authMiddleware, messageController.deleteMessage);

module.exports = router;
