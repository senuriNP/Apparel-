// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
    }
});
const upload = multer({ storage });

// CREATE
router.post('/', upload.single('file'), async (req, res) => {
    const report = new Report({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date, // Save the date from the request
        file: req.file ? req.file.path : null // Check for file existence
    });
    try {
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// READ
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.file) updatedReport.file = req.file.path; // Update file if new file is uploaded
        await updatedReport.save();
        res.json(updatedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;