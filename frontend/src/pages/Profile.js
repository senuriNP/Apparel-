// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const userId = "USER_ID_HERE"; // Replace with the logged-in user's ID
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUser(res.data);
    };
    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/users/${userId}`, user);
    setIsEditing(false);
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={user.country}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>
        <button type="button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
        {isEditing && <button type="submit">Save</button>}
      </form>
    </div>
  );
};

export default Profile;

