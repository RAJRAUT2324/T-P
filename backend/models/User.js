const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Added Name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    branch: { type: String, default: 'Computer Science' }, // Added Branch
    role: { type: String, default: 'student' } 
});

module.exports = mongoose.model('User', UserSchema);