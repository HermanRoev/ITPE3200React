import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import icon from '../assets/images/icon.png';
import { useAuth} from "../Context/AuthContext";

const Navbar: React.FC = () => {
const { isAuthenticated } = useAuth();

    return (
        <header className="sticky-top p-0">
            <nav
                className="navbar navbar-expand-lg navbar-light py-1 mb-0"
                style={{
                    boxShadow: '0 6px 8px -4px lightblue',
                    backgroundColor: '#1A1A1A',
                }}
            >
                <div className="container-fluid">
                    {/* Logo */}
                    <Link to="/" className="navbar-brand text-white fs-4 px-3 d-flex align-items-center">
                        <img
                            src={icon}
                            alt="Kage Icon"
                            style={{
                                height: '1.2em',
                                marginRight: '0.5em',
                            }}
                        />
                        <span>Kage</span>
                    </Link>

                    {/* Toggle Button for Mobile */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list text-white"></i>
                    </button>

                    {/* Navigation Links */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {/* Large Screen Navbar Links */}
                            {isAuthenticated ? (
                                <>
                                    <li className="nav-item d-none d-lg-block">
                                        <Link to="/settings" className="nav-link text-white">
                                            <i className="bi bi-gear"></i>
                                        </Link>
                                    </li>
                                    <li className="nav-item d-none d-lg-block">
                                        <Link to="/createpost" className="nav-link text-white d-flex align-items-center">
                                            <i className="bi bi-plus-circle"></i>
                                        </Link>
                                    </li>
                                    <li className="nav-item d-none d-lg-block">
                                        <Link to="/profile" className="nav-link text-white">
                                            <i className="bi bi-person"></i>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item">
                                    <Link to="/welcome" className="nav-link text-white">
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>

                        {/* Dropdown Menu for Small/Medium Screens */}
                        {isAuthenticated && (
                            <ul className="navbar-nav d-lg-none">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link text-white">
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/profile" className="nav-link text-white">
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/savedposts" className="nav-link text-white">
                                        Saved
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/createpost" className="nav-link text-white">
                                        Create
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/settings" className="nav-link text-white">
                                        Settings
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;