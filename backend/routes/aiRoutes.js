const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
require('dotenv').config();

// Check for API Key
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error("CRITICAL ERROR: GROQ_API_KEY is missing in .env file.");
}

const groq = new Groq({ apiKey: apiKey || "missing_key" }); // Prevent crash on init, but calls will fail

// --- 1. CHAT COMPLETION (Generic) ---
router.post('/chat', async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "Server Configuration Error: API Key missing." });
        }

        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const chatCompletion = await getGroqChatCompletion(message);
        const response = chatCompletion.choices[0]?.message?.content || "I am currently unavailable.";

        res.json({ response });
    } catch (error) {
        console.error("Groq API Error Details:", JSON.stringify(error, null, 2));
        console.error("Groq API Error Message:", error.message);
        res.status(500).json({ error: "AI Service Error", details: error.message });
    }
});

// --- 2. MOCK INTERVIEW START ---
router.post('/mock-interview/start', async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "Server Configuration Error: API Key missing." });
        }

        const { topic } = req.body;
        const prompt = `You are a professional HR interviewer. Start a mock interview for the topic: ${topic}. Ask the first question. Keep it professional yet encouraging.`;

        const chatCompletion = await getGroqChatCompletion(prompt);
        const response = chatCompletion.choices[0]?.message?.content || "Let's start the interview.";

        res.json({ response });
    } catch (error) {
        console.error("Groq API Interview Error:", error);
        res.status(500).json({ error: "AI Service Error", details: error.message });
    }
});

async function getGroqChatCompletion(userContent) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful and professional Training & Placement AI Assistant. Your goal is to help students prepare for interviews, improve their resumes, and provide information about placement drives."
            },
            {
                role: "user",
                content: userContent,
            },
        ],
        model: "llama-3.3-70b-versatile", // Using Llama 3.3 (Current Standard)
    });
}

module.exports = router;
