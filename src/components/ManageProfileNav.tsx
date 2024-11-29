import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

const ManageProfileNav: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    //ManageNav component
    return (
        <ul className="nav nav-pills flex-colum">
            <li className="nav-item">
                <NavLink
                    to="/profile"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Profile
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                    to="/change-email"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Email
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                    to="/change-password"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Password
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink
                    to="/delete-personal-data"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Personal Data
                </NavLink>
            </li>
        </ul>
    );
};

export default ManageProfileNav;