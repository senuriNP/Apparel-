import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';
import './Repurposing.css';

const Repurposing = () => {
  const [formData, setFormData] = useState({
      materialName: '',
      materialType: '',
      originalUse: '',
      repurposedUse: '',
      quantityToRepurpose: '',
      date: '',
      reason: '',
      repurposedQuantity: ''
  });
  const [repurposes, setRepurposes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
      fetchRepurposes();
  }, []);

  const fetchRepurposes = async () => {
      try {
          const res = await axios.get('http://localhost:5000/api/repurposing');
          setRepurposes(res.data);
      } catch (error) {
          console.error('Error fetching repurposing data:', error);
      }
  };

  const handleChange = (e) => {
      const { name, value } = e.target;

      // Validation for special characters and numbers
      const specialCharRegex = /[^a-zA-Z0-9\s]/; // Allow only letters, numbers, and spaces
      const isNumber = (val) => !isNaN(val) && val >= 1;

      switch (name) {
          case 'materialName':
          case 'materialType':
          case 'originalUse':
          case 'repurposedUse':
          case 'reason':
              if (!specialCharRegex.test(value) || value === '') {
                  setFormData({ ...formData, [name]: value });
              }
              break;
          case 'quantityToRepurpose':
          case 'repurposedQuantity':
              if (isNumber(value) || value === '') {
                  setFormData({ ...formData, [name]: value });
              }
              break;
          case 'date':
              const today = new Date().toISOString().split('T')[0];
              if (value <= today) {
                  setFormData({ ...formData, [name]: value });
              }
              break;
          default:
              setFormData({ ...formData, [name]: value });
              break;
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (editingId) {
              await axios.put(`http://localhost:5000/api/repurposing/${editingId}`, formData);
              setEditingId(null);
          } else {
              await axios.post('http://localhost:5000/api/repurposing', formData);
          }
          setFormData({
              materialName: '',
              materialType: '',
              originalUse: '',
              repurposedUse: '',
              quantityToRepurpose: '',
              date: '',
              reason: '',
              repurposedQuantity: ''
          });
          fetchRepurposes();
      } catch (error) {
          console.error('Error submitting repurposing request:', error);
          alert('Error submitting repurposing request: ' + error.message);
      }
  };

  const handleEdit = (request) => {
      setFormData(request);
      setEditingId(request._id);
  };

  const handleDelete = async (id) => {
      try {
          await axios.delete(`http://localhost:5000/api/repurposing/${id}`);
          fetchRepurposes();
      } catch (error) {
          console.error('Error deleting repurposing request:', error);
      }
  };

  const generatePDF = () => {
      if (repurposes.length === 0) {
          alert('No repurposing requests to generate a report.');
          return;
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('DILFER', 105, 20, { align: 'center' });

      doc.setFontSize(14);
      doc.text('Repurposing Requests Report', 105, 30, { align: 'center' });
      const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      doc.text('Signature:______________', 130, pageHeight - 30);

      doc.autoTable({
          startY: 40,
          head: [['Material Name', 'Material Type', 'Original Use', 'Repurposed Use', 'Quantity to Repurpose', 'Date', 'Reason', 'Repurposed Quantity']],
          body: repurposes.map(repurpose => [
              repurpose.materialName,
              repurpose.materialType,
              repurpose.originalUse,
              repurpose.repurposedUse,
              repurpose.quantityToRepurpose,
              new Date(repurpose.date).toLocaleDateString(),
              repurpose.reason,
              repurpose.repurposedQuantity
          ]),
      });

      doc.save('repurposing-requests-report.pdf');
  };

  const filteredRepurposes = repurposes.filter((repurpose) =>
      Object.values(repurpose).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
      <div className="rep-layout">
          {/* Navbar */}
          <div className="navbar">
              <h2 className="navbar-logo">DILFER</h2><br /><br />
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
                  </NavLink><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              </nav>
              <div className="logout-button">
                  <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Logout
                  </NavLink>
              </div>
          </div>

          {/* ProfileButton */}
          <div className="profile-button">
              <Link to="/profile">Profile</Link>
          </div>

          {/* Dashboard Content */}
          <div className="rep-content">
              <div className='scrollRep'>
                  <div className='repForm1'>
                      <div className='repForm'>
                          <h1>Repurposing</h1>
                          <table style={{ width: '400px', borderCollapse: 'collapse' }}>
                              <tbody>
                                  <tr>
                                      <td>
                                          <form onSubmit={handleSubmit}>
                                              <table>
                                                  <tbody>
                                                      <tr>
                                                          <td>
                                                              <input
                                                                  type="text"
                                                                  name="materialName"
                                                                  placeholder="Material Name"
                                                                  value={formData.materialName}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                                  name="materialType"
                                                                  placeholder="Material Type"
                                                                  value={formData.materialType}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                                  name="originalUse"
                                                                  placeholder="Original Use"
                                                                  value={formData.originalUse}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                                  name="repurposedUse"
                                                                  placeholder="Repurposed Use"
                                                                  value={formData.repurposedUse}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                                  name="quantityToRepurpose"
                                                                  placeholder="Quantity to Repurpose"
                                                                  value={formData.quantityToRepurpose}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                                  type="date"
                                                                  name="date"
                                                                  value={formData.date}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                                  name="reason"
                                                                  placeholder="Reason"
                                                                  value={formData.reason}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                                  name="repurposedQuantity"
                                                                  placeholder="Repurposed Quantity"
                                                                  value={formData.repurposedQuantity}
                                                                  onChange={handleChange}
                                                                  style={{
                                                                      width: '100%',
                                                                      padding: '10px',
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
                                                              <button
                                                                  style={{
                                                                      width: '230px',
                                                                      padding: '10px',
                                                                      backgroundColor: '#28a745',
                                                                      color: '#fff',
                                                                      border: 'none',
                                                                      borderRadius: '4px',
                                                                      fontSize: '16px',
                                                                      fontWeight: 'bold',
                                                                      cursor: 'pointer'
                                                                  }}
                                                                  type="submit">{editingId ? 'Update' : 'Submit'}</button>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </form>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div className='repurposingTable'>
                      <h2>Previous Repurposing Requests</h2>

                      <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              marginBottom: '20px',
                              fontSize: '16px',
                          }}
                      />
                      <table className='repurposingtable'>
                          <thead>
                              <tr>
                                  <th>Material Name</th>
                                  <th>Material Type</th>
                                  <th>Original Use</th>
                                  <th>Repurposed Use</th>
                                  <th>Quantity to Repurpose</th>
                                  <th>Date</th>
                                  <th>Reason</th>
                                  <th>Repurposed Quantity</th>
                                  <th>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {filteredRepurposes.map((repurpose) => (
                                  <tr key={repurpose._id}>
                                      <td>{repurpose.materialName}</td>
                                      <td>{repurpose.materialType}</td>
                                      <td>{repurpose.originalUse}</td>
                                      <td>{repurpose.repurposedUse}</td>
                                      <td>{repurpose.quantityToRepurpose}</td>
                                      <td>{new Date(repurpose.date).toLocaleDateString()}</td>
                                      <td>{repurpose.reason}</td>
                                      <td>{repurpose.repurposedQuantity}</td>
                                      <td>
                                          <button className="Repedit-button" onClick={() => handleEdit(repurpose)}>Edit</button>
                                          <button className="Repdelete-button" onClick={() => handleDelete(repurpose._id)}>Delete</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                      {/* Generate PDF Button */}
                      <div style={{ textAlign: 'center', marginTop: '20px' }}>
                          <button onClick={generatePDF} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Generate PDF</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Repurposing;
