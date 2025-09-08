import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'car',
    model: '',
    year: '',
    price: '',
    location: '',
    description: '',
    features: '',
    contactNumber: '',
    images: []
  });

  useEffect(() => {
    // Get current user
    const user = JSON.parse(localStorage.getItem('gorent_current_user') || 'null');
    if (!user) {
      window.location.hash = '#/login';
      return;
    }
    setCurrentUser(user);

    // Create demo users if none exist
    createDemoUsersIfNeeded();

    // Load user's vehicles
    loadUserVehicles(user.id);
  }, []);

  const createDemoUsersIfNeeded = () => {
    const existingUsers = JSON.parse(localStorage.getItem('gorent_users') || '[]');
    if (existingUsers.length === 0 || !existingUsers.find(u => u.username === 'demo')) {
      const demoUsers = [
        {
          id: 'demo_user',
          username: 'demo',
          email: 'demo@example.com',
          mobile: '9876543210',
          password: '123',
          fullName: 'Demo User'
        },
        {
          id: 'user2',
          username: 'john',
          email: 'john@example.com',
          mobile: '9876543211',
          password: '123',
          fullName: 'John Doe'
        }
      ];
      
      const updatedUsers = [...existingUsers, ...demoUsers.filter(newUser => 
        !existingUsers.find(existing => existing.username === newUser.username)
      )];
      localStorage.setItem('gorent_users', JSON.stringify(updatedUsers));
    }
  };

  const loadUserVehicles = (userId) => {
    const allVehicles = JSON.parse(localStorage.getItem('gorent_vehicles') || '[]');
    const userVehicles = allVehicles.filter(vehicle => vehicle.ownerId === userId);
    setUserVehicles(userVehicles);
  };

  const handleLogout = () => {
    localStorage.removeItem('gorent_current_user');
    window.location.hash = '#/login';
  };

  const handleInputChange = (field, value) => {
    setNewVehicle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewVehicle(prev => ({
          ...prev,
          images: [...prev.images, event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setNewVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitVehicle = (e) => {
    e.preventDefault();
    
    if (!newVehicle.name || !newVehicle.model || !newVehicle.price || !newVehicle.location) {
      alert('Please fill in all required fields');
      return;
    }

    const vehicle = {
      id: Date.now(),
      ...newVehicle,
      ownerId: currentUser.id,
      ownerName: currentUser.username,
      ownerEmail: currentUser.email,
      submittedAt: new Date().toISOString(),
      status: 'pending', // Pending admin approval
      features: newVehicle.features.split(',').map(f => f.trim()).filter(f => f)
    };

    // Save to localStorage
    const existingVehicles = JSON.parse(localStorage.getItem('gorent_vehicles') || '[]');
    const updatedVehicles = [...existingVehicles, vehicle];
    localStorage.setItem('gorent_vehicles', JSON.stringify(updatedVehicles));

    // Reset form
    setNewVehicle({
      name: '',
      type: 'car',
      model: '',
      year: '',
      price: '',
      location: '',
      description: '',
      features: '',
      contactNumber: '',
      images: []
    });
    setShowAddForm(false);
    
    // Reload user vehicles
    loadUserVehicles(currentUser.id);
    
    alert('Vehicle submitted successfully! It will be visible after admin approval.');
  };

  const deleteVehicle = (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const allVehicles = JSON.parse(localStorage.getItem('gorent_vehicles') || '[]');
      const updatedVehicles = allVehicles.filter(v => v.id !== vehicleId);
      localStorage.setItem('gorent_vehicles', JSON.stringify(updatedVehicles));
      loadUserVehicles(currentUser.id);
    }
  };

  const startEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      name: vehicle.name,
      type: vehicle.type,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      location: vehicle.location,
      description: vehicle.description || '',
      features: vehicle.features ? vehicle.features.join(', ') : '',
      contactNumber: vehicle.contactNumber || '',
      images: vehicle.images || []
    });
    setShowEditForm(true);
  };

  const handleUpdateVehicle = (e) => {
    e.preventDefault();
    
    if (!newVehicle.name || !newVehicle.model || !newVehicle.price || !newVehicle.location) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedVehicle = {
      ...editingVehicle,
      ...newVehicle,
      features: newVehicle.features.split(',').map(f => f.trim()).filter(f => f)
    };

    // Update in localStorage
    const allVehicles = JSON.parse(localStorage.getItem('gorent_vehicles') || '[]');
    const updatedVehicles = allVehicles.map(v => 
      v.id === editingVehicle.id ? updatedVehicle : v
    );
    localStorage.setItem('gorent_vehicles', JSON.stringify(updatedVehicles));

    // Reset form
    setNewVehicle({
      name: '',
      type: 'car',
      model: '',
      year: '',
      price: '',
      location: '',
      description: '',
      features: '',
      contactNumber: '',
      images: []
    });
    setShowEditForm(false);
    setEditingVehicle(null);
    
    // Reload user vehicles
    loadUserVehicles(currentUser.id);
    
    alert('Vehicle updated successfully!');
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingVehicle(null);
    setNewVehicle({
      name: '',
      type: 'car',
      model: '',
      year: '',
      price: '',
      location: '',
      description: '',
      features: '',
      contactNumber: '',
      images: []
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'APPROVED';
      case 'rejected': return 'REJECTED';
      case 'pending': return 'PENDING APPROVAL';
      default: return status.toUpperCase();
    }
  };

  if (!currentUser) {
    return <div className="user-dashboard-loading">Loading...</div>;
  }

  const approvedVehicles = userVehicles.filter(v => v.status === 'approved').length;
  const pendingVehicles = userVehicles.filter(v => v.status === 'pending').length;
  const rejectedVehicles = userVehicles.filter(v => v.status === 'rejected').length;

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="user-dashboard-header">
        <div className="user-dashboard-title">
          <h1>My Rental Business</h1>
          <p>Welcome {currentUser.username} | Manage your vehicles and track your earnings</p>
        </div>
        <div className="user-dashboard-actions">
          <button 
            className="user-dashboard-btn add-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Vehicle
          </button>
          <button 
            className="user-dashboard-btn logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="user-dashboard-stats">
        <div className="user-stat-card">
          <h3>Total Vehicles</h3>
          <div className="user-stat-number">{userVehicles.length}</div>
        </div>
        <div className="user-stat-card">
          <h3>Approved Listings</h3>
          <div className="user-stat-number">{approvedVehicles}</div>
        </div>
        <div className="user-stat-card">
          <h3>Pending Approval</h3>
          <div className="user-stat-number">{pendingVehicles}</div>
        </div>
        <div className="user-stat-card">
          <h3>Rejected</h3>
          <div className="user-stat-number">{rejectedVehicles}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="user-dashboard-tabs">
        <button 
          className={`user-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          My Vehicles ({userVehicles.length})
        </button>
        <button 
          className={`user-tab ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings
        </button>
      </div>

      {/* Content */}
      <div className="user-dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="user-vehicles-section">
            {userVehicles.length === 0 ? (
              <div className="user-no-vehicles">
                <h3>No vehicles uploaded yet</h3>
                <p>Click "Add New Vehicle" to start earning from your vehicles!</p>
              </div>
            ) : (
              <div className="user-vehicles-grid">
                {userVehicles.map(vehicle => (
                  <div key={vehicle.id} className="user-vehicle-card">
                    <div className="user-vehicle-status">
                      <span 
                        className="user-status-badge"
                        style={{ backgroundColor: getStatusColor(vehicle.status) }}
                      >
                        {getStatusText(vehicle.status)}
                      </span>
                    </div>
                    {vehicle.images && vehicle.images.length > 0 && (
                      <img 
                        src={vehicle.images[0]} 
                        alt={vehicle.name}
                        className="user-vehicle-image"
                      />
                    )}
                    <div className="user-vehicle-details">
                      <h3>{vehicle.name}</h3>
                      <p><strong>Type:</strong> {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</p>
                      <p><strong>Model:</strong> {vehicle.model} ({vehicle.year})</p>
                      <p><strong>Price:</strong> ₹{vehicle.price}/day</p>
                      <p><strong>Location:</strong> {vehicle.location}</p>
                      <p><strong>Submitted:</strong> {new Date(vehicle.submittedAt).toLocaleDateString()}</p>
                      {vehicle.status === 'rejected' && vehicle.rejectionReason && (
                        <div className="user-rejection-reason">
                          <strong>Rejection Reason:</strong> {vehicle.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="user-vehicle-actions">
                      <button 
                        className="user-action-btn edit-btn"
                        onClick={() => startEditVehicle(vehicle)}
                      >
                        Edit
                      </button>
                      <button 
                        className="user-action-btn delete-btn"
                        onClick={() => deleteVehicle(vehicle.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="user-earnings-section">
            <h3>Earnings Dashboard</h3>
            <p>Earnings tracking feature coming soon!</p>
            <div className="user-earnings-placeholder">
              <div className="user-earnings-card">
                <h4>This Month</h4>
                <div className="user-earnings-amount">₹0</div>
              </div>
              <div className="user-earnings-card">
                <h4>Total Earnings</h4>
                <div className="user-earnings-amount">₹0</div>
              </div>
              <div className="user-earnings-card">
                <h4>Pending Payment</h4>
                <div className="user-earnings-amount">₹0</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddForm && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <div className="user-modal-header">
              <h2>Add New Vehicle</h2>
              <button 
                className="user-modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form className="user-add-form" onSubmit={handleSubmitVehicle}>
              <div className="user-form-row">
                <div className="user-form-group">
                  <label>Vehicle Name *</label>
                  <input
                    type="text"
                    value={newVehicle.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Honda City Premium"
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label>Type *</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <label>Model *</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Honda City"
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2023"
                    min="1900"
                    max="2025"
                  />
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <label>Price per Day (₹) *</label>
                  <input
                    type="number"
                    value={newVehicle.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="2500"
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={newVehicle.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Mumbai, Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="user-form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={newVehicle.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  placeholder="9876543210"
                />
              </div>

              <div className="user-form-group">
                <label>Description</label>
                <textarea
                  value={newVehicle.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your vehicle, its condition, any special features..."
                  rows="3"
                />
              </div>

              <div className="user-form-group">
                <label>Features (comma separated)</label>
                <input
                  type="text"
                  value={newVehicle.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="AC, GPS, Bluetooth, Automatic"
                />
              </div>

              <div className="user-form-group">
                <label>Vehicle Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newVehicle.images.length > 0 && (
                  <div className="user-image-preview">
                    {newVehicle.images.map((image, index) => (
                      <div key={index} className="user-image-item">
                        <img src={image} alt={`Vehicle ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="user-remove-image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="user-form-actions">
                <button
                  type="button"
                  className="user-form-btn cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="user-form-btn submit-btn"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditForm && editingVehicle && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <div className="user-modal-header">
              <h2>Edit Vehicle</h2>
              <button 
                className="user-modal-close"
                onClick={cancelEdit}
              >
                ×
              </button>
            </div>
            <form className="user-add-form" onSubmit={handleUpdateVehicle}>
              <div className="user-form-row">
                <div className="user-form-group">
                  <label>Vehicle Name *</label>
                  <input
                    type="text"
                    value={newVehicle.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Honda City Premium"
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label>Type *</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <label>Model *</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Honda City"
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2023"
                    min="1900"
                    max="2025"
                  />
                </div>
              </div>

              <div className="user-form-row">
                <div className="user-form-group">
                  <label>Price per Day (₹) *</label>
                  <input
                    type="number"
                    value={newVehicle.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="2500"
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={newVehicle.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Mumbai, Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="user-form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={newVehicle.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  placeholder="9876543210"
                />
              </div>

              <div className="user-form-group">
                <label>Description</label>
                <textarea
                  value={newVehicle.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your vehicle, its condition, any special features..."
                  rows="3"
                />
              </div>

              <div className="user-form-group">
                <label>Features (comma separated)</label>
                <input
                  type="text"
                  value={newVehicle.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="AC, GPS, Bluetooth, Automatic"
                />
              </div>

              <div className="user-form-group">
                <label>Vehicle Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newVehicle.images.length > 0 && (
                  <div className="user-image-preview">
                    {newVehicle.images.map((image, index) => (
                      <div key={index} className="user-image-item">
                        <img src={image} alt={`Vehicle ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="user-remove-image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="user-form-actions">
                <button
                  type="button"
                  className="user-form-btn cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="user-form-btn submit-btn"
                >
                  Update Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
