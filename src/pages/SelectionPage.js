import React from 'react';
import './SelectionPage.css';
import bikeImg from '../assets/bike_rental.jpg';

export default function SelectionPage() {
  return (
    <div className="selection-dark-bg">
      <div className="selection-hero">
        <img src={bikeImg} alt="Bike" className="selection-hero-img" />
        <div className="selection-hero-overlay" />
        <div className="selection-hero-text">
          <h1 className="selection-title">FIND YOUR RIDE</h1>
          <p className="selection-subtitle">On track for your next adventure</p>
        </div>
      </div>
      <div className="selection-action-box">
        <button className="selection-btn post animated-btn" onClick={() => window.location.hash = '#/user-dashboard'}>Post for Rent</button>
  <button className="selection-btn get animated-btn" onClick={() => window.location.hash = '#/get-for-rent-dashboard'}>Get for Rent</button>
      </div>
      <div className="selection-animated-bg"></div>
    </div>
  );
}