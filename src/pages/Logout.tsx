import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            // Clear the JWT token from localStorage
            localStorage.removeItem('token');
            // Redirect the user to the home page
            navigate('/');
        } else {
            // If no token is found, redirect the user to the home page
            navigate('/');
        }
    }, [navigate]);

    return null; // No UI is needed for the logout process
};

export default Logout;
