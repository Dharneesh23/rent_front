import React from 'react';
import './AdminDashboard.css';
import DashboardSidebar from './DashboardSidebar';

export default function AdminDashboard() {
  return (
    <div className="dashboard-main-layout">
      <DashboardSidebar />
      <div className="dashboard-content-area">
        <div className="dashboard-welcome">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="dashboard-widgets-grid">
          <WidgetCard title="User Management" desc="Manage users, roles, and permissions." icon="👤" />
          <WidgetCard title="Listing Management" desc="Manage car and bike listings." icon="🚗" />
          <WidgetCard title="Rental Transactions" desc="View and manage all rental transactions." icon="💳" />
          <WidgetCard title="Content & Security" desc="Edit content, manage security settings." icon="🔒" />
          <WidgetCard title="Analytics & Reports" desc="View analytics and generate reports." icon="📊" />
          <WidgetCard title="System Configuration" desc="Configure system settings and preferences." icon="⚙️" />
        </div>
      </div>
    </div>
  );
}

function WidgetCard({ title, desc, icon }) {
  const handleClick = () => {
    if (title === 'User Management') {
      window.location.hash = '#/user-management';
    } else if (title === 'Listing Management') {
      window.location.hash = '#/listing-management';
    } else if (title === 'Rental Transactions') {
      window.location.hash = '#/rental-transactions';
    }
    // Add more navigation logic for other widgets as needed
  };

  return (
    <div className="dashboard-widget-card">
      <div className="widget-icon">{icon}</div>
      <div className="widget-info">
        <h2>{title}</h2>
        <p>{desc}</p>
        <button className="dashboard-btn" onClick={handleClick}>Go to {title}</button>
      </div>
    </div>
  );
}
