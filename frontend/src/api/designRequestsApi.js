//frontend/src/api/designRequestsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/designRequests'; // Ensure correct backend URL

// Get all design requests
const getDesignRequests = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

// Create a new design request
const createDesignRequest = async (request) => {
    const response = await axios.post(BASE_URL, request);
    return response.data;
};

// Update an existing design request
const updateDesignRequest = async (id, updatedRequest) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedRequest);
    return response.data;
};

// Delete a design request
const deleteDesignRequest = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};

// Export as a named object
const designRequestsApi = {
    getDesignRequests,
    createDesignRequest,
    updateDesignRequest,
    deleteDesignRequest,
};

export default designRequestsApi;



