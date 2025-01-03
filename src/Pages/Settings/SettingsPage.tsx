import React from "react";
import {NavLink, Route, Routes, useNavigate, Navigate} from "react-router-dom";
import ProfileComponent from "./ProfileComponent";
import EmailComponent from "./EmailComponent";
import PasswordComponent from "./PasswordComponent";
import PersonalDataComponent from "./PersonalDataComponent";
import { useAuth } from "../../Context/AuthContext";

const SettingsPage = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // Function to handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5094/Auth/logout", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                logout();
                navigate("/");
            } else {
                const errorData = await response.json();
                console.error(errorData.message || "Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("An unexpected error occurred during logout. Please try again later.");
        }
    };

    return (
        <div className="d-flex row justify-content-start mt-3">
            {/* Sidebar for navigation */}
            <h1>Change your account settings</h1>
            <div className="col-auto">
                <ul className="nav nav-pills flex-column">
                    <li className="nav-item">
                        <NavLink
                            to="/settings/profile"
                            className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Profile
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/settings/email"
                            className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Email
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/settings/change-password"
                            className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Password
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/settings/personal-data"
                            className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            Personal Data
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <button
                            onClick={handleLogout}
                            className="nav-link text-danger"
                            style={{textAlign: "start"}}
                        >
                            Click here to Logout <i className="bi bi-door-closed"></i>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Dynamic content area */}
            <div className="col-5">
                <Routes>
                    <Route path="profile" element={<ProfileComponent/>}/>
                    <Route path="email" element={<EmailComponent/>}/>
                    <Route path="change-password" element={<PasswordComponent/>}/>
                    <Route path="personal-data" element={<PersonalDataComponent/>}/>

                    {/* Redirect for unmatched routes within /settings */}
                    <Route path="*" element={<Navigate to="/settings/profile" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default SettingsPage;
