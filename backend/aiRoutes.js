const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
require('dotenv').config();

// Debugging: This will show in your terminal if the key is missing
if (!process.env.GROQ_API_KEY) {
    console.error("CRITICAL ERROR: GROQ_API_KEY is missing from .env file");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message required" });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are the AI Assistant for P. R. Pote Patil College of Engineering & Management, Amravati. 
                    - Goal: Help students with placements and training.
                    - Placement rate: 92%, Highest Package: 50 LPA.
                    - Top Recruiters: Google, Microsoft, Amazon, TCS, Infosys, Wipro, Zensar.
                    - T&P Head: Dr. A. Sharma.`
                },
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const response = chatCompletion.choices[0]?.message?.content || "I am currently unavailable.";
        res.json({ response });
    } catch (error) {
        console.error("Groq API Error:", error.message);
        // Send the specific error message to help you debug
        res.status(500).json({ error: "AI Service Error", details: error.message });
    }
});

module.exports = router;