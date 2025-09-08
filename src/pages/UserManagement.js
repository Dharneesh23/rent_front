import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import './AdminDashboard.css';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    // Load real user data from localStorage
    const loadUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('gorent_users') || '[]');
        
        // Transform the stored user data to match our table format
        const transformedUsers = storedUsers.map((user, index) => ({
          id: index + 1,
          name: user.name || 'Unknown',
          email: user.email || 'No email',
          role: user.role || 'User', // Default role for registered users
          status: user.status || 'Active', // Default status for new registrations
          joinDate: user.joinDate || new Date().toISOString().split('T')[0], // Use today if no join date
          lastLogin: user.lastLogin || 'Never',
          mobile: user.mobile || 'N/A',
          username: user.username || 'N/A'
        }));

        // Add some default admin users if no users exist
        if (transformedUsers.length === 0) {
          transformedUsers.push({
            id: 1,
            name: 'Admin User',
            email: 'admin@gorent.com',
            role: 'Admin',
            status: 'Active',
            joinDate: '2024-01-01',
            lastLogin: new Date().toISOString().split('T')[0],
            mobile: '9999999999',
            username: 'admin'
          });
        }

        setUsers(transformedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
        setLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(loadUsers, 800);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.mobile.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleStatusChange = (userId, newStatus) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    
    // Update localStorage
    try {
      const storedUsers = JSON.parse(localStorage.getItem('gorent_users') || '[]');
      const userIndex = userId - 1; // Assuming ID matches array index
      if (storedUsers[userIndex]) {
        storedUsers[userIndex].status = newStatus;
        localStorage.setItem('gorent_users', JSON.stringify(storedUsers));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    
    // Update localStorage
    try {
      const storedUsers = JSON.parse(localStorage.getItem('gorent_users') || '[]');
      const userIndex = userId - 1; // Assuming ID matches array index
      if (storedUsers[userIndex]) {
        storedUsers[userIndex].role = newRole;
        localStorage.setItem('gorent_users', JSON.stringify(storedUsers));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      // Update localStorage
      try {
        const storedUsers = JSON.parse(localStorage.getItem('gorent_users') || '[]');
        const userIndex = userId - 1; // Assuming ID matches array index
        if (userIndex >= 0 && userIndex < storedUsers.length) {
          storedUsers.splice(userIndex, 1);
          localStorage.setItem('gorent_users', JSON.stringify(storedUsers));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const refreshUserData = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('gorent_users') || '[]');
        const transformedUsers = storedUsers.map((user, index) => ({
          id: index + 1,
          name: user.name || 'Unknown',
          email: user.email || 'No email',
          role: user.role || 'User',
          status: user.status || 'Active',
          joinDate: user.joinDate || new Date().toISOString().split('T')[0],
          lastLogin: user.lastLogin || 'Never',
          mobile: user.mobile || 'N/A',
          username: user.username || 'N/A'
        }));
        setUsers(transformedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error refreshing users:', error);
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="dashboard-main-layout">
      <DashboardSidebar />
      <div className="dashboard-content-area">
        <div className="user-management-header">
          <h1>User Management</h1>
          <p>Manage users, roles, and permissions | Real-time data from registrations</p>
        </div>

          <div className="user-management-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            <button className="add-user-btn" onClick={refreshUserData}>
              Refresh Users
            </button>
          </div>        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="user-name">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.joinDate}</td>
                    <td className="user-actions">
                      <button
                        className="action-btn edit-btn"
                        title="Edit User"
                        onClick={() => alert(`Edit functionality for ${user.name} - Coming Soon!`)}
                      >
                        ✏️
                      </button>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && !loading && (
              <div className="no-users-found">
                {users.length === 0 ? (
                  <div>
                    <p>No registered users found.</p>
                    <p>Users who sign up through the registration page will appear here.</p>
                    <button 
                      onClick={() => window.location.hash = '#/signup'} 
                      className="signup-redirect-btn"
                    >
                      Go to Sign Up Page
                    </button>
                  </div>
                ) : (
                  <p>No users found matching your search criteria.</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="user-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-number">{users.filter(u => u.status === 'Active').length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Users</h3>
            <p className="stat-number">{users.filter(u => u.status === 'Pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Admin Users</h3>
            <p className="stat-number">{users.filter(u => u.role === 'Admin').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}