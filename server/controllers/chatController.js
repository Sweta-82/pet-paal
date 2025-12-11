import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get conversations list
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    // Find all messages where the current user is sender or receiver
    const messages = await Message.find({
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    }).sort({ createdAt: -1 });

    const uniqueUserIds = new Set();
    const conversations = [];

    for (const message of messages) {
        const otherUserId =
            message.sender.toString() === req.user._id.toString()
                ? message.receiver.toString()
                : message.sender.toString();

        if (!uniqueUserIds.has(otherUserId)) {
            uniqueUserIds.add(otherUserId);
            const otherUser = await User.findById(otherUserId).select('name email role'); // Add avatar if available
            conversations.push({
                user: otherUser,
                lastMessage: message,
            });
        }
    }

    res.json(conversations);
});

// @desc    Get messages with a specific user
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { sender: myId, receiver: userId },
            { sender: userId, receiver: myId },
        ],
    }).sort({ createdAt: 1 });

    res.json(messages);
});

export {
    getConversations,
    getMessages,
};
