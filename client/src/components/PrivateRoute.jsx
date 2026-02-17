import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Please login first to access this page.");
            navigate("/", { replace: true });
        }
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    return <Outlet />;
};

export default PrivateRoute;
