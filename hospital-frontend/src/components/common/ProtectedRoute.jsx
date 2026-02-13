import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
// import { useEffect } from "react";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       // React router ilə deyil, birbaşa browser redirect (loop olmur)
//       window.location.replace("http://127.0.0.1:5500/novena/login.html");

//     }
//   }, [token]);

//   if (!token) return null; // redirect edənə qədər boş render
//   return children;
// }
