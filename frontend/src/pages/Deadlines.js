// src/pages/Deadlines.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';
import './Deadlines.css';

const Deadlines = () => {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('In progress');
  const [deadlines, setDeadlines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDeadlines = async () => {
      const response = await axios.get('http://localhost:5000/api/deadlines');
      setDeadlines(response.data);
    };
    fetchDeadlines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDeadline = { task, date, status };
    const response = await axios.post('http://localhost:5000/api/deadlines', newDeadline);
    setDeadlines([...deadlines, response.data]);
    setTask('');
    setDate('');
    setStatus('In progress');
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/deadlines/${id}`);
    setDeadlines(deadlines.filter(deadline => deadline._id !== id));
  };

  const handleUpdate = async (id) => {
    const deadlineToUpdate = deadlines.find(deadline => deadline._id === id);
    const updatedTask = prompt('Enter new task:', deadlineToUpdate.task);
    const updatedDate = prompt('Enter new date:', new Date(deadlineToUpdate.date).toISOString().split('T')[0]);
    const updatedStatus = prompt('Enter new status (Completed, Failed, In progress):', deadlineToUpdate.status);

    if (updatedTask && updatedDate && updatedStatus) {
      const updatedDeadline = { task: updatedTask, date: updatedDate, status: updatedStatus };
      await axios.put(`http://localhost:5000/api/deadlines/${id}`, updatedDeadline);
      setDeadlines(deadlines.map(deadline => (deadline._id === id ? { ...deadline, ...updatedDeadline } : deadline)));
    }
  };
  // Function to restrict special characters
  const handleKeyPress = (e) => {
    const regex = /^[a-zA-Z0-9\s]*$/; // Only allow letters, numbers, and spaces
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  // Get today's date in the format YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  // Prepare data for the pie chart
  const getStatusData = () => {
    const statusCounts = {
      'In progress': 0,
      Completed: 0,
      Failed: 0,
    };

    deadlines.forEach(deadline => {
      statusCounts[deadline.status]++;
    });

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#f7e674', '#3fd46c', '#FF6384'],
      }],
    };
  };
    // Generate PDF function
const generatePDF = () => {
  if (deadlines.length === 0) {
    alert('No deadlines to generate a report.');
    return;
  }

  const doc = new jsPDF();

  // Add header
  doc.setFontSize(18);
  doc.text('DILFER', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Deadlines Report', 105, 30, { align: 'center' });

  // Create a table with deadlines data using autoTable
  const tableData = deadlines.map(deadline => [
    deadline.task,
    new Date(deadline.date).toLocaleDateString(),
    deadline.status,
  ]);

  doc.autoTable({
    startY: 40,
    head: [['Deadline', 'Date', 'Status']],
    body: tableData,
    theme: 'grid',
    styles: { cellPadding: 5, fontSize: 12 },
    headStyles: { fillColor: '#4CAF50', textColor: '#ffffff' },
    alternateRowStyles: { fillColor: '#f2f2f2' },
  });

  // Add a footer with space for a signature
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.text('Signature: _______________', 130, pageHeight - 30);

  // Save the PDF
  doc.save('deadlines.pdf');
};

  // Search functionality
  const filtereddeadlines = deadlines.filter(deadline =>
    deadline.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="deadlines-layout">
      {/* Navbar */}
      <div className="navbar">
        <h2 className="navbar-logo">DILFER</h2><br></br><br></br>
        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/designs">Designs</NavLink>
          <NavLink to="/reports">Reports</NavLink>
          <NavLink to="/deadlines">Deadlines</NavLink>
          <NavLink to="/materials">Materials</NavLink>
          <NavLink to="/production-time">Production Time</NavLink>
          <NavLink to="/repurposing">Repurposing</NavLink>
        </nav><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <div className="logout-button">
          <NavLink to="/">Logout</NavLink>
        </div>
      </div>

      {/* Profile Button */}
      <div className="profile-button">
        <Link to="/profile">Profile</Link>
      </div>

      {/* Deadline Content */}
      <div className="deadlines-content">
        <div className="scrollD">

        {/* Pie Chart */}
        <h2 style={{backgroundColor: '#007BFF', color: 'white', textAlign: 'center',width:'750px',left:'300px',padding:'10px',borderRadius:'10px'}}>Deadline Status Distribution</h2>
        <div className="chart-container" >
        
          <Pie data={getStatusData()} />
        </div>
        <div className='dform'>

        <h1>Add Deadlines Here</h1>
        <form onSubmit={handleSubmit}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr>
       
        <td>
          <label htmlFor="Task">Enter The Deadline:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Task"
            required
            style={{ width: '100%' }} // Ensure full width
          />
        </td>
      </tr>

      <tr>
        
        <td>
          <label htmlFor="Deadline ending sdate">Deadline ending date:</label>
          <input
            type="date"
            value={date}
            
            onChange={(e) => setDate(e.target.value)}
            required
            min={getTodayDate()}
            style={{ width: '100%' }} // Ensure full width
          />
        </td>
      </tr>

      <tr>
        
        <td>
          <label htmlFor="Enter Deadline Status">Enter deadline Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            required
            style={{ width: '100%' }} // Ensure full width
          >
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </td>
      </tr>

      <tr>
        <td colSpan="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px' }}>Add Deadline</button>
        </td>
      </tr>
    </tbody>
  </table>
</form>
</div>

        <div className='dedlinetable'> 
           {/* Search Bar */}
           <input
            type="text"
            placeholder="Search by deadline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ margin: '10px 0', padding: '8px', width: '100%' }}
          />
        {/* Deadline List as a Table */}
        <table className="deadline-table" id="deadline-table">
          <thead>
            <tr>
              <th>Deadline</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtereddeadlines.map((deadline) => (
              <tr key={deadline._id}>
                <td>{deadline.task}</td>
                <td>{new Date(deadline.date).toLocaleDateString()}</td>
                <td>{deadline.status}</td>
                <td>
                  <button className="update-buttonDed" onClick={() => handleUpdate(deadline._id)}>Update</button>
                  <button className="delete-buttonDed" onClick={() => handleDelete(deadline._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
           {/* Generate PDF Button */}
           <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={generatePDF} style={{ padding: '10px 20px' , backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>Generate PDF</button>
          </div>
        </div>

       
        
                   

        
      </div>
      </div>
    </div>
  );
};

export default Deadlines;
