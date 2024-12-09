// src/pages/ProductionTime.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker'; // Import the date picker
import 'react-datepicker/dist/react-datepicker.css';
import './ProductionTime.css';
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register chart.js components

const ProductionTime = () => {
    const [downtime, setDowntime] = useState('');
    const [maintenance, setMaintenance] = useState('');
    const [totalProductionTime, setTotalProductionTime] = useState('');
    const [totalProduced, setTotalProduced] = useState('');
    const [date, setDate] = useState(new Date()); // State for the selected date
    const [productionTimes, setProductionTimes] = useState([]);
    const [signatureImage, setSignatureImage] = useState(null); // State to store signature image
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProductionTimes();
    }, []);

    const fetchProductionTimes = async () => {
        const res = await axios.get('http://localhost:5000/api/production-time');
        setProductionTimes(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            Number(downtime) < 1 ||
            Number(maintenance) < 1 ||
            Number(totalProductionTime) < 1 ||
            Number(totalProduced) < 1
        ) {
            alert("All values must be at least 1.");
            return;
        }

        const productionData = {
            downtime: Number(downtime),
            maintenance: Number(maintenance),
            totalProductionTime: Number(totalProductionTime),
            totalProduced: Number(totalProduced),
            date // Include the selected date
        };

        await axios.post('http://localhost:5000/api/production-time', productionData);
        setDowntime('');
        setMaintenance('');
        setTotalProductionTime('');
        setTotalProduced('');
        setDate(new Date()); // Reset the date to current date
        fetchProductionTimes();
    };

    const handleUpdate = async (id) => {
        const updatedDowntime = prompt("New Downtime:", downtime);
        const updatedMaintenance = prompt("New Maintenance:", maintenance);
        const updatedTotalProductionTime = prompt("New Total Production Time:", totalProductionTime);
        const updatedTotalProduced = prompt("New Total Produced Amount:", totalProduced);
        const updatedDate = prompt("New Date (YYYY-MM-DD):", date.toISOString().slice(0, 10)); // Prompt for new date

        if (
            Number(updatedDowntime) < 1 ||
            Number(updatedMaintenance) < 1 ||
            Number(updatedTotalProductionTime) < 1 ||
            Number(updatedTotalProduced) < 1
        ) {
            alert("All values must be at least 1.");
            return;
        }

        const updatedData = {
            downtime: Number(updatedDowntime),
            maintenance: Number(updatedMaintenance),
            totalProductionTime: Number(updatedTotalProductionTime),
            totalProduced: Number(updatedTotalProduced),
            date: new Date(updatedDate) // Update date
        };

        await axios.put(`http://localhost:5000/api/production-time/${id}`, updatedData);
        fetchProductionTimes();
    };

    const handleDowntimeChange = (e) => {
        const value = e.target.value;
        if (value >= 1) {
            setDowntime(value);
        } else {
            setDowntime(1);
        }
    };

    const handleMaintenanceChange = (e) => {
        const value = e.target.value;
        if (value >= 1) {
            setMaintenance(value);
        } else {
            setMaintenance(1);
        }
    };

    const handleTotalProductionTimeChange = (e) => {
        const value = e.target.value;
        if (value >= 1) {
            setTotalProductionTime(value);
        } else {
            setTotalProductionTime(1);
        }
    };

    const handleTotalProducedChange = (e) => {
        const value = e.target.value;
        if (value >= 1) {
            setTotalProduced(value);
        } else {
            setTotalProduced(1);
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/production-time/${id}`);
        fetchProductionTimes();
    };

    // Handle signature image upload
    const handleSignatureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignatureImage(reader.result); // Store the image as a base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate PDF with table and signature space
    const generatePDF = () => {
        const doc = new jsPDF();

        // Add header
        doc.setFontSize(20);
        doc.text('DILFER', 105, 20, { align: 'center' });

        // Add table
        doc.autoTable({
            startY: 30,
            head: [['Date', 'Downtime (hrs)', 'Maintenance (hrs)', 'Total Prod. Time (hrs)', 'Total Produced', 'Avg Prod. Time']],
            body: productionTimes.map((prod) => [
                new Date(prod.date).toLocaleDateString(), // Format the date
                prod.downtime,
                prod.maintenance,
                prod.totalProductionTime,
                prod.totalProduced,
                prod.calculatedTime.toFixed(2)
            ]),
        });

        // Add space for signature at the bottom
        const finalY = doc.previousAutoTable.finalY || 60;

        // Add the signature image if uploaded
        if (signatureImage) {
            doc.addImage(signatureImage, 'PNG', 60, finalY + 10, 50, 20); // Adjust image position and size
        }

        // Add signature line
        doc.setFontSize(14);
        doc.text('Average production time Report', 105, 27, { align: 'center' });
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.text('Signature:______________', 130, pageHeight - 30);

        doc.save('production_report.pdf');
    };
      // Prepare data for the line chart
     // Prepare data for the line chart
const chartData = {
    labels: productionTimes.map((prod) => new Date(prod.date).toLocaleDateString()), // X-axis: Dates
    datasets: [
        {
            label: 'Average Production Time',
            data: productionTimes.map((prod) => prod.calculatedTime), // Y-axis: Avg production times
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.1, // Smooth curve
        },
    ],
};

// Define chart options
const chartOptions = {
    scales: {
        x: {
            title: {
                display: true,
                text: 'Date', // X-axis label
            },
        },
        y: {
            title: {
                display: true,
                text: 'Average Production Time (hrs)', // Y-axis label
            },
            beginAtZero: true, // Ensures the Y-axis starts from 0
        },
    },
    responsive: true, // Makes the chart responsive
    maintainAspectRatio: false, // Allows resizing
};

const filteredProductionTimes = productionTimes.filter(prod => {
    const prodDate = new Date(prod.date).toLocaleDateString();
    return (
        prodDate.includes(searchQuery) ||
        prod.downtime.toString().includes(searchQuery) ||
        prod.maintenance.toString().includes(searchQuery) ||
        prod.totalProductionTime.toString().includes(searchQuery) ||
        prod.totalProduced.toString().includes(searchQuery) ||
        prod.calculatedTime.toFixed(2).includes(searchQuery)
    );
});




    return (
        <div className="protime-layout">
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
                    </NavLink><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
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
            <div className="protime-content">
                <div className='scrollbar1'>
                    
                    {/* Line Graph */}
                    <div className="chart-container">
                    <Line data={chartData} options={chartOptions} />
                    </div>
         
                    <div className="proForm">
                        <h1>Calculate Average Production Time</h1>
                        <form onSubmit={handleSubmit}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr>
       
        <td>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-inputPT"
            style={{
              width: '100%',
              padding: '10px',
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
            type="number"
            placeholder="Production Line Downtime (hours)"
            value={downtime}
            onChange={handleDowntimeChange}
            className="form-inputPT"
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
            placeholder="Maintenance Time (hours)"
            value={maintenance}
            onChange={handleMaintenanceChange}
            className="form-inputPT"
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
            placeholder="Total Production Time (hours)"
            value={totalProductionTime}
            onChange={handleTotalProductionTimeChange}
            className="form-inputPT"
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
            placeholder="Total Produced Amount (number)"
            value={totalProduced}
            onChange={handleTotalProducedChange}
            className="form-inputPT"
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
        <td colSpan="2" style={{ textAlign: 'center' }}>
          <button
            type="submit"
            className="form-buttonPT"
            style={{
              width: '230px',
              padding: '10px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Calculate 
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</form>

                    </div><br />

                    <div className="PrevBox">
                        <h2>Previous Calculated Production Times</h2>

                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ margin: '10px 0', padding: '8px', width: '100%' }}
                        />

                        <table className="production-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Downtime (h)</th>
                                    <th>Maintenance (h)</th>
                                    <th>Total Production Time (h)</th>
                                    <th>Total Produced</th>
                                    <th>Average Production Time (hours per product)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredProductionTimes.map((prod) => (
                                    <tr key={prod._id}>
                                        <td>{new Date(prod.date).toLocaleDateString()}</td>
                                        <td>{prod.downtime}</td>
                                        <td>{prod.maintenance}</td>
                                        <td>{prod.totalProductionTime}</td>
                                        <td>{prod.totalProduced}</td>
                                        <td>{prod.calculatedTime.toFixed(2)}</td>
                                        <td>
                                            <button className="updt-button" onClick={() => handleUpdate(prod._id)}>Update</button>
                                            <button className="dlt-button" onClick={() => handleDelete(prod._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table><br />

                        {/* Signature upload button */}
                        <input type="file" accept="image/*" onChange={handleSignatureUpload} />

                        {/* Add Generate PDF button */}
                        <button className="form-buttonPT" onClick={generatePDF}>Generate Report as PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionTime;





