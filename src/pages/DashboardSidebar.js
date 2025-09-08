import React from 'react';
import './DashboardSidebar.css';

const sidebarItems = [
  { icon: '🏠', label: 'Dashboard', hash: '#/admin-dashboard' },
  { icon: '📊', label: 'Statistics', hash: '#/admin-dashboard/statistics' },
  { icon: '📅', label: 'Bookings', hash: '#/admin-dashboard/bookings' },
  { icon: '🚗', label: 'Drivers', hash: '#/admin-dashboard/drivers' },
  { icon: '💳', label: 'Transactions', hash: '#/admin-dashboard/transactions' },
  { icon: '💬', label: 'Messages', hash: '#/admin-dashboard/messages', badge: true },
  { icon: '❓', label: 'Help', hash: '#/admin-dashboard/help' },
  { icon: '📄', label: 'Report', hash: '#/admin-dashboard/report' },
  { icon: '⚙️', label: 'Settings', hash: '#/admin-dashboard/settings' },
];

export default function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">Rentable</div>
      <div className="sidebar-search">
        <input type="text" placeholder="Search here..." />
      </div>
      <nav className="sidebar-nav">
        {sidebarItems.map(item => (
          <div
            key={item.label}
            className={`sidebar-item${window.location.hash === item.hash ? ' active' : ''}`}
            onClick={() => (window.location.hash = item.hash)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="sidebar-badge"></span>}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">Patent Scott</div>
    </aside>
  );
}
