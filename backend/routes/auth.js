const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. REGISTER (Sign Up)
router.post('/register', async (req, res) => {
    try {
        // Check if user exists
        const emailExist = await User.findOne({ email: req.body.email });
        if(emailExist) return res.status(400).json({message: "Email already exists"});

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            branch: req.body.branch,
            role: 'student'
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Wrong password" });

        // Send back User ID and Role
        res.status(200).json({ 
            message: "Login Success",
            userId: user._id, 
            role: user.role,
            name: user.name 
        }); 
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. GET USER DATA (For Dashboard)
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // Don't send the password back!
        const { password, ...others } = user._doc; 
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;