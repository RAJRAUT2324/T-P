const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    highestPackage: { type: String, default: "0 LPA" },
    averagePackage: { type: String, default: "0 LPA" },
    recruitersCount: { type: String, default: "0" },
    placedPercentage: { type: String, default: "0%" },
    
    // Arrays for the charts
    yearlyPlacementData: { type: [Number], default: [0,0,0,0,0] }, 
    branchData: { type: [Number], default: [0,0,0,0,0] }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);