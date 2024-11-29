import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import './ManageProfileNav.css';

const ManageProfileNav: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    //TODO: i want this nav to always display on the page and the sub pages
    // to be displayed on the right side of the page
    //ManageNav component
    return (
        <div className="manage-nav-profile">
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
                <li className="nav-item">
                    <form className="form-inline" onSubmit={handleLogout}>
                        <button
                            type="submit"
                            className="nav-link logout-button"
                            id="logout"
                        >
                            Click here to Logout <i className="bi bi-door-closed"></i>
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    );
};

export default ManageProfileNav;