const express = require('express');
const router = express.Router();
const User = require('../models/User');

// --- EXTENDED DATABASE OF TASKS ---
const TASK_POOL = {
    logic: [
        { id: 101, type: "logic", title: "Logic Puzzle", question: "If A is the brother of B; B is the sister of C; and C is the father of D, how is D related to A?", options: ["Nephew", "Brother", "Uncle", "Father"], correct: "Nephew" },
        { id: 102, type: "logic", title: "Series Completion", question: "Find the next number: 2, 6, 12, 20, 30, ...", options: ["40", "42", "44", "46"], correct: "42" },
        { id: 103, type: "logic", title: "Odd One Out", question: "Which word does not belong?", options: ["Apple", "Banana", "Carrot", "Grape"], correct: "Carrot" },
        { id: 104, type: "logic", title: "Coding Logic", question: "If CAT = 24 and DOG = 26, then RAT = ?", options: ["39", "40", "38", "42"], correct: "39" },
        { id: 105, type: "logic", title: "Direction Sense", question: "A man walks 5km North, turns Right, walks 5km. Which direction is he from start?", options: ["North-East", "North-West", "South-East", "North"], correct: "North-East" }
    ],
    code: [
        { id: 201, type: "code", title: "Debug JS", question: "What is the output of: console.log(1 + '1')?", options: ["2", "11", "NaN", "Error"], correct: "11" },
        { id: 202, type: "code", title: "SQL Query", question: "Which keyword is used to fetch unique records?", options: ["DISTINCT", "UNIQUE", "DIFFERENT", "SELECT"], correct: "DISTINCT" },
        { id: 203, type: "code", title: "Python Basics", question: "How do you start a for loop in Python?", options: ["for(i=0;...)", "for x in y:", "loop x in y", "forEach"], correct: "for x in y:" },
        { id: 204, type: "code", title: "React Props", question: "Props in React are...?", options: ["Mutable", "Read-Only", "Global", "Static"], correct: "Read-Only" },
        { id: 205, type: "code", title: "Git Command", question: "Which command uploads changes to remote?", options: ["git push", "git commit", "git save", "git upload"], correct: "git push" }
    ],
    speak: [
        { id: 301, type: "speak", title: "Self Intro", question: "Introduce yourself in 30 seconds.", action: "speech_analysis" },
        { id: 302, type: "speak", title: "Strength & Weakness", question: "What is your greatest strength?", action: "speech_analysis" },
        { id: 303, type: "speak", title: "Project Talk", question: "Describe your final year project briefly.", action: "speech_analysis" },
        { id: 304, type: "speak", title: "Why Hire You?", question: "Why should we hire you for this role?", action: "speech_analysis" },
        { id: 305, type: "speak", title: "Teamwork", question: "Describe a time you worked in a team.", action: "speech_analysis" }
    ]
};

// 1. GET DAILY TASKS (Dynamic Randomization)
router.get('/tasks', (req, res) => {
    // Simple Randomization: Pick 1 from each category
    // In production, we'd seed this by Date to ensure all students get the SAME random tasks per day

    const t1 = TASK_POOL.logic[Math.floor(Math.random() * TASK_POOL.logic.length)];
    const t2 = TASK_POOL.code[Math.floor(Math.random() * TASK_POOL.code.length)];
    const t3 = TASK_POOL.speak[Math.floor(Math.random() * TASK_POOL.speak.length)];

    res.json([t1, t2, t3]);
});

// 2. COMPLETE TASK (Update XP)
router.post('/complete', async (req, res) => {
    try {
        const { studentId, taskId } = req.body;

        const user = await User.findById(studentId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Logic to update XP and Streak
        const XP_GAIN = 50;
        user.xp = (user.xp || 0) + XP_GAIN;

        // Streak Logic
        const today = new Date().setHours(0, 0, 0, 0);
        const lastActive = new Date(user.lastActiveDate).setHours(0, 0, 0, 0);

        if (lastActive < today) {
            const diffTime = Math.abs(today - lastActive);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.streak += 1;
            } else {
                user.streak = 1; // Reset if missed a day
            }
            user.lastActiveDate = Date.now();
        } else if (user.streak === 0) {
            user.streak = 1; // First ever action
            user.lastActiveDate = Date.now();
        }

        await user.save();

        res.json({
            success: true,
            newXp: user.xp,
            newStreak: user.streak,
            message: `+${XP_GAIN} XP! Task Completed.`
        });

    } catch (error) {
        console.error("Task Complete Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
