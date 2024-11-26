import React from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu: React.FC = () => {
    const isLoggedIn = localStorage.getItem('token'); // Simplified; replace with actual authentication check.

    return (
        <div className="side-menu">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <i className="bi bi-house-door"></i> Home
                    </Link>
                </li>
                {isLoggedIn ? (
                    <>
                        <li className="nav-item">
                            <Link to="/profile" className="nav-link">
                                <i className="bi bi-person"></i> Profile
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/saved" className="nav-link">
                                <i className="bi bi-bookmark"></i> Saved
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/settings" className="nav-link">
                                <i className="bi bi-gear"></i> Settings
                            </Link>
                        </li>
                    </>
                ) : (
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">
                            <i className="bi bi-box-arrow-in-right"></i> Login
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default SideMenu;