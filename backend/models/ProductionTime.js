// backend/models/ProductionTime.js
const mongoose = require('mongoose');

const productionTimeSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    downtime: { type: Number, required: true },
    maintenance: { type: Number, required: true },
    totalProductionTime: { type: Number, required: true },
    totalProduced: { type: Number, required: true },
    calculatedTime: { type: Number, required: true }
});

module.exports = mongoose.model('ProductionTime', productionTimeSchema);