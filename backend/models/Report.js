// backend/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now }, // Ensure this is of type Date
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: { type: String }
});

module.exports = mongoose.model('Report', reportSchema);
