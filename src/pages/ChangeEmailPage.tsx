import React, { useState } from "react";
import "./ChangeEmailPage.css";
import {useAuth} from "../context/AuthContext";

const ChangeEmailPage: React.FC = () => {
    const { token } = useAuth(); // Get the authentication token
    const [newEmail, setNewEmail] = useState('');
    const [emailConfirmed, setEmailConfirmed] = useState(true); // Adjust based on actual email confirmation state
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5094/Auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the auth token
                },
                body: JSON.stringify({ newEmail }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to change email.');
                return;
            }

            setMessage('Email changed successfully.');
            setNewEmail('');
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="change-email-page">
            <h3>Change Email</h3>
            <form id="email-form" onSubmit={handleChangeEmail}>
                {emailConfirmed ? (
                    <div className="form-floating mb-3 input-group">
                        <input
                            type="email"
                            className="form-control"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                        <label className="label-name">Current Email</label>
                        <div className="input-group-append">
                            <span className="h-100 input-group-text text-success font-weight-bold">✓</span>
                        </div>
                    </div>
                ) : (
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter your new email"
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => alert('Send verification email functionality')}
                        >
                            Send verification email
                        </button>
                    </div>
                )}

                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter your new email"
                        required
                    />
                    <label className="label-name">New Email</label>
                </div>

                <button type="submit" className="btn loginbtn-primary btn-lg w-100">
                    Change Email
                </button>
            </form>

            {message && <div className="text-success mt-3">{message}</div>}
            {error && <div className="text-danger mt-3">{error}</div>}
        </div>
    )
};

export default ChangeEmailPage;