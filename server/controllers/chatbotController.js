import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Chat with Gemini
// @route   POST /api/chatbot/chat
// @access  Public
const chatWithGemini = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        console.error('ERROR: GEMINI_API_KEY is missing from environment variables.');
        res.status(500);
        throw new Error('Gemini API Key is not configured');
    } else {
        console.log('Gemini API Key is present.');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('Gemini API Detailed Error:', error);
        res.status(500);
        throw new Error('Failed to get response from Gemini: ' + error.message);
    }
});

export { chatWithGemini };
