const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    // Basic Authentication Fields
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },

    // Profile Details
    phone: { type: String, default: "" },
    rollNo: { type: String, default: "" },
    location: { type: String, default: "Amravati, MH" },
    cgpa: { type: Number, default: 0 },
    batch: { type: String, default: "2025" },

    // Placement Analytics (For the Charts)
    readiness: { type: Number, default: 0 },
    
    skills: {
        java: { type: Number, default: 0 },
        react: { type: Number, default: 0 },
        python: { type: Number, default: 0 },
        dsa: { type: Number, default: 0 },
        sql: { type: Number, default: 0 },
        comm: { type: Number, default: 0 }
    },

    // Mock Test Scores (Array of 5 numbers for the Line Chart)
    mockScores: { 
        type: [Number], 
        default: [0, 0, 0, 0, 0] 
    },

    // Metadata
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('user', UserSchema);