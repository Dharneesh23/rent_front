import React, { useState } from 'react';
import './LoginPage.css';
import bikeImg from '../assets/bike_rental.jpg';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check admin login
    if (username === 'admin' && password === '123') {
      setSuccess(true);
      setError('');
      setTimeout(() => {
        window.location.hash = '#/admin-dashboard';
      }, 800);
      return;
    }
    // Check user login from localStorage
    const users = JSON.parse(localStorage.getItem('gorent_users') || '[]');
    const user = users.find(u => (u.username === username || u.email === username || u.mobile === username) && u.password === password);
    if (user) {
      setSuccess(true);
      setError('');
      // Store current user in localStorage
      localStorage.setItem('gorent_current_user', JSON.stringify(user));
      setTimeout(() => {
        window.location.hash = '#/selection';
      }, 800);
    } else {
      setError('Invalid username or password.');
      setSuccess(false);
    }
  };

  return (
    <div className="login-split-layout">
      <div className="login-image-side">
        <img src={bikeImg} alt="Bike" className="login-bike-img" />
      </div>
      <div className="login-form-side">
        <div className="login-form-box">
          <div className="login-title-main">
            <span className="login-welcome">Welcome to</span>
            <span className="login-brand">GoRent</span>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Username or Email Address"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className="login-actions-row">
              <button type="submit" className="login-btn yellow">LOG IN</button>
              <span className="login-forgot">Forgot password?</span>
            </div>
            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">Login successful!</div>}
          </form>
          <div className="login-or">or Log in with</div>
          <div className="login-socials">
            <button className="login-social-btn google">G</button>
            <button className="login-social-btn facebook">f</button>
          </div>
          <div
            className="login-signup-link"
            onClick={() => window.location.hash = '#/signup'}
            style={{ cursor: 'pointer' }}
          >
            Create my GoRent account!
          </div>
        </div>
      </div>
    </div>
  );
}
