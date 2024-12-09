// backend/routes/repurposeRoutes.js
const express = require('express');
const router = express.Router();
const Repurpose = require('../models/repurposeModel');

// Get all repurposing requests
router.get('/', async (req, res) => {
    try {
        const repurposes = await Repurpose.find();
        res.json(repurposes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new repurposing request
router.post('/', async (req, res) => {
    const { materialName, materialType, originalUse, repurposedUse, quantityToRepurpose, date, reason, repurposedQuantity } = req.body;
    const repurpose = new Repurpose({
        materialName,
        materialType,
        originalUse,
        repurposedUse,
        quantityToRepurpose,
        date,
        reason,
        repurposedQuantity
    });
    
    try {
        const newRepurpose = await repurpose.save();
        res.status(201).json(newRepurpose);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a repurposing request
router.put('/:id', async (req, res) => {
    try {
        const repurpose = await Repurpose.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(repurpose);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a repurposing request
router.delete('/:id', async (req, res) => {
    try {
        await Repurpose.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
