const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Initialize Express
const app = express();

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, ".env") });

// --- Import Routes ---
const authRoute = require("./routes/auth");
const studentRoute = require("./routes/studentRoutes");
const aiRoute = require("./routes/aiRoutes"); // Import your Groq AI Route


// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 2. REGISTER API ROUTES ---
app.use("/api/auth", authRoute);
app.use("/api/students", studentRoute);
app.use("/api/ai", aiRoute); // This activates the AI routes

// --- 3. STATIC FILE SERVING ---
// Serve static files from the public folder (HTML)
app.use(express.static(path.join(__dirname, "../frontend/public")));
// Serve assets (CSS, JS, Images)
app.use("/assets", express.static(path.join(__dirname, "../frontend/assets")));

// --- 4. DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
  });

// --- 5. LANDING PAGE ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

// --- 6. SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Full Project running on http://localhost:${PORT}`);
  console.log(`AI Chatbot endpoint: http://localhost:${PORT}/api/ai/chat`);
});
