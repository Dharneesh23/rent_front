import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import './AdminDashboard.css';
import './RentalTransactions.css';

export default function RentalTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = () => {
    setLoading(true);
    try {
      // Load rental requests from localStorage
      const storedRequests = JSON.parse(localStorage.getItem('gorent_rental_requests') || '[]');
      
      // Load completed transactions from localStorage
      const storedTransactions = JSON.parse(localStorage.getItem('gorent_transactions') || '[]');
      
      // Create sample data if none exists
      if (storedRequests.length === 0 && storedTransactions.length === 0) {
        const sampleRequests = [
          {
            id: 1,
            vehicleId: 1,
            vehicleName: '2023 Honda City - Daily Rental',
            vehicleType: 'car',
            ownerId: 'demo_user_1',
            ownerName: 'John Doe',
            ownerEmail: 'john@example.com',
            ownerContact: '9876543210',
            renterId: 'renter_1',
            renterName: 'Alice Johnson',
            renterEmail: 'alice@example.com',
            renterContact: '9876543220',
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            totalDays: 5,
            pricePerDay: 2500,
            totalAmount: 12500,
            status: 'pending',
            requestDate: '2024-12-15T10:30:00Z',
            message: 'Need this car for a family trip to Goa. Will take good care of it.',
            pickupLocation: 'Mumbai Central Station',
            dropLocation: 'Mumbai Central Station'
          },
          {
            id: 2,
            vehicleId: 2,
            vehicleName: 'Royal Enfield Classic 350 - Adventure Ready',
            vehicleType: 'bike',
            ownerId: 'demo_user_2',
            ownerName: 'Jane Smith',
            ownerEmail: 'jane@example.com',
            ownerContact: '9876543211',
            renterId: 'renter_2',
            renterName: 'Bob Wilson',
            renterEmail: 'bob@example.com',
            renterContact: '9876543221',
            startDate: '2024-12-18',
            endDate: '2024-12-20',
            totalDays: 2,
            pricePerDay: 800,
            totalAmount: 1600,
            status: 'approved',
            requestDate: '2024-12-12T14:20:00Z',
            approvedDate: '2024-12-13T09:15:00Z',
            message: 'Planning a weekend ride to Lonavala.',
            pickupLocation: 'Delhi Metro Station',
            dropLocation: 'Delhi Metro Station'
          },
          {
            id: 3,
            vehicleId: 3,
            vehicleName: 'Maruti Swift VDI - Fuel Efficient',
            vehicleType: 'car',
            ownerId: 'demo_user_3',
            ownerName: 'Mike Johnson',
            ownerEmail: 'mike@example.com',
            ownerContact: '9876543212',
            renterId: 'renter_3',
            renterName: 'Carol Davis',
            renterEmail: 'carol@example.com',
            renterContact: '9876543222',
            startDate: '2024-12-10',
            endDate: '2024-12-12',
            totalDays: 2,
            pricePerDay: 2000,
            totalAmount: 4000,
            status: 'rejected',
            requestDate: '2024-12-08T11:45:00Z',
            rejectedDate: '2024-12-09T16:30:00Z',
            rejectionReason: 'Vehicle not available for those dates',
            message: 'Need for office meetings.',
            pickupLocation: 'Pune Railway Station',
            dropLocation: 'Pune Railway Station'
          }
        ];

        const sampleTransactions = [
          {
            id: 101,
            requestId: 4,
            vehicleId: 5,
            vehicleName: 'KTM Duke 390 - Sports Bike',
            vehicleType: 'bike',
            ownerId: 'demo_user_5',
            ownerName: 'Alex Kumar',
            ownerEmail: 'alex@example.com',
            ownerContact: '9876543214',
            renterId: 'renter_4',
            renterName: 'David Brown',
            renterEmail: 'david@example.com',
            renterContact: '9876543223',
            startDate: '2024-12-01',
            endDate: '2024-12-03',
            actualStartDate: '2024-12-01',
            actualEndDate: '2024-12-03',
            totalDays: 2,
            pricePerDay: 1200,
            totalAmount: 2400,
            securityDeposit: 5000,
            status: 'completed',
            paymentStatus: 'paid',
            requestDate: '2024-11-25T10:00:00Z',
            approvedDate: '2024-11-26T09:00:00Z',
            startedDate: '2024-12-01T10:00:00Z',
            completedDate: '2024-12-03T18:00:00Z',
            paymentDate: '2024-12-03T18:30:00Z',
            rating: 5,
            review: 'Great bike, excellent condition. Owner was very cooperative.',
            pickupLocation: 'Chennai Central',
            dropLocation: 'Chennai Central',
            kmStart: 15420,
            kmEnd: 15680,
            totalKm: 260,
            fuelStart: 'Full Tank',
            fuelEnd: 'Full Tank',
            damages: 'None',
            lateFee: 0
          },
          {
            id: 102,
            requestId: 5,
            vehicleId: 1,
            vehicleName: '2023 Honda City - Daily Rental',
            vehicleType: 'car',
            ownerId: 'demo_user_1',
            ownerName: 'John Doe',
            ownerEmail: 'john@example.com',
            ownerContact: '9876543210',
            renterId: 'renter_5',
            renterName: 'Emma White',
            renterEmail: 'emma@example.com',
            renterContact: '9876543224',
            startDate: '2024-11-20',
            endDate: '2024-11-22',
            actualStartDate: '2024-11-20',
            actualEndDate: '2024-11-23',
            totalDays: 2,
            actualDays: 3,
            pricePerDay: 2500,
            totalAmount: 5000,
            extraDayCharge: 2500,
            finalAmount: 7500,
            securityDeposit: 10000,
            status: 'completed',
            paymentStatus: 'paid',
            requestDate: '2024-11-15T14:30:00Z',
            approvedDate: '2024-11-16T10:00:00Z',
            startedDate: '2024-11-20T09:00:00Z',
            completedDate: '2024-11-23T19:00:00Z',
            paymentDate: '2024-11-23T20:00:00Z',
            rating: 4,
            review: 'Good car, returned one day late but owner was understanding.',
            pickupLocation: 'Mumbai Airport',
            dropLocation: 'Mumbai Airport',
            kmStart: 25100,
            kmEnd: 25450,
            totalKm: 350,
            fuelStart: 'Full Tank',
            fuelEnd: '3/4 Tank',
            damages: 'Minor scratch on rear bumper',
            lateFee: 500,
            fuelCharge: 800
          }
        ];

        localStorage.setItem('gorent_rental_requests', JSON.stringify(sampleRequests));
        localStorage.setItem('gorent_transactions', JSON.stringify(sampleTransactions));
        setRentalRequests(sampleRequests);
        setTransactions(sampleTransactions);
      } else {
        setRentalRequests(storedRequests);
        setTransactions(storedTransactions);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading transaction data:', error);
      setRentalRequests([]);
      setTransactions([]);
      setLoading(false);
    }
  };

  const handleApproveRequest = (requestId) => {
    const updatedRequests = rentalRequests.map(request =>
      request.id === requestId
        ? { 
            ...request, 
            status: 'approved', 
            approvedDate: new Date().toISOString() 
          }
        : request
    );
    setRentalRequests(updatedRequests);
    localStorage.setItem('gorent_rental_requests', JSON.stringify(updatedRequests));
  };

  const handleRejectRequest = (requestId, reason) => {
    const updatedRequests = rentalRequests.map(request =>
      request.id === requestId
        ? { 
            ...request, 
            status: 'rejected', 
            rejectedDate: new Date().toISOString(),
            rejectionReason: reason || 'No reason provided'
          }
        : request
    );
    setRentalRequests(updatedRequests);
    localStorage.setItem('gorent_rental_requests', JSON.stringify(updatedRequests));
  };

  const filterData = (data) => {
    return data.filter(item => {
      const matchesSearch = 
        item.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.renterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.renterEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const itemDate = new Date(item.requestDate || item.startedDate);
        const now = new Date();
        switch (dateRange) {
          case 'today':
            matchesDate = itemDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = itemDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = itemDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'active': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'cancelled': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'paid': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      case 'refunded': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const showDetails = (item) => {
    setSelectedTransaction(item);
    setShowModal(true);
  };

  const calculateTotalRevenue = () => {
    return transactions
      .filter(t => t.status === 'completed' && t.paymentStatus === 'paid')
      .reduce((total, t) => total + (t.finalAmount || t.totalAmount), 0);
  };

  const calculateTotalCommission = () => {
    return calculateTotalRevenue() * 0.1; // 10% commission
  };

  const showTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleApprove = (transactionId) => {
    if (activeTab === 'requests') {
      const updatedRequests = rentalRequests.map(req => 
        req.id === transactionId 
          ? { ...req, status: 'approved', approvedDate: new Date().toISOString() }
          : req
      );
      setRentalRequests(updatedRequests);
      localStorage.setItem('gorent_rental_requests', JSON.stringify(updatedRequests));
      alert('Rental request approved successfully!');
    }
  };

  const handleReject = (transactionId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && activeTab === 'requests') {
      const updatedRequests = rentalRequests.map(req => 
        req.id === transactionId 
          ? { 
              ...req, 
              status: 'rejected', 
              rejectedDate: new Date().toISOString(),
              rejectionReason: reason
            }
          : req
      );
      setRentalRequests(updatedRequests);
      localStorage.setItem('gorent_rental_requests', JSON.stringify(updatedRequests));
      alert('Rental request rejected.');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <DashboardSidebar />
        <div className="admin-content">
          <div className="loading-spinner">Loading transaction data...</div>
        </div>
      </div>
    );
  }

  const filteredRequests = filterData(rentalRequests);
  const filteredTransactions = filterData(transactions);
  const filteredData = activeTab === 'requests' ? filteredRequests : filteredTransactions;

  return (
    <div className="rental-transactions">
      <DashboardSidebar />
      <div className="rt-main-content">
        <div className="transactions-header">
          <h1>🚗 Rental Transactions Management</h1>
          <p>Monitor all rental requests, transactions, and revenue with beautiful insights</p>
        </div>

        {/* Statistics Cards */}
        <div className="transactions-stats">
          <div className="stat-card">
            <h3>Total Requests</h3>
            <div className="stat-number">{rentalRequests.length}</div>
            <div className="stat-change">
              Pending: {rentalRequests.filter(r => r.status === 'pending').length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Completed Rentals</h3>
            <div className="stat-number">{transactions.filter(t => t.status === 'completed').length}</div>
            <div className="stat-detail">
              Active: {transactions.filter(t => t.status === 'active').length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <div className="stat-number">₹{calculateTotalRevenue().toLocaleString()}</div>
            <div className="stat-detail">
              Commission: ₹{calculateTotalCommission().toLocaleString()}
            </div>
          </div>
          <div className="stat-card">
            <h3>Success Rate</h3>
            <div className="stat-number">
              {rentalRequests.length > 0 ? 
                Math.round((rentalRequests.filter(r => r.status === 'approved').length / rentalRequests.length) * 100) 
                : 0}%
            </div>
            <div className="stat-detail">
              Approved vs Total
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="rt-tabs">
          <button 
            className={`rt-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            🔄 Rental Requests ({rentalRequests.length})
          </button>
          <button 
            className={`rt-tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            📊 Transaction History ({transactions.length})
          </button>
        </div>

        {/* Filters */}
        <div className="rt-filters">
          <h3>🔍 Advanced Filters</h3>
          <div className="rt-filter-row">
            <div className="rt-filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by vehicle, owner, or renter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="rt-filter-group">
              <label>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="rt-filter-group">
              <label>Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rt-content">
          {loading ? (
            <div className="rt-empty-state">
              <div className="rt-empty-icon">⏳</div>
              <h3>Loading...</h3>
              <p>Please wait while we fetch your data</p>
            </div>
          ) : (
            <div className="rt-transactions-list">
              {filteredData.length === 0 ? (
                <div className="rt-empty-state">
                  <div className="rt-empty-icon">📋</div>
                  <h3>No {activeTab === 'requests' ? 'Rental Requests' : 'Transactions'} Found</h3>
                  <p>No data matches your current filters</p>
                </div>
              ) : (
                filteredData.map(item => (
                  <div key={item.id} className="rt-transaction-card">
                    <div className="rt-card-header">
                      <h3 className="rt-card-title">
                        🚗 {item.vehicleName}
                      </h3>
                      <span className={`rt-card-status status-${item.status}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="rt-card-details">
                      <div className="rt-detail-item">
                        <span className="rt-detail-label">Owner</span>
                        <span className="rt-detail-value">{item.ownerName}</span>
                      </div>
                      <div className="rt-detail-item">
                        <span className="rt-detail-label">Renter</span>
                        <span className="rt-detail-value">{item.renterName}</span>
                      </div>
                      <div className="rt-detail-item">
                        <span className="rt-detail-label">Duration</span>
                        <span className="rt-detail-value">{item.startDate} to {item.endDate}</span>
                      </div>
                      <div className="rt-detail-item">
                        <span className="rt-detail-label">Amount</span>
                        <span className="rt-detail-value">₹{item.totalAmount}</span>
                      </div>
                      {activeTab === 'transactions' && (
                        <div className="rt-detail-item">
                          <span className="rt-detail-label">Payment</span>
                          <span className="rt-detail-value">{item.paymentStatus}</span>
                        </div>
                      )}
                    </div>
                    <div className="rt-card-actions">
                      <button 
                        className="rt-btn rt-btn-view"
                        onClick={() => showTransactionDetails(item)}
                      >
                        View Details
                      </button>
                      {item.status === 'pending' && (
                        <>
                          <button 
                            className="rt-btn rt-btn-approve"
                            onClick={() => handleApprove(item.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="rt-btn rt-btn-reject"
                            onClick={() => handleReject(item.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal for transaction details */}
        {showModal && selectedTransaction && (
          <div className="rt-modal-overlay">
            <div className="rt-modal">
              <div className="rt-modal-header">
                <h2>📊 Transaction Details</h2>
                <button 
                  className="rt-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="rt-modal-content">
                <div className="rt-card-details">
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Transaction ID</span>
                    <span className="rt-detail-value">#{selectedTransaction.id}</span>
                  </div>
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Vehicle</span>
                    <span className="rt-detail-value">{selectedTransaction.vehicleName}</span>
                  </div>
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Owner</span>
                    <span className="rt-detail-value">{selectedTransaction.ownerName}</span>
                  </div>
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Renter</span>
                    <span className="rt-detail-value">{selectedTransaction.renterName}</span>
                  </div>
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Contact</span>
                    <span className="rt-detail-value">{selectedTransaction.renterContact}</span>
                  </div>
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Duration</span>
                    <span className="rt-detail-value">{selectedTransaction.startDate} to {selectedTransaction.endDate}</span>
                  </div>
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Total Amount</span>
                    <span className="rt-detail-value">₹{selectedTransaction.totalAmount}</span>
                  </div>
                  <div className="rt-detail-item">
                    <span className="rt-detail-label">Status</span>
                    <span className="rt-detail-value">{selectedTransaction.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
