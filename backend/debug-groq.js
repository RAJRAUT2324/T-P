const Groq = require("groq-sdk");
const dotenv = require("dotenv");
const path = require("path");

// Load env
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

console.log("--- Debugging Groq API ---");
console.log("Loading .env from:", envPath);
console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
if (process.env.GROQ_API_KEY) {
    console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY.length);
    console.log("GROQ_API_KEY prefix:", process.env.GROQ_API_KEY.substring(0, 4));
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testCall() {
    try {
        console.log("Attempting to call Groq API with model: llama-3.3-70b-versatile");
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Hello, are you working?" }],
            model: "llama-3.3-70b-versatile",
        });
        console.log("Success!");
        console.log("Response:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("!!! API Call Failed !!!");
        console.error("Error Message:", error.message);
        if (error.error) {
            console.error("API Error Details:", JSON.stringify(error.error, null, 2));
        }
    }
}

testCall();
