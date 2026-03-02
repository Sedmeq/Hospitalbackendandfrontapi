// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const ProtectedRoute = ({ children, requiredRole }) => {
//     const { isAuthenticated, hasRole, loading } = useAuth();

//     if (loading) {
//         return (
//             <div className="loading-overlay">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }

//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }

//     if (requiredRole && !hasRole(requiredRole)) {
//         return <Navigate to="/dashboard" replace />;
//     }

//     return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requiredRole }) =>
{
    const { isAuthenticated, hasRole, loading } = useAuth();
    const location = useLocation();

    const storedToken = localStorage.getItem("authToken");
    const authed = isAuthenticated || !!storedToken;

    if (loading && !storedToken)
    {
        return <LoadingSpinner fullScreen />;
    }

    if (!authed)
    {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (requiredRole && !hasRole(requiredRole))
    {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;