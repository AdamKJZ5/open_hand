import express from 'express';
import {
  getMessages,
  getUnreadCount,
  getMessageById,
  sendMessage,
  markAsRead,
  deleteMessage
} from '../controller/messageController';
import { protect } from '../middleware/authMiddleware';
import { messageLimiter } from '../config/security';
import { sendMessageValidation, mongoIdValidation } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.get('/', protect, getMessages);
router.get('/unread-count', protect, getUnreadCount);
router.get('/:id', protect, mongoIdValidation, getMessageById);
router.post('/', protect, messageLimiter, sendMessageValidation, sendMessage);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

export default router;
