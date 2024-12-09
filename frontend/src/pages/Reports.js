// frontend/src/pages/Reports.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { NavLink, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for date picker
import './Reports.css';

const Reports = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [date, setDate] = useState(new Date());
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        const res = await axios.get('http://localhost:5000/api/reports');
        setReports(res.data);
    };

    const handleDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        if (file) formData.append('file', file);

        await axios.post('http://localhost:5000/api/reports', formData);
        setTitle('');
        setDescription('');
        setFile(null);
        setDate(new Date());
        fetchReports();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/reports/${id}`);
        fetchReports();
    };

    const handleUpdate = async (id) => {
        const updatedTitle = prompt("New Title:");
        const updatedDescription = prompt("New Description:");
        const updatedDate = prompt("New Date (YYYY-MM-DD):");
        const updatedFormData = new FormData();
        updatedFormData.append('title', updatedTitle);
        updatedFormData.append('description', updatedDescription);
        updatedFormData.append('date', updatedDate);
        if (file) updatedFormData.append('file', file);

        await axios.put(`http://localhost:5000/api/reports/${id}`, updatedFormData);
        fetchReports();
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

    return (
        <div className="reports-layout">
            {/* Navbar */}
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

            {/* ProfileButton */}
            <div className="profile-button">
                <Link to="/profile">Profile</Link>
            </div>

            {/* Dashboard Content */}
            <div className="reports-content">
                <div className="scrollbar2">
                    <div className="reportBox">
                        <h1>Create New Report</h1>
                        <form onSubmit={handleSubmit}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
            <tr>
                
                <td>
                    <input
                        type="text"
                        placeholder="Report Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                        style={{ width: '100%' }} // Optional: Ensure full width
                    />
                </td>
            </tr>
            <tr>
                
                <td>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        dateFormat="yyyy/MM/dd"
                        className="date-picker"
                        maxDate={new Date()} // Prevent future dates
                        required
                        style={{ width: '100%' }} // Optional: Ensure full width
                    />
                </td>
            </tr>

            <tr>
               
                <td>
                    <textarea
                        placeholder="Report Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="form-textarea"
                        style={{ width: '100%', height: '100px' }} // Optional: Adjust height
                    />
                </td>
            </tr>

            

            <tr>
                
                <td>
                    <div {...getRootProps({ className: 'dropzone dropzone-field' })} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop a file here, or click to select one</p>
                    </div>
                </td>
            </tr>

            <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>
                    <button type="submit" className="submit-button" style={{ padding: '10px 20px', marginTop: '20px' }}>Submit Report</button>
                </td>
            </tr>
        </tbody>
    </table>
</form>

                    </div><br></br>
                    <div className="prereportBox">
                        <h2>Previous Reports</h2>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>File</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report._id}>
                                        <td>{report.title}</td>
                                        <td>{report.description}</td>
                                        <td>{new Date(report.date).toLocaleDateString()}</td>
                                        <td>
                                            {report.file ? (
                                                <a href={`http://localhost:5000/${report.file}`} target="_blank" rel="noopener noreferrer">View File</a>
                                            ) : (
                                                'No File'
                                            )}
                                        </td>
                                        <td>
                                            <button className="update-buttonR" onClick={() => handleUpdate(report._id)}>Update</button>
                                            <button className="delete-buttonR" onClick={() => handleDelete(report._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
