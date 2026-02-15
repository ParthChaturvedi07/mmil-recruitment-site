import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const token = localStorage.getItem('token');

    // If user is logged in, redirect to Home
    if (token) {
        return <Navigate to="/" replace />;
    }

    // If not logged in, render child routes (Login/Register)
    return <Outlet />;
};

export default PublicRoute;
