// backend/models/deadlines.js
const mongoose = require('mongoose');

const DeadlineSchema = new mongoose.Schema({
  task: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Completed', 'Failed', 'In progress'], required: true } // Add status field
});

module.exports = mongoose.model('Deadline', DeadlineSchema);


