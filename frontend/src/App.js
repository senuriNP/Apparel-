// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Designs from './pages/Designs';
import Deadlines from './pages/Deadlines';
import Materials from './pages/Materials';
import ProductionTime from './pages/ProductionTime';
import Repurposing from './pages/Repurposing';
import Profile from './pages/Profile';
//import DesignRequests from './pages/DesignRequests';

import './App.css';
//import Logout from './pages/Logout';
//<Route path="/logout" element={<Logout />} />

const Home = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const goToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div className="home-container">
      <h1>Welcome Manufacturing Manager!</h1>
      <button onClick={goToDashboard} className="dashboard-button">
        Go to Manufacturing Manager Dashboard
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Routes>
          {/* Home route with the button */}
          <Route path="/" element={<Home />} />

          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/designs" element={<Designs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/production-time" element={<ProductionTime />} />
          <Route path="/repurposing" element={<Repurposing />} />
          
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;