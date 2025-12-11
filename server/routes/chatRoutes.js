import express from 'express';
import { getConversations, getMessages } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/conversations').get(protect, getConversations);
router.route('/:userId').get(protect, getMessages);

export default router;
