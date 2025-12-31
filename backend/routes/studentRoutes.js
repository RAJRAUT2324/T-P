const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Fetch all students
router.get('/fetchall', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Add or Update student (Upsert logic)
router.post('/add', async (req, res) => {
    try {
        const { rollNo, name, branch, cgpa, status, package, company } = req.body;
        const student = await Student.findOneAndUpdate(
            { rollNo: rollNo }, 
            { name, branch, cgpa, status, package, company }, 
            { new: true, upsert: true }
        );
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: "Database Save Failed" });
    }
});

// Delete student
router.delete('/delete/:id', async (req, res) => {
    try {
        await Student.findOneAndDelete({ rollNo: req.params.id });
        res.json({ success: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete Failed" });
    }
});

module.exports = router;