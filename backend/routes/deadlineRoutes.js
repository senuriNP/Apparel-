// backend/routes/deadlineRoutes.js
const express = require('express');
const router = express.Router();
const Deadline = require('../models/deadlines');

// Create a new deadline
router.post('/', async (req, res) => {
  try {
    const newDeadline = new Deadline(req.body);
    await newDeadline.save();
    res.status(201).json(newDeadline);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all deadlines
router.get('/', async (req, res) => {
  try {
    const deadlines = await Deadline.find();
    res.status(200).json(deadlines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a deadline
router.put('/:id', async (req, res) => {
  try {
    const updatedDeadline = await Deadline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedDeadline);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a deadline
router.delete('/:id', async (req, res) => {
  try {
    await Deadline.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

