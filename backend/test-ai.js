const Groq = require("groq-sdk");
const dotenv = require('dotenv');
const path = require('path');

// Load .env from data
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("Checking Environment...");
if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is missing from .env");
    process.exit(1);
} else {
    console.log("GROQ_API_KEY found:", process.env.GROQ_API_KEY.substring(0, 10) + "...");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testAI() {
    console.log("Attempting to connect to Groq API...");
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Hello, are you working?" }
            ],
            model: "llama-3.3-70b-versatile",
        });
        console.log("Using Model: mixtral-8x7b-32768");

        console.log("SUCCESS! API Response received:");
        console.log(chatCompletion.choices[0]?.message?.content);
    } catch (error) {
        console.error("FATAL ERROR: Could not connect to AI.");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("API Status:", error.response.status);
            console.error("API Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

testAI();
