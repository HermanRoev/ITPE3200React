import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const isLoggedIn = localStorage.getItem('token'); // Placeholder; replace with actual login check logic.

    return (
        <header className="sticky-top">
            <nav
                className="navbar navbar-expand-md navbar-toggleable-md navbar-light py-1 mb-0"
                style={{
                    boxShadow: '0 6px 8px -4px lightblue',
                    backgroundColor: '#1A1A1A',
                }}
            >
                <div className="container-fluid">
                    {/* Logo */}
                    <Link to="/" className="navbar-brand text-white fs-4 px-3">
                        <img
                            src="/assets/images/icon.png"
                            alt="Kage Icon"
                            style={{
                                height: '1.4em',
                                verticalAlign: 'middle',
                                marginRight: '5px',
                            }}
                        />
                        Kage
                    </Link>

                    {/* Toggle Button for Mobile */}
                    <button
                        className="navbar-toggler collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    {/* Navigation Links */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">
                                    Home
                                </Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/profile" className="nav-link text-white">
                                            Profile
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/logout" className="nav-link text-white">
                                            Logout
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link text-white">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/register" className="nav-link text-white">
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;