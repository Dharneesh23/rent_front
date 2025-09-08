import React, { useState } from 'react';
import './SignUpPage.css';
import carImg from '../assets/car_rental.jpg';

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Handle mobile input - only allow numbers and max 10 digits
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setMobile(value);
      // Clear form error when user starts typing or reaches 10 digits
      if (formError && (value.length === 10 || value.length > mobile.length)) {
        setFormError('');
      }
    }
  };

  // Step 1: Name & Mobile
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      if (mobile.length === 0) {
        setFormError('Please enter your mobile number');
      } else if (mobile.length < 10) {
        setFormError(`Please enter all 10 digits. You've entered ${mobile.length} digits.`);
      } else {
        setFormError('Mobile number should be exactly 10 digits');
      }
      return;
    }
    setFormError('');
    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setStep(2);
    setTimeout(() => {
      alert('Your OTP is: ' + generatedOtp);
    }, 200);
  };

  // Step 2: OTP Verification

  const [showResend, setShowResend] = useState(false);
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOtp === otp) {
      setOtpError('');
      setShowResend(false);
      setStep(3);
    } else {
      setOtpError('Invalid OTP. Please try again.');
      setShowResend(true);
    }
  };

  const handleResendOtp = () => {
    // Generate new OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setEnteredOtp('');
    setOtpError('');
    setShowResend(false);
    setTimeout(() => {
      alert('Your new OTP is: ' + generatedOtp);
    }, 200);
  };

  // Step 3: Almost Done (username, email, password)
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setFormError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    // Check for duplicate email or mobile
    const users = JSON.parse(localStorage.getItem('gorent_users') || '[]');
    if (users.some(u => u.email === email)) {
      setFormError('Email already exists. Please use another email.');
      return;
    }
    // Save user
    users.push({
      name,
      mobile,
      username,
      email,
      password,
      joinDate: new Date().toISOString().split('T')[0], // Current date
      status: 'Active',
      role: 'User',
      lastLogin: 'Never'
    });
    localStorage.setItem('gorent_users', JSON.stringify(users));
    setFormError('');
    alert('Account created successfully!');
    window.location.hash = '#/login';
  };

  return (
    <div className="signup-split-layout">
      <div className="signup-image-side">
        <img src={carImg} alt="Car" className="signup-car-img" />
      </div>
      <div className="signup-form-side">
        <div className="signup-form-box">
          <div className="signup-logo-title">
            <span className="signup-logo-icon">🚗</span>
            <span className="signup-logo-text">GoRent</span>
          </div>
          {step === 1 && (
            <>
              <h2>Sign Up to your account</h2>
              <p className="signup-desc">Enter your name and mobile number</p>
              <form className="signup-form" onSubmit={handleMobileSubmit}>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <div className="mobile-input-container">
                  <input 
                    type="tel" 
                    placeholder="Mobile Number (10 digits)" 
                    value={mobile} 
                    onChange={handleMobileChange}
                    maxLength="10"
                    pattern="[0-9]{10}"
                    title="Please enter exactly 10 digits"
                    className={mobile.length === 10 ? 'valid' : mobile.length > 0 ? 'incomplete' : ''}
                    required 
                  />
                  {mobile.length > 0 && (
                    <div className={`digit-counter ${mobile.length === 10 ? 'complete' : 'incomplete'}`}>
                      {mobile.length}/10 digits
                    </div>
                  )}
                </div>
                <button type="submit">Continue</button>
                {formError && <div className="signup-error">{formError}</div>}
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <h2>OTP Verification</h2>
              <p className="signup-desc">Enter the OTP sent to your mobile</p>
              <form className="signup-form" onSubmit={handleOtpSubmit}>
                <input type="text" placeholder="Enter OTP" value={enteredOtp} onChange={e => setEnteredOtp(e.target.value)} required />
                <button type="submit">Verify OTP</button>
                {otpError && <div className="signup-error">{otpError}</div>}
                {showResend && (
                  <button type="button" className="signup-resend-btn" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                )}
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Almost Done!</h2>
              <p className="signup-desc">Set your username, email, and password</p>
              <form className="signup-form" onSubmit={handleFinalSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
                {formError && <div className="signup-error">{formError}</div>}
              </form>
            </>
          )}
          <p className="signup-login-link">Already have an account? <a href="#/login">Log in</a></p>
        </div>
      </div>
    </div>
  );
}
