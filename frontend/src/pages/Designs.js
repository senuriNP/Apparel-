// frontend/src/pages/Designs.js

import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import './Designs.css';
import designRequestsApi from '../api/designRequestsApi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

//const BASE_URL = 'http://localhost:5000/api/designRequests';
const Designs = () => {
  const [previousRequests, setPreviousRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDesignRequests = async () => {
    const requests = await designRequestsApi.getDesignRequests();
    setPreviousRequests(requests);
};

  useEffect(() => {
    fetchDesignRequests();
  }, []);

  // Filtered requests based on search term
  const filteredRequests = previousRequests.filter((request) =>
    request.patternId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.patternName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateReportAsPDF = () => {
    if (filteredRequests.length === 0) {
      alert('No design requests to generate a report.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('DILFER', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Design Requests Report', 105, 30, { align: 'center' });
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.text('Signature:_______________', 130, pageHeight - 30);

    doc.autoTable({
      startY: 40,
      head: [['Pattern ID', 'Pattern Name', 'Material', 'Size', 'Date', 'Approval Status']],
      body: filteredRequests.map(request => [
        request.patternId,
        request.patternName,
        request.material,
        request.size,
        request.date ? new Date(request.date).toLocaleDateString() : 'No date',
        request.approvalStatus,
      ]),
    });

    doc.save('design-requests-report.pdf');
  };

  return (
    <div className="design-layout">
      {/* Navbar */}
      <div className="navbar">
        <h2 className="navbar-logo">DILFER</h2><br></br><br></br>
        <nav className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
          <NavLink to="/designs" className={({ isActive }) => (isActive ? 'active' : '')}>Designs</NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>Reports</NavLink>
          <NavLink to="/deadlines" className={({ isActive }) => (isActive ? 'active' : '')}>Deadlines</NavLink>
          <NavLink to="/materials" className={({ isActive }) => (isActive ? 'active' : '')}>Materials</NavLink>
          <NavLink to="/production-time" className={({ isActive }) => (isActive ? 'active' : '')}>Production Time</NavLink>
          <NavLink to="/repurposing" className={({ isActive }) => (isActive ? 'active' : '')}>Repurposing</NavLink>
        </nav><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <div className="logout-button">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Logout</NavLink>
        </div>
      </div>

      {/* Profile Button */}
      <div className="profile-button">
        <Link to="/profile">Profile</Link>
      </div>

      {/* Design Content */}
      <div className="design-content">
        <div className="design-Box">
        <h3>View Designs From Design Manager</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', padding: '5px', width: '100%' }}
        />
        <table className="designs-table">
          <thead>
            <tr>
              <th>Pattern ID</th>
              <th>Pattern Name</th>
              <th>Material</th>
              <th>Size</th>
              <th>Image</th>
              <th>Date</th>
              <th>Approval Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.patternId}</td>
                  <td>{request.patternName}</td>
                  <td>{request.material}</td>
                  <td>{request.size}</td>
                  <td>
                    <img src={request.image} alt="Design" className="design-image" />
                  </td>
                  <td>{request.date ? request.date.substring(0, 10) : 'No date'}</td>
                  <td>{request.approvalStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <button
            onClick={generateReportAsPDF}
            style={{
              marginBottom: '20px',
              padding: '10px 15px',
              backgroundColor: '#37c737',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Generate Report as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Designs;
