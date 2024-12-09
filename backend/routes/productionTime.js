// backend/routes/productionTime.js
const express = require('express');
const router = express.Router();
const ProductionTime = require('../models/ProductionTime');

// CREATE
router.post('/', async (req, res) => {
    const { downtime, maintenance, totalProductionTime, totalProduced } = req.body;
    const calculatedTime = (downtime + maintenance + totalProductionTime) / totalProduced;

    const productionTime = new ProductionTime({
        downtime,
        maintenance,
        totalProductionTime,
        totalProduced,
        calculatedTime
    });

    try {
        const savedProductionTime = await productionTime.save();
        res.status(201).json(savedProductionTime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ
router.get('/', async (req, res) => {
    try {
        const productionTimes = await ProductionTime.find();
        res.json(productionTimes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    const { downtime, maintenance, totalProductionTime, totalProduced } = req.body;
    const calculatedTime = (downtime + maintenance + totalProductionTime) / totalProduced;

    try {
        const updatedProductionTime = await ProductionTime.findByIdAndUpdate(req.params.id, {
            downtime,
            maintenance,
            totalProductionTime,
            totalProduced,
            calculatedTime
        }, { new: true });
        res.json(updatedProductionTime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await ProductionTime.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
