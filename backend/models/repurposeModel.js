// backend/models/repurposeModel.js
const mongoose = require('mongoose');

const repurposeSchema = new mongoose.Schema({
    materialName: { type: String, required: true },
    materialType: { type: String, required: true },
    originalUse: { type: String, required: true },
    repurposedUse: { type: String, required: true },
    quantityToRepurpose: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    reason: { type: String, required: true },
    repurposedQuantity: { type: Number, required: true }
});

const Repurpose = mongoose.model('Repurpose', repurposeSchema);
module.exports = Repurpose;
