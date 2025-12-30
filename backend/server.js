const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoute = require('./routes/auth');

// Initialize Express
const app = express();

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 2. STATIC FILE SERVING ---
// Serve static files from the public folder (HTML)
app.use(express.static(path.join(__dirname, '../frontend/public')));
// Serve assets (CSS, JS, Images)
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// --- 3. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.error("DB Connection Error:", err);
    });

// --- 4. ROUTES ---
app.use("/api/auth", authRoute);

// --- 5. LANDING PAGE ---
// Direct the root URL to your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// --- 6. SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Full Project running on http://localhost:${PORT}`);
});