// frontend/src/pages/Materials.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; // Import the jsPDF AutoTable plugin
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for date picker
import './Materials.css';

const Materials = () => {
    const [materialType, setMaterialType] = useState('');
    const [materialName, setMaterialName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [requests, setRequests] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [signature, setSignature] = useState(null); // Store the signature image
    const [requestDate, setRequestDate] = useState(new Date()); // State for date

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/material-requests');
            setRequests(res.data);
        } catch (error) {
            console.error('Error fetching material requests:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRequest = { materialType, materialName, quantity, requestDate }; // Include requestDate
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/material-requests/${editingId}`, newRequest);
                setEditingId(null); // Reset editing mode
            } else {
                await axios.post('http://localhost:5000/api/material-requests', newRequest);
            }
            setMaterialType('');
            setMaterialName('');
            setQuantity('');
            setRequestDate(new Date()); // Reset requestDate to current date
            fetchRequests();
        } catch (error) {
            console.error('Error submitting material request:', error);
        }
    };
    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/material-requests/${id}`);
            fetchRequests();
        } catch (error) {
            console.error('Error deleting material request:', error);
        }
    };

    const handleEdit = (request) => {
        setMaterialType(request.materialType);
        setMaterialName(request.materialName);
        setQuantity(request.quantity);
        setRequestDate(new Date(request.requestDate)); // Set date to the selected request's date
        setEditingId(request._id);
    };

    const validateTextInput = (e) => {
        const regex = /^[a-zA-Z\s]*$/;
        if (!regex.test(e.target.value)) {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value >= 1) {
            setQuantity(value);
        }
    };

    // Handle signature file input
    const handleSignatureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSignature(event.target.result); // Store the image as a data URL
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate the report as a PDF
    const generateReportAsPDF = () => {
        if (requests.length === 0) {
            alert('No material requests to generate a report.');
            return;
        }

        const doc = new jsPDF(); 

        // Add the header
        doc.setFontSize(18);
        doc.text('DILFER', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.text('Material Requests Report', 105, 30, { align: 'center' });

        // Create a table with requests data using autoTable
        doc.autoTable({
            startY: 40,
            head: [['Material Type', 'Material Name', 'Quantity', 'Request Date']],
            body: requests.map(request => [
                request.materialType, 
                request.materialName, 
                request.quantity, 
                new Date(request.requestDate).toLocaleDateString() // Format the date
            ]),
        });

        // Add a footer with space for a signature
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.text('Signature:', 20, pageHeight - 30);

        // Add the signature image if available
        if (signature) {
            doc.addImage(signature, 'PNG', 20, pageHeight - 25, 50, 15); // Position and size of the signature
        }

        // Save the PDF
        doc.save('material-requests-report.pdf');
    };

    return (
        <div className="m-layout">
            <div className="navbar">
                <h2 className="navbar-logo">DILFER</h2><br /><br />
                <nav className="nav-links">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/designs">Designs</NavLink>
                    <NavLink to="/reports">Reports</NavLink>
                    <NavLink to="/deadlines">Deadlines</NavLink>
                    <NavLink to="/materials">Materials</NavLink>
                    <NavLink to="/production-time">Production Time</NavLink>
                    <NavLink to="/repurposing">Repurposing</NavLink><br /><br />
                </nav><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                <div className="logout-button">
                    <NavLink to="/">Logout</NavLink>
                </div>
            </div>

            <div className="profile-button">
                <Link to="/profile">Profile</Link>
            </div>

            <div className="material-content">
                <div className="scrollable-container">
                <div className='mform' style={{ width: '500px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' ,fontFamily: 'helvetica',fontSize: '24px'}}>Request Materials</h1>
                <form onSubmit={handleSubmit}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr>
        
        <td>
          <DatePicker
            selected={requestDate}
            onChange={(date) => setRequestDate(date)}
            dateFormat="yyyy/MM/dd"
            className="form-inputM"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px'
             
            }}
            maxDate={new Date()}
            required
          />
        </td>
      </tr>
      <tr>
       
        <td>
          <input
            type="text"
            placeholder="Material Type"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            onInput={(e) => validateTextInput(e)}
            className="form-inputM"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px'
              
            }}
            required
          />
        </td>
      </tr>
      <tr>
        
        <td>
          <input
            type="text"
            placeholder="Material Name"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            onInput={(e) => validateTextInput(e)}
            className="form-inputM"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
            required
          />
        </td>
      </tr>
      <tr>
        
        <td>
          <input
            type="number"
            placeholder="Quantity (kg)"
            value={quantity}
            onChange={handleQuantityChange}
            className="form-inputM"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
            required
          />
        </td>
      </tr>
      <tr>
        <td colSpan="2" style={{ textAlign: 'center' }}>
          <button
            className="mbutton"
            type="submit"
            style={{
              width: '200px',
              padding: '10px',
              backgroundColor: '#37c737',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: 'helvetica',
              fontWeight: 'bold',
            }}
          >
            {editingId ? 'Update Material Request' : 'Submit'}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</form>

                    </div><br />

                    <div className='prbox'>
                        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' ,fontFamily: 'helvetica'}}>Previous Material Requests</h2>
                        <input
                            type="text"
                            placeholder="Search Material Requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-bar"
                        />
                        <table className="material-table" style={{fontFamily: 'helvetica',}}>
                            <thead>
                                <tr>
                                    <th>Material Type</th>
                                    <th>Material Name</th>
                                    <th>Quantity</th>
                                    <th>Request Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                              {requests
                                .filter((request) =>
                                  request.materialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  request.materialName.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((request) => (
                                <tr key={request._id}>
                                <td>{request.materialType}</td>
                                <td>{request.materialName}</td>
                                <td>{request.quantity}</td>
                                <td>{new Date(request.requestDate).toLocaleDateString()}</td> {/* Format the date */}
                                <td>
                                <button className="edit-button" onClick={() => handleEdit(request)}>Update</button>
                                <button className="delete-button" onClick={() => handleDelete(request._id)}>Delete</button>
                                </td>
                                </tr>
                                 ))}
                            </tbody>

                        </table>
                    </div>

                    <br />
                    <div className="report-section">
                        <h3>Upload Signature:</h3>
                        <input type="file" onChange={handleSignatureUpload} accept="image/*" /><br /><br />
                        <button onClick={generateReportAsPDF} className="generate-report-button">Generate Report as PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Materials;




