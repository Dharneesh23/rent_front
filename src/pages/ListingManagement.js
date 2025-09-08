import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import './AdminDashboard.css';
import './ListingManagement.css';

export default function ListingManagement() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = () => {
    setLoading(true);
    try {
      // Load listings from localStorage (now using gorent_vehicles to match UserDashboard)
      const storedListings = JSON.parse(localStorage.getItem('gorent_vehicles') || '[]');
      
      // Add some sample listings if none exist
      if (storedListings.length === 0) {
        const sampleListings = [
          {
            id: 1,
            name: '2023 Honda City - Daily Rental',
            type: 'car',
            model: 'Honda City',
            year: 2023,
            price: 2500,
            location: 'Mumbai',
            ownerId: 'demo_user_1',
            ownerName: 'John Doe',
            ownerEmail: 'john@example.com',
            contactNumber: '9876543210',
            status: 'pending',
            submittedAt: '2024-12-15T10:30:00Z',
            description: 'Well maintained Honda City with excellent mileage. Perfect for city drives and highway trips.',
            features: ['AC', 'Automatic', 'GPS', 'Bluetooth', 'Power Steering'],
            images: []
          },
          {
            id: 2,
            name: 'Royal Enfield Classic 350 - Adventure Ready',
            type: 'bike',
            model: 'Royal Enfield Classic 350',
            year: 2022,
            price: 800,
            location: 'Delhi',
            ownerId: 'demo_user_2',
            ownerName: 'Jane Smith',
            ownerEmail: 'jane@example.com',
            contactNumber: '9876543211',
            status: 'approved',
            submittedAt: '2024-12-10T10:30:00Z',
            approvedDate: '2024-12-12',
            description: 'Classic bike perfect for city rides and long tours. Well maintained and serviced regularly.',
            features: ['Electric Start', 'LED Lights', 'Digital Console'],
            images: []
          },
          {
            id: 3,
            name: 'Maruti Swift VDI - Fuel Efficient',
            type: 'car',
            model: 'Maruti Swift',
            year: 2021,
            price: 2000,
            location: 'Pune',
            ownerId: 'demo_user_3',
            ownerName: 'Mike Johnson',
            ownerEmail: 'mike@example.com',
            contactNumber: '9876543212',
            status: 'rejected',
            submittedAt: '2024-12-08T10:30:00Z',
            rejectedDate: '2024-12-09',
            rejectionReason: 'Incomplete documentation - Missing valid insurance papers',
            description: 'Fuel efficient car for city driving with excellent mileage.',
            features: ['AC', 'Music System', 'Power Windows'],
            images: []
          },
          {
            id: 4,
            name: 'Hyundai Creta 2022 - SUV Experience',
            type: 'car',
            model: 'Hyundai Creta',
            year: 2022,
            price: 3500,
            location: 'Bangalore',
            ownerId: 'demo_user_4',
            ownerName: 'Sarah Wilson',
            ownerEmail: 'sarah@example.com',
            contactNumber: '9876543213',
            status: 'pending',
            submittedAt: '2024-12-14T10:30:00Z',
            description: 'Spacious SUV perfect for family trips and weekend getaways.',
            features: ['AC', 'Automatic', 'Sunroof', 'Leather Seats', 'Reverse Camera'],
            images: []
          },
          {
            id: 5,
            name: 'KTM Duke 390 - Sports Bike',
            type: 'bike',
            model: 'KTM Duke 390',
            year: 2023,
            price: 1200,
            location: 'Chennai',
            ownerId: 'demo_user_5',
            ownerName: 'Alex Kumar',
            ownerEmail: 'alex@example.com',
            contactNumber: '9876543214',
            status: 'approved',
            submittedAt: '2024-12-05T10:30:00Z',
            approvedDate: '2024-12-07',
            description: 'High performance sports bike for thrill seekers. Recently serviced.',
            features: ['ABS', 'Digital Console', 'LED Lights', 'Slipper Clutch'],
            images: []
          }
        ];
        
        localStorage.setItem('gorent_vehicles', JSON.stringify(sampleListings));
        setListings(sampleListings);
      } else {
        setListings(storedListings);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings([]);
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (listingId) => {
    const updatedListings = listings.map(listing => 
      listing.id === listingId 
        ? { ...listing, status: 'approved', approvedDate: new Date().toISOString().split('T')[0] }
        : listing
    );
    setListings(updatedListings);
    localStorage.setItem('gorent_vehicles', JSON.stringify(updatedListings));
  };

  const handleReject = (listingId, reason) => {
    const updatedListings = listings.map(listing => 
      listing.id === listingId 
        ? { 
            ...listing, 
            status: 'rejected', 
            rejectedDate: new Date().toISOString().split('T')[0],
            rejectionReason: reason || 'No reason provided'
          }
        : listing
    );
    setListings(updatedListings);
    localStorage.setItem('gorent_vehicles', JSON.stringify(updatedListings));
  };

  const handleDelete = (listingId) => {
    if (window.confirm('Are you sure you want to permanently delete this listing?')) {
      const updatedListings = listings.filter(listing => listing.id !== listingId);
      setListings(updatedListings);
      localStorage.setItem('gorent_vehicles', JSON.stringify(updatedListings));
    }
  };

  const showListingDetails = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const RejectModal = ({ listing, onReject, onClose }) => {
    const [reason, setReason] = useState('');
    
    const handleSubmit = () => {
      if (reason.trim()) {
        onReject(listing.id, reason);
        onClose();
      }
    };

    return (
      <div className="modal-overlay">
        <div className="reject-modal">
          <h3>Reject Listing: {listing.name}</h3>
          <textarea
            placeholder="Enter reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="reject-reason-input"
          />
          <div className="modal-actions">
            <button onClick={onClose} className="modal-btn cancel">Cancel</button>
            <button onClick={handleSubmit} className="modal-btn reject">Reject Listing</button>
          </div>
        </div>
      </div>
    );
  };

  const ListingDetailModal = ({ listing, onClose }) => (
    <div className="modal-overlay">
      <div className="listing-detail-modal">
        <div className="modal-header">
          <h3>{listing.name}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        {/* Vehicle Images Section */}
        <div className="modal-images-section">
          <strong>Vehicle Images:</strong>
          {listing.images && listing.images.length > 0 ? (
            <div className="modal-images-gallery">
              {listing.images.map((image, index) => (
                <div key={index} className="modal-image-item">
                  <img 
                    src={image} 
                    alt={`${listing.name} - Image ${index + 1}`}
                    className="modal-image"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-images-message">
              <p style={{ color: '#e0eaff', fontStyle: 'italic', margin: '0.5rem 0' }}>
                No images uploaded for this vehicle
              </p>
            </div>
          )}
        </div>
        
        <div className="modal-content">
          <div className="listing-details-grid">
            <div className="detail-item">
              <strong>Type:</strong> {listing.type}
            </div>
            <div className="detail-item">
              <strong>Model:</strong> {listing.model}
            </div>
            <div className="detail-item">
              <strong>Year:</strong> {listing.year}
            </div>
            <div className="detail-item">
              <strong>Price/Day:</strong> ₹{listing.price}
            </div>
            <div className="detail-item">
              <strong>Location:</strong> {listing.location}
            </div>
            <div className="detail-item">
              <strong>Status:</strong> 
              <span style={{ 
                color: getStatusColor(listing.status),
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginLeft: '0.5rem'
              }}>
                {listing.status}
              </span>
            </div>
          </div>
          <div className="description-section">
            <strong>Description:</strong>
            <p>{listing.description}</p>
          </div>
          <div className="features-section">
            <strong>Features:</strong>
            <div className="features-list">
              {listing.features.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
          </div>
          <div className="owner-section">
            <strong>Owner Information:</strong>
            <p>Name: {listing.ownerName}</p>
            <p>Email: {listing.ownerEmail}</p>
            <p>Phone: {listing.contactNumber}</p>
          </div>
          
          <div className="timeline-section">
            <strong>Timeline:</strong>
            <p>Submitted: {new Date(listing.submittedAt).toLocaleDateString()}</p>
            {listing.approvedDate && <p>Approved: {listing.approvedDate}</p>}
            {listing.rejectedDate && <p>Rejected: {listing.rejectedDate}</p>}
          </div>
          
          {listing.status === 'rejected' && (
            <div className="rejection-section">
              <strong>Rejection Reason:</strong>
              <p>{listing.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-main-layout">
      <DashboardSidebar />
      <div className="dashboard-content-area">
        <div className="listing-management-header">
          <h1>Listing Management</h1>
          <p>View all rental listings posted by users | Approve/Reject listings | Remove inappropriate content</p>
        </div>

        <div className="listing-management-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search listings by title, brand, model, location, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button className="refresh-btn" onClick={loadListings}>
            Refresh Listings
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading listings...</p>
          </div>
        ) : (
          <div className="listings-grid">
            {filteredListings.map(listing => (
              <div key={listing.id} className="listing-card">
                <div className="listing-header">
                  <h3>{listing.name}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(listing.status) }}
                  >
                    {listing.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="listing-info">
                  <p><strong>Type:</strong> {listing.type}</p>
                  <p><strong>Model:</strong> {listing.model}</p>
                  <p><strong>Year:</strong> {listing.year}</p>
                  <p><strong>Price:</strong> ₹{listing.price}/day</p>
                  <p><strong>Location:</strong> {listing.location}</p>
                  <p><strong>Owner:</strong> {listing.ownerName}</p>
                  <p><strong>Submitted:</strong> {new Date(listing.submittedAt).toLocaleDateString()}</p>
                </div>

                <div className="listing-actions">
                  <button 
                    onClick={() => showListingDetails(listing)}
                    className="action-btn view-btn"
                  >
                    View Details
                  </button>
                  
                  {listing.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(listing.id)}
                        className="action-btn approve-btn"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedListing(listing);
                          setShowModal(true);
                        }}
                        className="action-btn reject-btn"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => handleDelete(listing.id)}
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredListings.length === 0 && !loading && (
          <div className="no-listings-found">
            <p>No listings found matching your criteria.</p>
            {listings.length === 0 && (
              <p>Users can post their vehicles for rent, and they will appear here for review.</p>
            )}
          </div>
        )}

        <div className="listing-stats">
          <div className="stat-card">
            <h3>Total Listings</h3>
            <p className="stat-number">{listings.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Review</h3>
            <p className="stat-number">{listings.filter(l => l.status === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <p className="stat-number">{listings.filter(l => l.status === 'approved').length}</p>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <p className="stat-number">{listings.filter(l => l.status === 'rejected').length}</p>
          </div>
        </div>

        {/* Modals */}
        {showModal && selectedListing && selectedListing.status === 'pending' && (
          <RejectModal 
            listing={selectedListing}
            onReject={handleReject}
            onClose={() => {
              setShowModal(false);
              setSelectedListing(null);
            }}
          />
        )}

        {showModal && selectedListing && selectedListing.status !== 'pending' && (
          <ListingDetailModal 
            listing={selectedListing}
            onClose={() => {
              setShowModal(false);
              setSelectedListing(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
