// backend/models/MaterialRequest.js

const mongoose = require('mongoose');

const materialRequestSchema = new mongoose.Schema({
    materialType: { type: String, required: true },
    materialName: { type: String, required: true },
    quantity: { type: Number, required: true },
    requestDate: { type: Date, required: true }
    }, { collection: 'thematerialrequests'
});

module.exports = mongoose.model('MaterialRequest', materialRequestSchema);

