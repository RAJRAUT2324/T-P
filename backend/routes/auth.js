const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// Secure secret - ensures token integrity
const JWT_SECRET = "ShreyasIsAGoodDeveloper";

// --- 1. REGISTER (Sign Up) ---
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, branch, role } = req.body;

        // Check if user already exists
        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(400).json({ message: "Email already exists" });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with all necessary fields for the Dashboard
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            branch,
            role: role || "student",
            // Initializing default values for profile/charts
            phone: "",
            rollNo: "",
            location: "Amravati, MH",
            cgpa: 0,
            batch: "2025",
            readiness: 0,
            skills: { java: 0, react: 0, python: 0, dsa: 0, sql: 0, comm: 0 },
            mockScores: [0, 0, 0, 0, 0],
            lecturesAttended: 0,
            mockInterviewsCount: 0
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. LOGIN ---
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Wrong password" });

        // JWT Payload
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.status(200).json({
            message: "Login Success",
            authToken,
            userId: user._id,
            role: user.role,
            name: user.name
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. GET LOGGED-IN USER (Secure) ---
router.get("/getuser", fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// --- 4. UPDATE USER DETAILS (Used by Profile Edit) ---
router.put('/updateuser', fetchuser, async (req, res) => {
    try {
        const { name, phone, rollNo, location, cgpa, batch, skills, readiness, mockScores } = req.body;
        const updateData = {};

        // Only add to updateData if the value exists in the request body
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (rollNo) updateData.rollNo = rollNo;
        if (location) updateData.location = location;
        if (cgpa) updateData.cgpa = cgpa;
        if (batch) updateData.batch = batch;
        if (skills) updateData.skills = skills;
        if (readiness) updateData.readiness = readiness;
        if (mockScores) updateData.mockScores = mockScores;

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: updateData }, 
            { new: true }
        ).select("-password");

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// --- 5. DATA INCREMENTS (Quick Stats) ---
router.post('/user/:id/increment-lecture', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { $inc: { lecturesAttended: 1 } });
        res.status(200).json({ message: "Lecture count updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/user/:id/increment-interview', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { $inc: { mockInterviewsCount: 1 } });
        res.status(200).json({ message: "Interview count updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;