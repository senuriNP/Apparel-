//backend/models/DesignRequest.js
const mongoose = require('mongoose');

// DesignRequest Schema
const DesignRequestSchema = new mongoose.Schema({
    patternId: { type: String, required: true },
    patternName: { type: String, required: true },
    material: { type: String, required: true },
    size: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true },
    approvalStatus: { type: String, required: true }
});

const DesignRequest = mongoose.model('DesignRequest', DesignRequestSchema);
module.exports = DesignRequest;


