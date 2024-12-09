//backend/controllers/designRequestsController.js
const DesignRequest = require('../models/DesignRequest');


// Create Request
exports.createDesignRequest = async (req, res) => {
    const { patternId, patternName, material, size, image, date, approvalStatus } = req.body;
    const newRequest = new DesignRequest({ patternId, patternName, material, size, image, date, approvalStatus });

    try {
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating request:', error); // Log error for debugging
        res.status(400).json({ error: 'Error creating request' });
    }
};

// Read All Requests
exports.getDesignRequests = async (req, res) => {
    try {
        const requests = await DesignRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error); // Log error for debugging
        res.status(500).json({ error: 'Error fetching requests' });
    }
};

// Update Request
exports.updateDesignRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRequest = await DesignRequest.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error('Error updating request:', error); // Log error for debugging
        res.status(400).json({ error: 'Error updating request' });
    }
};

// Delete Request
exports.deleteDesignRequest = async (req, res) => {
    const { id } = req.params;
    try {
        await DesignRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'Request deleted' });
    } catch (error) {
        console.error('Error deleting request:', error); // Log error for debugging
        res.status(400).json({ error: 'Error deleting request' });
    }
};



