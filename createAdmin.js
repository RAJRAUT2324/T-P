// --- 1. IMPORT REQUIRED TOOLS ---
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/User'); // Ensure this path matches your folder structure

// --- 2. CONNECT TO DATABASE ---
mongoose.connect('mongodb://localhost:27017/TP_Cell_DB')
    .then(() => console.log("Connected to DB..."))
    .catch(err => console.log("DB Connection Error:", err));

// --- 3. CREATE ADMIN FUNCTION ---
const createAdmin = async () => {
    try {
        // Check if admin already exists to prevent duplicates
        const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            console.log("⚠️ Admin user already exists!");
            return;
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123", salt);

        // Create new user object
        const newAdmin = new User({
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin"
        });

        // Save to database
        await newAdmin.save();
        console.log("✅ SUCCESS: Admin User Created!");
        console.log("Login with: admin@gmail.com / 123");

    } catch (err) {
        console.log("❌ Error:", err.message);
    } finally {
        // Close connection
        mongoose.disconnect();
    }
};

// --- 4. RUN THE FUNCTION ---
createAdmin();