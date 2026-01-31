const express = require('express');
const router = express.Router();
const Student = require('../models/User');

// GET TOP LEADERBOARD
router.get('/', async (req, res) => {
    try {
        // Fetch top 10 students sorted by XP descending
        const leaderboard = await Student.find({})
            .sort({ xp: -1 })
            .limit(10)
            .select('name branch xp streak'); // Only select necessary fields

        res.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
