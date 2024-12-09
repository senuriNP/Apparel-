// src/components/ProfileButton.js

import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileButton.css';

const ProfileButton = () => {
  return (
    <div className="profile-button">
      <Link to="/profile">Profile</Link>
    </div>
  );
};

export default ProfileButton;
