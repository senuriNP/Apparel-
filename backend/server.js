// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  

const materialRequestsRouter = require('./routes/materialRequests');
const reportsRouter = require('./routes/reports');
const productionTimeRouter = require('./routes/productionTime');
const designRequestsRouter = require('./routes/designRequests');
const userRouter = require('./routes/user');
const deadlineRoutes = require('./routes/deadlineRoutes');
const repurposeRoutes = require('./routes/repurposeRoutes');
//login
const authRoutes = require('./routes/auth');

const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/material-requests', materialRequestsRouter);
app.use('/api/production-time', productionTimeRouter);
app.use('/uploads', express.static('uploads')); // Serve static files from uploads
app.use('/api/reports', reportsRouter);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/users', userRouter);
app.use('/api/repurposing', repurposeRoutes);
app.use('/api/designRequests', designRequestsRouter);

// Connect to MongoDB Atlas
connectDB(); 


// Sample route for Dashboard
app.get('/api/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Dashboard!' });
});



app.get('/api/reports', (req, res) => {
  res.json({ message: 'Here are your Reports.' });
});

app.get('/api/materials', (req, res) => {
  res.json({ message: 'Here are your Materials.' });
});

app.get('/api/production-time', (req, res) => {
  res.json({ message: 'Here is the Production Time.' });
});

app.get('/api/repurposing', (req, res) => {
  res.json({ message: 'Here is the Repurposing section.' });
});

// Logout route
app.post('/api/logout', (req, res) => {
  // Handle logout logic here (e.g., destroy session, token)
  res.json({ message: 'Logged out successfully.' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

