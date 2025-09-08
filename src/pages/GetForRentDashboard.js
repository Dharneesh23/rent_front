import React, { useState, useEffect } from 'react';
import './GetForRentDashboard.css';
import bikeImg from '../assets/bike_rental.jpg';
import carImg from '../assets/car_rental.jpg';

export default function GetForRentDashboard() {
  const [user, setUser] = useState(localStorage.getItem('gorent_user') || '');
  const [filter, setFilter] = useState({ type: '', location: '', min: '', max: '' });
  const [selected, setSelected] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [myRentals, setMyRentals] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [approvedListings, setApprovedListings] = useState([]);

  useEffect(() => {
    loadApprovedVehicles();
  }, []);

  const loadApprovedVehicles = () => {
    // Load only approved vehicles from localStorage
    const allVehicles = JSON.parse(localStorage.getItem('gorent_vehicles') || '[]');
    const approved = allVehicles.filter(vehicle => vehicle.status === 'approved');
    
    // Transform the data to match the expected format
    const transformedListings = approved.map(vehicle => ({
      id: vehicle.id,
      type: vehicle.type,
      title: vehicle.name,
      location: vehicle.location,
      price: vehicle.price,
      available: true,
      owner: vehicle.ownerName,
      ownerContact: vehicle.ownerEmail,
      photos: vehicle.images.length > 0 ? vehicle.images : [vehicle.type === 'bike' ? bikeImg : carImg],
      description: vehicle.description || 'Well maintained vehicle',
      model: vehicle.model,
      year: vehicle.year,
      features: vehicle.features || [],
      contactNumber: vehicle.contactNumber,
      reviews: []
    }));
    
    setApprovedListings(transformedListings);
  };

  // Filtered listings
  const listings = approvedListings.filter(l =>
    (!filter.type || l.type === filter.type) &&
    (!filter.location || l.location.toLowerCase().includes(filter.location.toLowerCase())) &&
    (!filter.min || l.price >= Number(filter.min)) &&
    (!filter.max || l.price <= Number(filter.max))
  );

  // Simulate login/register
  const handleLogin = () => {
    setUser('demoUser');
    localStorage.setItem('gorent_user', 'demoUser');
  };

  // Book vehicle
  const handleBook = (listing) => {
    setMyRentals([...myRentals, listing]);
    setShowContact(false);
    setSelected(null);
  };

  // Submit feedback
  const handleFeedback = (listingId) => {
    // In real app, send to backend
    setShowFeedback(false);
    setFeedback('');
    alert('Thank you for your feedback!');
  };

  if (!user) {
    return (
      <div className="gfrd-bg">
        <div className="gfrd-login-box">
          <h2>Register / Login</h2>
          <button className="gfrd-login-btn" onClick={handleLogin}>Continue as Demo User</button>
        </div>
      </div>
    );
  }

  return (
    <div className="gfrd-bg">
      <div className="gfrd-header">
        <span>Browse Vehicles for Rent</span>
        <button 
          className="gfrd-refresh-btn" 
          onClick={loadApprovedVehicles}
          title="Refresh listings"
        >
          🔄 Refresh
        </button>
      </div>
      <div className="gfrd-filters">
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
        </select>
        <input type="text" placeholder="Location" value={filter.location} onChange={e => setFilter({ ...filter, location: e.target.value })} />
        <input type="number" placeholder="Min Price" value={filter.min} onChange={e => setFilter({ ...filter, min: e.target.value })} />
        <input type="number" placeholder="Max Price" value={filter.max} onChange={e => setFilter({ ...filter, max: e.target.value })} />
      </div>
      <div className="gfrd-listings">
        {listings.map(listing => (
          <div className="gfrd-listing-card" key={listing.id}>
            <img src={listing.photos[0]} alt={listing.title} className="gfrd-listing-img" />
            <div className="gfrd-listing-info">
              <div className="gfrd-listing-title">{listing.title}</div>
              <div className="gfrd-listing-meta">{listing.type.toUpperCase()} | {listing.location}</div>
              <div className="gfrd-listing-price">₹{listing.price} / day</div>
              <button className="gfrd-view-btn" onClick={() => setSelected(listing)}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Details Modal */}
      {selected && (
        <div className="gfrd-modal-bg" onClick={() => setSelected(null)}>
          <div className="gfrd-modal" onClick={e => e.stopPropagation()}>
            <img src={selected.photos[0]} alt={selected.title} className="gfrd-modal-img" />
            <div className="gfrd-modal-title">{selected.title}</div>
            <div className="gfrd-modal-meta">{selected.type.toUpperCase()} | {selected.location}</div>
            <div className="gfrd-modal-price">₹{selected.price} / day</div>
            <div className="gfrd-modal-desc">{selected.description}</div>
            <div className="gfrd-modal-owner">Owner: {selected.owner}</div>
            <div className="gfrd-modal-reviews">
              <b>Reviews:</b>
              {selected.reviews.map((r, i) => (
                <div key={i} className="gfrd-modal-review">{r.user}: {r.text}</div>
              ))}
            </div>
            <button className="gfrd-contact-btn" onClick={() => setShowContact(true)}>Contact / Request Booking</button>
            <button className="gfrd-close-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Contact/Booking Modal */}
      {showContact && selected && (
        <div className="gfrd-modal-bg" onClick={() => setShowContact(false)}>
          <div className="gfrd-modal" onClick={e => e.stopPropagation()}>
            <div className="gfrd-modal-title">Contact Owner</div>
            <div className="gfrd-modal-owner">{selected.owner} ({selected.ownerContact})</div>
            <button className="gfrd-book-btn" onClick={() => handleBook(selected)}>Request Booking</button>
            <button className="gfrd-close-btn" onClick={() => setShowContact(false)}>Close</button>
          </div>
        </div>
      )}

      {/* My Rentals */}
      <div className="gfrd-my-rentals">
        <h3>My Rentals</h3>
        {myRentals.length === 0 && <div>No rentals yet.</div>}
        {myRentals.map(r => (
          <div key={r.id} className="gfrd-my-rental-card">
            <span>{r.title} ({r.type}) - {r.location}</span>
            <button className="gfrd-feedback-btn" onClick={() => setShowFeedback(r.id)}>Give Feedback</button>
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="gfrd-modal-bg" onClick={() => setShowFeedback(false)}>
          <div className="gfrd-modal" onClick={e => e.stopPropagation()}>
            <div className="gfrd-modal-title">Leave Feedback</div>
            <textarea className="gfrd-feedback-input" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Your feedback..." />
            <button className="gfrd-book-btn" onClick={() => handleFeedback(showFeedback)}>Submit</button>
            <button className="gfrd-close-btn" onClick={() => setShowFeedback(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}