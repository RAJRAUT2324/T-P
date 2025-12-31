const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    branch: { type: String },
    cgpa: { type: Number },
    status: { type: String },
    package: { type: Number },
    company: { type: String }
});

// This name 'Student' is what the router looks for
module.exports = mongoose.model('Student', StudentSchema);