//backend/routes/designRequests.js
const express = require('express');

const {
    createDesignRequest,
    getDesignRequests,
    updateDesignRequest,
    deleteDesignRequest,
    
} = require('../controllers/designRequestsController');
const router = express.Router();

router.post('/', createDesignRequest); // Create
router.get('/', getDesignRequests); // Read
router.put('/:id', updateDesignRequest); // Update
router.delete('/:id', deleteDesignRequest); // Delete


module.exports = router;

