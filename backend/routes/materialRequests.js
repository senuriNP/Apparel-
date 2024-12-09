// backend/routes/materialRequests.js
const express = require('express');
const router = express.Router();
const MaterialRequest = require('../models/MaterialRequest');

// CREATE
// backend/routes/materialRequests.js
router.post('/', async (req, res) => {
    const { materialType, materialName, quantity, requestDate } = req.body; // Destructure requestDate
    const materialRequest = new MaterialRequest({ materialType, materialName, quantity, requestDate }); // Include requestDate
    try {
        const savedRequest = await materialRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// READ
router.get('/', async (req, res) => {
    try {
        const requests = await MaterialRequest.find();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedRequest = await MaterialRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await MaterialRequest.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
//new