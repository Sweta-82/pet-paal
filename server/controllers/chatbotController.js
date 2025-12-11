import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Chat with Gemini
// @route   POST /api/chatbot/chat
// @access  Public
const chatWithGemini = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        res.status(500);
        throw new Error('Gemini API Key is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500);
        throw new Error('Failed to get response from Gemini');
    }
});

export { chatWithGemini };
