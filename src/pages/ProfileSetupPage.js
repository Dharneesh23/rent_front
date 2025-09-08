import React, { useState } from 'react';
import './ProfileSetupPage.css';

export default function ProfileSetupPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send data to backend
    setSuccess(true);
    setTimeout(() => {
      window.location.hash = '#/login';
    }, 1200);
  };

  return (
    <div className="profile-setup-bg">
      <div className="profile-setup-box">
        <h2>Complete Your Profile</h2>
        <form className="profile-setup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            pattern="[0-9]{10,}"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
          <button type="submit" className="profile-setup-btn">Save & Continue</button>
        </form>
        {success && <div className="profile-setup-success">Profile saved! Redirecting to login...</div>}
      </div>
    </div>
  );
}