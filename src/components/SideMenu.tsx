import { useAuth } from '../context/AuthContext';
import './SideMenu.css';
import React from "react";
import { NavLink } from "react-router-dom";


const SideMenu: React.FC = () => {
    const { isAuthenticated, userProfile } = useAuth();

    return (
        <div className="side-menu position-fixed">
            {/* Profile Section */}
            <div className="profile-section">
                {userProfile ? (
                    <div className="profile-pic-container">
                        <img
                            src={userProfile.profilePictureUrl}
                            alt="Profile"
                            className="profile-pic"
                        />
                    </div>
                ) : (
                    <div className="default-profile-icon">
                        <i className="bi bi-person-circle"></i>
                    </div>
                )}
                <div className="profile-info">
                    <h5 className="profile-name">{userProfile ? userProfile.username : "Guest"}</h5>
                </div>
            </div>

            {/* Navigation Menu */}
            <ul className="nav flex-column menu-list">
                <li className="nav-item">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <i className="bi bi-house-door"></i> Home
                    </NavLink>
                </li>
                {isAuthenticated ? (
                    <>
                        <li className="nav-item">
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                <i className="bi bi-person"></i> Profile
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/saved"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                <i className="bi bi-bookmark"></i> Saved
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/settings"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                <i className="bi bi-gear"></i> Settings
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li className="nav-item">
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            <i className="bi bi-box-arrow-in-right"></i> Login
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default SideMenu;