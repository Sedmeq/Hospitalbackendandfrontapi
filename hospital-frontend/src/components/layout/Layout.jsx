// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import './Layout.css';

// const Layout = ({ children }) =>
// {
//     const { user, logout, hasRole } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [sidebarOpen, setSidebarOpen] = useState(true);

//     const handleLogout = async () =>
//     {
//         await logout();
//         navigate('/login');
//         //window.location.href = "http://127.0.0.1:5500/index.html";

//     };

//     const handleGoToWebsite = () =>
//     {
//         window.location.href = "http://127.0.0.1:5500/index.html";
//     };




//     const menuItems = [
//         { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'Doctor', 'Patient'] },
//         { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️', roles: ['Admin'] },
//         { path: '/patients', label: 'Patients', icon: '🏥', roles: ['Admin', 'Doctor'] },
//         { path: '/appointments', label: 'Appointments', icon: '📅', roles: ['Admin', 'Doctor', 'Patient'] },
//         { path: '/departments', label: 'Departments', icon: '🏢', roles: ['Admin'] },
//         { path: '/nurses', label: 'Nurses', icon: '👩‍⚕️', roles: ['Admin'] },
//         { path: '/pharmacists', label: 'Pharmacists', icon: '💊', roles: ['Admin'] },
//         { path: '/accountants', label: 'Accountants', icon: '💰', roles: ['Admin'] },
//         { path: '/medicine', label: 'Medicine', icon: '💉', roles: ['Admin', 'Pharmacist'] },
//         { path: '/prescriptions', label: 'Prescriptions', icon: '📋', roles: ['Admin', 'Doctor', 'Pharmacist'] },
//         { path: '/admin/users', label: 'User Management', icon: '👥', roles: ['Admin'] },
//         { path: '/chat', label: 'AI Assistant', icon: '🤖', roles: ['Admin', 'Doctor', 'Patient'] },

//         { path: "/blogs", label: "Blogs", icon: "📝", roles: ["Admin"] },

//         { path: "/sliders", label: "Sliders", icon: "🖼️", roles: ["Admin"] },
//         { path: "/services", label: "Services", icon: "🛠️", roles: ["Admin"] },
//         { path: '/testimonials', label: 'Testimonials', icon: '💬', roles: ['Admin'] },
//         { path: "/partners", label: "Partners", icon: "🤝", roles: ["Admin"] },
//         { path: "/contacts", label: "Contacts", icon: "☎️", roles: ["Admin"] },
//         { path: "/contact-info", label: "Contact Info", icon: "📞", roles: ["Admin"] },



//         { path: '/about', label: 'About', icon: 'ℹ️', roles: ['Admin'] },





//     ];

//     const visibleMenuItems = menuItems.filter(item =>
//         !item.roles || item.roles.some(role => hasRole(role))
//     );

//     return (
//         <div className="layout">
//             <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
//                 <div className="sidebar-header">
//                     <h2>🏥 Hospital</h2>
//                     <button
//                         className="sidebar-toggle"
//                         onClick={() => setSidebarOpen(!sidebarOpen)}
//                     >
//                         {sidebarOpen ? '◀' : '▶'}
//                     </button>
//                 </div>

//                 <nav className="sidebar-nav">
//                     {visibleMenuItems.map(item => (
//                         <Link
//                             key={item.path}
//                             to={item.path}
//                             className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
//                         >
//                             <span className="nav-icon">{item.icon}</span>
//                             {sidebarOpen && <span className="nav-label">{item.label}</span>}
//                         </Link>
//                     ))}
//                 </nav>
//             </aside>

//             <div className="main-content">
//                 <header className="header">
//                     <div className="header-left">
//                         <h1 className="page-title">Hospital Management System</h1>
//                     </div>
//                     <div className="header-right">
//                         <div className="user-info">
//                             <span className="user-name">{user?.fullName}</span>
//                             <span className="user-role">{user?.roles?.[0]}</span>
//                         </div>
//                         <button
//                             className="btn btn-primary btn-sm me-2"
//                             onClick={handleGoToWebsite}
//                         >
//                             Website
//                         </button>
//                         <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
//                             Logout
//                         </button>
//                     </div>
//                 </header>

//                 <main className="content">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Layout;
import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { useVideoCallContext } from "../../context/VideoCallContext";
import VideoCallRoom from "../VideoCall/VideoCallRoom"; // path-ını düzəlt
import "./Layout.css";

const Layout = ({ children }) =>
{
    const { user, logout, hasRole } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { incomingCall, activeCall, acceptCall, rejectCall, endCall } = useVideoCallContext();


    // hansı parent açıqdır
    const [openGroups, setOpenGroups] = useState({});

    const toggleGroup = (key) =>
    {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLogout = async () =>
    {
        await logout();
        window.location.href = "/login";
    };

    // const handleGoToWebsite = () =>
    // {
    //     window.location.href = "http://127.0.0.1:5500/index.html";
    // };

    const handleGoToWebsite = () =>
    {
        const token = localStorage.getItem('authToken') || '';
        const fullName = localStorage.getItem('userName') || '';
        const roles = localStorage.getItem('userRoles') || '[]';

        // ✅ FIX: React (localhost:5173) ilə Novena (127.0.0.1:5500) fərqli
        // origin-dir → localStorage paylaşılmır. Token MÜTLƏQ URL hash ilə
        // ötürülməlidir (api-config.js bunu oxuyub öz localStorage-ına yazır).
        const url =
            'http://127.0.0.1:5500/index.html' +
            `#token=${encodeURIComponent(token)}` +
            `&name=${encodeURIComponent(fullName)}` +
            `&roles=${encodeURIComponent(roles)}`;

        window.location.href = url;
    };

    // ✅ Tree menu
    const menuItems = useMemo(
        () => [
            { path: "/dashboard", label: "Dashboard", icon: "📊", roles: ["Admin", "Doctor", "Patient"] },
            // 👇 GROUP (Home / Website Content)
            {
                key: "home",
                label: "Home",
                icon: "🏠",
                roles: ["Admin"],
                children: [

                    { path: "/sliders", label: "Sliders", icon: "🖼️", roles: ["Admin"] },
                    { path: "/services", label: "Services", icon: "🛠️", roles: ["Admin"] },
                    { path: "/testimonials", label: "Testimonials", icon: "💬", roles: ["Admin"] },
                    { path: "/partners", label: "Partners", icon: "🤝", roles: ["Admin"] },

                    { path: "/contact-info", label: "Contact Info", icon: "📞", roles: ["Admin"] },
                    { path: "/about", label: "About", icon: "ℹ️", roles: ["Admin"] },
                    { path: "/about-sections", label: "About Sections", icon: "📌", roles: ["Admin"] },
                    { path: "/faqs", label: "FAQs", icon: "❓", roles: ["Admin"] },

                ],
            },
            { path: "/appointments", label: "Appointments", icon: "📅", roles: ["Admin", "Doctor", "Patient"] },
            { path: "/lab-results", label: "Lab Results", icon: "🧪", roles: ["Admin", "Doctor", "Patient"] },
            { path: "/chat", label: "AI Assistant", icon: "🤖", roles: ["Admin", "Doctor", "Patient"] },


            { path: "/blogs", label: "Blogs", icon: "📝", roles: ["Admin"] },
            { path: "/contacts", label: "Contacts", icon: "☎️", roles: ["Admin"] },
            { path: "/doctors", label: "Doctors", icon: "👨‍⚕️", roles: ["Admin"] },
            { path: "/patients", label: "Patients", icon: "🏥", roles: ["Admin", "Doctor"] },
            { path: "/departments", label: "Departments", icon: "🏢", roles: ["Admin"] },
            // { path: "/nurses", label: "Nurses", icon: "👩‍⚕️", roles: ["Admin"] },
            // { path: "/pharmacists", label: "Pharmacists", icon: "💊", roles: ["Admin"] },
            //{ path: "/accountants", label: "Accountants", icon: "💰", roles: ["Admin"] },
            //{ path: "/medicine", label: "Medicine", icon: "💉", roles: ["Admin", "Pharmacist"] },
            // { path: "/prescriptions", label: "Prescriptions", icon: "📋", roles: ["Admin", "Doctor", "Pharmacist"] },
            { path: "/admin/users", label: "User Management", icon: "👥", roles: ["Admin"] },
            // { path: "/settings/change-password", label: "Settings", icon: "⚙️", roles: ["Admin", "Doctor", "Patient"] },
            { path: "/settings", label: "Settings", icon: "⚙️", roles: ["Admin", "Doctor", "Patient"] },

        ],
        []
    );

    const canSee = (item) => !item.roles || item.roles.some((r) => hasRole(r));

    // Group-un içində aktiv route varsa, onu “active” say (istəsən auto-open da edə bilərik)
    const isChildActive = (children = []) => children.some((c) => location.pathname === c.path);

    return (
        <div className="layout">
            <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-header">
                    <h2>🏥 Hospital</h2>
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? "◀" : "▶"}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems
                        .filter(canSee)
                        .map((item) =>
                        {
                            // GROUP RENDER
                            if (item.children)
                            {
                                const visibleChildren = item.children.filter(canSee);
                                if (visibleChildren.length === 0) return null;

                                const groupOpen = !!openGroups[item.key];
                                const groupActive = isChildActive(visibleChildren);

                                return (
                                    <div key={item.key} className={`nav-group ${groupActive ? "active" : ""}`}>
                                        <button
                                            type="button"
                                            className={`nav-item nav-group-btn ${groupOpen ? "open" : ""}`}
                                            onClick={() => toggleGroup(item.key)}
                                        >
                                            <span className="nav-icon">{item.icon}</span>
                                            {sidebarOpen && (
                                                <>
                                                    <span className="nav-label">{item.label}</span>
                                                    <span className="nav-caret">{groupOpen ? "▾" : "▸"}</span>
                                                </>
                                            )}
                                        </button>

                                        {groupOpen && sidebarOpen && (
                                            <ul className="submenu">
                                                {visibleChildren.map((child) => (
                                                    <li key={child.path}>
                                                        <Link
                                                            to={child.path}
                                                            className={`submenu-item ${location.pathname === child.path ? "active" : ""}`}
                                                        >
                                                            <span className="nav-icon">{child.icon}</span>
                                                            <span className="nav-label">{child.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            }

                            // NORMAL LINK
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    {sidebarOpen && <span className="nav-label">{item.label}</span>}
                                </Link>
                            );
                        })}
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
                        <button className="btn btn-primary btn-sm me-2" onClick={handleGoToWebsite}>
                            Website
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="content">{children}</main>
            </div>
            {/* Incoming Call Modal */}
            {incomingCall && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 99999,
                    background: "rgba(0,0,0,0.7)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        background: "#fff", borderRadius: 16, padding: 40,
                        textAlign: "center", minWidth: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📞</div>
                        <h2 style={{ marginBottom: 8 }}>Gələn Zəng</h2>
                        <p style={{ color: "#666", marginBottom: 24 }}>
                            <strong>{incomingCall.callerName}</strong> sizi video görüşə dəvət edir
                        </p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button onClick={rejectCall} style={{
                                padding: "12px 24px", background: "#ef4444",
                                color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16
                            }}>
                                ❌ Rədd et
                            </button>
                            <button onClick={acceptCall} style={{
                                padding: "12px 24px", background: "#22c55e",
                                color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16
                            }}>
                                ✅ Qəbul et
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Call Overlay */}
            {activeCall && (
                <div style={{ position: "fixed", inset: 0, zIndex: 99998 }}>
                    <VideoCallRoom
                        appointmentId={activeCall.appointmentId}
                        onClose={endCall}
                    />
                </div>
            )}
        </div>
    );
};

export default Layout;
