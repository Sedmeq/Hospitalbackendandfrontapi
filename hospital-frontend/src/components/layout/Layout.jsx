import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) =>
{
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () =>
    {
        await logout();
        // Redirect to external URL after logout
        window.location.href = 'http://127.0.0.1:5500/novena/index.html';
    };

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'Doctor', 'Patient'] },
        { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️', roles: ['Admin'] },
        { path: '/patients', label: 'Patients', icon: '🏥', roles: ['Admin', 'Doctor'] },
        { path: '/appointments', label: 'Appointments', icon: '📅', roles: ['Admin', 'Doctor', 'Patient'] },
        { path: '/departments', label: 'Departments', icon: '🏢', roles: ['Admin'] },
        { path: '/nurses', label: 'Nurses', icon: '👩‍⚕️', roles: ['Admin'] },
        { path: '/pharmacists', label: 'Pharmacists', icon: '💊', roles: ['Admin'] },
        { path: '/accountants', label: 'Accountants', icon: '💰', roles: ['Admin'] },
        { path: '/medicine', label: 'Medicine', icon: '💉', roles: ['Admin', 'Pharmacist'] },
        { path: '/prescriptions', label: 'Prescriptions', icon: '📋', roles: ['Admin', 'Doctor', 'Pharmacist'] },
        { path: '/admin/users', label: 'User Management', icon: '👥', roles: ['Admin'] },
        { path: '/chat', label: 'AI Assistant', icon: '🤖', roles: ['Admin', 'Doctor', 'Patient'] },
    ];

    const visibleMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.some(role => hasRole(role))
    );

    return (
        <div className="layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>🏥 Hospital</h2>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {visibleMenuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {sidebarOpen && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h1 className="page-title">Hospital Management System</h1>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <span className="user-name">{user?.fullName}</span>
                            <span className="user-role">{user?.roles?.[0]}</span>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
