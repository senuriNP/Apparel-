import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import './Dashboard.css';
import ProductionTimeChart from '../components/ProductionTimeChart';
import DeadlineStatusChart from '../components/DeadlineStatusChart'; // Import the pie chart component

const Dashboard = () => {
  
  const [message, setMessage] = useState([]);
  const [productionTimes, setProductionTimes] = useState([]);

  useEffect(() => {
    axios.get('/api/dashboard')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the dashboard data!', error);
      });

    fetchProductionTimes();
  }, []);

  const fetchProductionTimes = async () => {
    const res = await axios.get('http://localhost:5000/api/production-time');
    setProductionTimes(res.data);
  };

  return (
    <div className="dashboard-layout">
      <div className="navbar">
        <h2 className="navbar-logo">DILFER</h2><br></br><br></br>
        <nav className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/designs" className={({ isActive }) => (isActive ? 'active' : '')}>
            Designs
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
            Reports
          </NavLink>
          <NavLink to="/deadlines" className={({ isActive }) => (isActive ? 'active' : '')}>
            Deadlines
          </NavLink>
          <NavLink to="/materials" className={({ isActive }) => (isActive ? 'active' : '')}>
            Materials
          </NavLink>
          <NavLink to="/production-time" className={({ isActive }) => (isActive ? 'active' : '')}>
            Production Time
          </NavLink>
          <NavLink to="/repurposing" className={({ isActive }) => (isActive ? 'active' : '')}>
            Repurposing
          </NavLink>
        </nav><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <div className="logout-button">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Logout
          </NavLink>
        </div>
      </div>

      <div className="profile-button">
        <Link to="/profile">Profile</Link>
      </div>

      <div className="dashboard-content">
        <p>{message}</p>
        
        <div className="charts-container">
          <ProductionTimeChart productionTimes={productionTimes} />
          <DeadlineStatusChart /> {/* Render the pie chart */}
        </div><br></br><br></br><br></br><br></br>

        <div className="view-buttons" >
        <NavLink to="/reports" className="view-reports-button" style={{backgroundColor: 'white', padding: '10px', borderRadius: '5px', width: '300px', textDecoration: 'none',height: '50px',paddingTop: '20px',fontWeight: 'bold',  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)'}}>
            Create New Report
        </NavLink><br></br><br></br>
        <NavLink to="/materials" className="view-materials-button" style={{backgroundColor: 'white', padding: '10px', borderRadius: '5px', width: '300px',textDecoration: 'none', height: '45px',paddingTop: '25px',fontWeight: 'bold',boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)'}}>
            Request Materials
          </NavLink><br></br><br></br>
          <NavLink to="/production-time" className="view-production-time-button" style={{backgroundColor: 'white', padding: '10px', borderRadius: '5px', width: '300px', textDecoration: 'none',height: '45px',paddingTop: '20px',fontWeight: 'bold',boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)'}}>
            Calculate Production Time
          </NavLink>
          </div>

      </div>
    </div>
  );
};

export default Dashboard;
