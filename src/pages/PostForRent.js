import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import './AdminDashboard.css';
import './PostForRent.css';

export default function PostForRent() {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, add-vehicle, edit-vehicle
  const [userListings, setUserListings] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from localStorage (you might have a different auth system)
    let user = JSON.parse(localStorage.getItem('current_user') || 'null');
    
    // For demo purposes, create a mock user if none exists
    if (!user) {
      user = {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        mobile: '9876543210'
      };
      localStorage.setItem('current_user', JSON.stringify(user));
    }
    
    setCurrentUser(user);
    loadUserData(user);
  }, []);

  const loadUserData = (user) => {
    try {
      // Load user's listings
      let allListings = JSON.parse(localStorage.getItem('gorent_listings') || '[]');
      let myListings = allListings.filter(listing => 
        listing.ownerEmail === user.email || listing.ownerId === user.id
      );
      
      // Create sample listings for demo user if none exist
      if (myListings.length === 0 && user.email === 'demo@example.com') {
        const sampleListings = [
          {
            id: Date.now(),
            title: 'Honda City - Premium Sedan Rental',
            type: 'Car',
            brand: 'Honda',
            model: 'City',
            year: 2023,
            condition: 'Excellent',
            location: 'Mumbai',
            pricePerHour: '150',
            pricePerDay: '2500',
            pricePerWeek: '15000',
            description: 'Well-maintained Honda City with excellent mileage. Perfect for city drives and highway trips.',
            features: ['AC', 'Automatic', 'GPS', 'Bluetooth', 'Power Steering'],
            fuelType: 'Petrol',
            transmission: 'Automatic',
            seatingCapacity: 5,
            photos: ['honda_city_1.jpg', 'honda_city_2.jpg'],
            ownerName: user.name,
            ownerEmail: user.email,
            ownerPhone: user.mobile,
            ownerId: user.id,
            status: 'approved',
            submittedDate: '2024-12-10',
            approvedDate: '2024-12-12',
            documents: ['RC', 'Insurance', 'PUC']
          },
          {
            id: Date.now() + 1,
            title: 'Royal Enfield Classic 350 - Adventure Ready',
            type: 'Bike',
            brand: 'Royal Enfield',
            model: 'Classic 350',
            year: 2022,
            condition: 'Good',
            location: 'Mumbai',
            pricePerHour: '80',
            pricePerDay: '800',
            pricePerWeek: '5000',
            description: 'Classic bike perfect for city rides and long tours. Recently serviced.',
            features: ['Electric Start', 'LED Lights', 'Digital Console'],
            fuelType: 'Petrol',
            transmission: 'Manual',
            seatingCapacity: 2,
            photos: ['re_classic_1.jpg'],
            ownerName: user.name,
            ownerEmail: user.email,
            ownerPhone: user.mobile,
            ownerId: user.id,
            status: 'pending',
            submittedDate: '2024-12-14',
            documents: ['RC', 'Insurance', 'PUC']
          }
        ];
        
        allListings = [...allListings, ...sampleListings];
        localStorage.setItem('gorent_listings', JSON.stringify(allListings));
        myListings = sampleListings;
      }
      
      setUserListings(myListings);

      // Load rental requests for user's vehicles
      let allRequests = JSON.parse(localStorage.getItem('rental_requests') || '[]');
      
      // Create sample rental requests if none exist and user has listings
      if (allRequests.length === 0 && myListings.length > 0) {
        const sampleRequests = [
          {
            id: 1,
            listingId: myListings[0].id,
            renterName: 'Alice Johnson',
            renterEmail: 'alice@example.com',
            renterPhone: '9876543220',
            startDate: '2024-12-20',
            endDate: '2024-12-22',
            totalAmount: 5000,
            message: 'Need the car for a weekend trip to Goa',
            status: 'pending',
            requestDate: '2024-12-15'
          },
          {
            id: 2,
            listingId: myListings[0].id,
            renterName: 'Bob Smith',
            renterEmail: 'bob@example.com',
            renterPhone: '9876543221',
            startDate: '2024-12-25',
            endDate: '2024-12-27',
            totalAmount: 6000,
            message: 'Family vacation, need reliable transport',
            status: 'pending',
            requestDate: '2024-12-14'
          }
        ];
        
        if (myListings.length > 1) {
          sampleRequests.push({
            id: 3,
            listingId: myListings[1].id,
            renterName: 'Charlie Brown',
            renterEmail: 'charlie@example.com',
            renterPhone: '9876543222',
            startDate: '2024-12-18',
            endDate: '2024-12-19',
            totalAmount: 1600,
            message: 'Quick city ride needed',
            status: 'approved',
            requestDate: '2024-12-13'
          });
        }
        
        localStorage.setItem('rental_requests', JSON.stringify(sampleRequests));
        allRequests = sampleRequests;
      }
      
      const myRequests = allRequests.filter(request => 
        myListings.some(listing => listing.id === request.listingId)
      );
      setRentalRequests(myRequests);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'active': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const handleEditListing = (listing) => {
    setCurrentView('edit-vehicle');
    // You can pass the listing data to edit form
  };

  const handleDeleteListing = (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const allListings = JSON.parse(localStorage.getItem('gorent_listings') || '[]');
      const updatedListings = allListings.filter(listing => listing.id !== listingId);
      localStorage.setItem('gorent_listings', JSON.stringify(updatedListings));
      
      // Update user listings
      const myListings = updatedListings.filter(listing => 
        listing.ownerEmail === currentUser.email || listing.ownerId === currentUser.id
      );
      setUserListings(myListings);
    }
  };

  const handleRequestAction = (requestId, action) => {
    const allRequests = JSON.parse(localStorage.getItem('rental_requests') || '[]');
    const updatedRequests = allRequests.map(request => 
      request.id === requestId ? { ...request, status: action } : request
    );
    localStorage.setItem('rental_requests', JSON.stringify(updatedRequests));
    
    // Update state
    const myRequests = updatedRequests.filter(request => 
      userListings.some(listing => listing.id === request.listingId)
    );
    setRentalRequests(myRequests);
  };

  if (loading) {
    return (
      <div className="dashboard-main-layout">
        <DashboardSidebar />
        <div className="dashboard-content-area">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-main-layout">
      <DashboardSidebar />
      <div className="dashboard-content-area">
        {currentView === 'dashboard' && (
          <DashboardView 
            userListings={userListings}
            rentalRequests={rentalRequests}
            currentUser={currentUser}
            onAddVehicle={() => setCurrentView('add-vehicle')}
            onEditListing={handleEditListing}
            onDeleteListing={handleDeleteListing}
            onRequestAction={handleRequestAction}
            getStatusColor={getStatusColor}
          />
        )}
        
        {currentView === 'add-vehicle' && (
          <AddVehicleForm 
            currentUser={currentUser}
            onBack={() => setCurrentView('dashboard')}
            onSuccess={() => {
              setCurrentView('dashboard');
              loadUserData(currentUser);
            }}
          />
        )}
        
        {currentView === 'edit-vehicle' && (
          <EditVehicleForm 
            onBack={() => setCurrentView('dashboard')}
            onSuccess={() => {
              setCurrentView('dashboard');
              loadUserData(currentUser);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Dashboard View Component
function DashboardView({ 
  userListings, 
  rentalRequests, 
  currentUser, 
  onAddVehicle, 
  onEditListing, 
  onDeleteListing,
  onRequestAction,
  getStatusColor 
}) {
  const [activeTab, setActiveTab] = useState('listings');

  return (
    <>
      <div className="post-rent-header">
        <div>
          <h1>My Rental Business</h1>
          <p>Welcome {currentUser.name} | Manage your vehicles and rental requests</p>
        </div>
        <button className="add-vehicle-btn" onClick={onAddVehicle}>
          + Add New Vehicle
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Vehicles</h3>
          <p className="stat-number">{userListings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Listings</h3>
          <p className="stat-number">{userListings.filter(l => l.status === 'approved').length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approval</h3>
          <p className="stat-number">{userListings.filter(l => l.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <h3>Rental Requests</h3>
          <p className="stat-number">{rentalRequests.filter(r => r.status === 'pending').length}</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          My Listings ({userListings.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Rental Requests ({rentalRequests.filter(r => r.status === 'pending').length})
        </button>
      </div>

      {activeTab === 'listings' && (
        <MyListingsTab 
          userListings={userListings}
          onEditListing={onEditListing}
          onDeleteListing={onDeleteListing}
          getStatusColor={getStatusColor}
        />
      )}

      {activeTab === 'requests' && (
        <RentalRequestsTab 
          rentalRequests={rentalRequests}
          userListings={userListings}
          onRequestAction={onRequestAction}
          getStatusColor={getStatusColor}
        />
      )}
    </>
  );
}

// My Listings Tab Component
function MyListingsTab({ userListings, onEditListing, onDeleteListing, getStatusColor }) {
  if (userListings.length === 0) {
    return (
      <div className="empty-state">
        <h3>No vehicles listed yet</h3>
        <p>Start earning by listing your first vehicle!</p>
      </div>
    );
  }

  return (
    <div className="listings-grid">
      {userListings.map(listing => (
        <div key={listing.id} className="my-listing-card">
          <div className="listing-header">
            <h3>{listing.title}</h3>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(listing.status) }}
            >
              {listing.status.toUpperCase()}
            </span>
          </div>
          
          <div className="listing-info">
            <p><strong>Type:</strong> {listing.type}</p>
            <p><strong>Model:</strong> {listing.brand} {listing.model} ({listing.year})</p>
            <p><strong>Price:</strong> ₹{listing.pricePerDay}/day</p>
            <p><strong>Location:</strong> {listing.location}</p>
            <p><strong>Submitted:</strong> {listing.submittedDate}</p>
          </div>

          <div className="listing-actions">
            <button 
              className="action-btn edit-btn"
              onClick={() => onEditListing(listing)}
            >
              Edit
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={() => onDeleteListing(listing.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Rental Requests Tab Component
function RentalRequestsTab({ rentalRequests, userListings, onRequestAction, getStatusColor }) {
  if (rentalRequests.length === 0) {
    return (
      <div className="empty-state">
        <h3>No rental requests yet</h3>
        <p>Requests for your vehicles will appear here.</p>
      </div>
    );
  }

  return (
    <div className="requests-list">
      {rentalRequests.map(request => {
        const listing = userListings.find(l => l.id === request.listingId);
        return (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <div>
                <h4>{listing?.title || 'Unknown Vehicle'}</h4>
                <p className="request-details">
                  Requested by: <strong>{request.renterName}</strong> | 
                  Duration: <strong>{request.startDate} to {request.endDate}</strong>
                </p>
              </div>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(request.status) }}
              >
                {request.status.toUpperCase()}
              </span>
            </div>
            
            <div className="request-info">
              <p><strong>Contact:</strong> {request.renterEmail} | {request.renterPhone}</p>
              <p><strong>Total Amount:</strong> ₹{request.totalAmount}</p>
              <p><strong>Message:</strong> {request.message || 'No message'}</p>
            </div>

            {request.status === 'pending' && (
              <div className="request-actions">
                <button 
                  className="action-btn approve-btn"
                  onClick={() => onRequestAction(request.id, 'approved')}
                >
                  Approve
                </button>
                <button 
                  className="action-btn reject-btn"
                  onClick={() => onRequestAction(request.id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Add Vehicle Form Component
function AddVehicleForm({ currentUser, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'Car',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    condition: 'Excellent',
    location: '',
    pricePerHour: '',
    pricePerDay: '',
    pricePerWeek: '',
    description: '',
    features: [],
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    photos: []
  });

  const [availableFeatures] = useState([
    'AC', 'Automatic', 'GPS', 'Bluetooth', 'Power Steering', 'ABS', 'Airbags',
    'Music System', 'Power Windows', 'Central Lock', 'Leather Seats', 'Sunroof'
  ]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload to a server and get URLs
    // For now, we'll use placeholder URLs
    const photoUrls = files.map((file, index) => `photo_${Date.now()}_${index}.jpg`);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls].slice(0, 5) // Max 5 photos
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.brand || !formData.model || !formData.location || !formData.pricePerDay) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Generate new listing
      const newListing = {
        id: Date.now(),
        title: `${formData.brand} ${formData.model} - ${formData.type} Rental`,
        ...formData,
        ownerName: currentUser.name,
        ownerEmail: currentUser.email,
        ownerPhone: currentUser.mobile,
        ownerId: currentUser.id,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        documents: ['RC', 'Insurance', 'PUC'] // Default documents
      };

      // Save to localStorage
      const allListings = JSON.parse(localStorage.getItem('gorent_listings') || '[]');
      allListings.push(newListing);
      localStorage.setItem('gorent_listings', JSON.stringify(allListings));

      setLoading(false);
      alert('Vehicle listed successfully! It will be reviewed by admin before going live.');
      onSuccess();
    } catch (error) {
      setError('Failed to submit listing. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-container">
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        <h2>Add New Vehicle for Rent</h2>
      </div>

      <form onSubmit={handleSubmit} className="add-vehicle-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Vehicle Type *</label>
              <select 
                value={formData.type} 
                onChange={(e) => handleInputChange('type', e.target.value)}
                required
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div className="form-group">
              <label>Brand *</label>
              <input 
                type="text" 
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="e.g., Honda, Maruti, Royal Enfield"
                required
              />
            </div>

            <div className="form-group">
              <label>Model *</label>
              <input 
                type="text" 
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., City, Swift, Classic 350"
                required
              />
            </div>

            <div className="form-group">
              <label>Year</label>
              <input 
                type="number" 
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="1990"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="form-group">
              <label>Condition</label>
              <select 
                value={formData.condition} 
                onChange={(e) => handleInputChange('condition', e.target.value)}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Vehicle Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Fuel Type</label>
              <select 
                value={formData.fuelType} 
                onChange={(e) => handleInputChange('fuelType', e.target.value)}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transmission</label>
              <select 
                value={formData.transmission} 
                onChange={(e) => handleInputChange('transmission', e.target.value)}
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="form-group">
              <label>Seating Capacity</label>
              <input 
                type="number" 
                value={formData.seatingCapacity}
                onChange={(e) => handleInputChange('seatingCapacity', parseInt(e.target.value))}
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Pricing</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Price per Hour (₹)</label>
              <input 
                type="number" 
                value={formData.pricePerHour}
                onChange={(e) => handleInputChange('pricePerHour', e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="form-group">
              <label>Price per Day (₹) *</label>
              <input 
                type="number" 
                value={formData.pricePerDay}
                onChange={(e) => handleInputChange('pricePerDay', e.target.value)}
                placeholder="2000"
                required
              />
            </div>

            <div className="form-group">
              <label>Price per Week (₹)</label>
              <input 
                type="number" 
                value={formData.pricePerWeek}
                onChange={(e) => handleInputChange('pricePerWeek', e.target.value)}
                placeholder="12000"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Features</h3>
          <div className="features-grid">
            {availableFeatures.map(feature => (
              <label key={feature} className="feature-checkbox">
                <input 
                  type="checkbox" 
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Photos</h3>
          <div className="photo-upload">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handlePhotoUpload}
              className="photo-input"
            />
            <p className="photo-note">Upload up to 5 photos (JPG, PNG)</p>
            {formData.photos.length > 0 && (
              <div className="uploaded-photos">
                <p>{formData.photos.length} photo(s) uploaded</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Description</h3>
          <textarea 
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your vehicle, its condition, and any special notes for renters..."
            rows={4}
            className="description-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Submitting...' : 'List Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Edit Vehicle Form Component (simplified for now)
function EditVehicleForm({ onBack, onSuccess }) {
  return (
    <div className="edit-vehicle-container">
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        <h2>Edit Vehicle Listing</h2>
      </div>
      <div className="coming-soon">
        <h3>Edit functionality coming soon!</h3>
        <p>For now, you can delete and re-create listings.</p>
        <button onClick={onBack} className="back-btn-alt">Go Back</button>
      </div>
    </div>
  );
}
