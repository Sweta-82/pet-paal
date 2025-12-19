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
    })
        .sort({ createdAt: -1 })
        .populate('pet', 'name images');

    const uniqueConversations = new Map();

    for (const message of messages) {
        const otherUserId =
            message.sender.toString() === req.user._id.toString()
                ? message.receiver.toString()
                : message.sender.toString();

        const petId = message.pet ? message.pet._id.toString() : 'general';
        const key = `${otherUserId}_${petId}`;

        if (!uniqueConversations.has(key)) {
            const otherUser = await User.findById(otherUserId).select('name email role');
            if (otherUser) {
                uniqueConversations.set(key, {
                    user: otherUser,
                    pet: message.pet,
                    lastMessage: message,
                });
            }
        }
    }

    res.json(Array.from(uniqueConversations.values()));
});

// @desc    Get messages with a specific user (and optionally specific pet)
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { petId } = req.query;
    const myId = req.user._id;

    const query = {
        $or: [
            { sender: myId, receiver: userId },
            { sender: userId, receiver: myId },
        ],
    };

    if (petId) {
        query.pet = petId;
    }

    const messages = await Message.find(query).sort({ createdAt: 1 });

    res.json(messages);
});

export {
    getConversations,
    getMessages,
};
