// src/components/Navbar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <h2 className="navbar-logo">MERN Dashboard</h2>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
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
      </nav>
      <div className="logout-button">
        <NavLink to="/logout" className={({ isActive }) => (isActive ? 'active' : '')}>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
