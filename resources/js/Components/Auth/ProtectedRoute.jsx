// frontend/src/Components/Auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user }) => {
    // If the user object is null, redirect to login page
    if (!user) {
        // You can also pass a state to indicate that they need to log in
        return <Navigate to="/login" replace />;
    }

    // If user is logged in, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
