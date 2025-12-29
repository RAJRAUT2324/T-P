const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Required to find your HTML files
const authRoute = require('./routes/auth');

// Force it to find the .env file in the backend folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- 1. SERVE FRONTEND FILES (The Magic Step) ---
// This tells express to look inside "frontend/public" for html files
app.use(express.static(path.join(__dirname, '../frontend/public')));
// This serves css/js/images if they are in "frontend" folder
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// --- 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => console.log(err));

// --- 3. ROUTES ---
app.use("/api/auth", authRoute);

// --- 4. LANDING PAGE ---
// When someone opens "localhost:5000", show them index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Start Server
app.listen(5000, () => {
    console.log("Full Project running on http://localhost:5000");
});