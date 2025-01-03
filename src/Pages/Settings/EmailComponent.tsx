import React, {useState} from "react";
import {useAuth} from "../../Context/AuthContext";

const EmailComponent = () => {
    const { token, userProfile } = useAuth(); // Get the authentication token
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5094/Auth/change-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the auth token
                },
                body: JSON.stringify(newEmail),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to change email.');
                return;
            }

            // Update the user profile with the new email locally
            userProfile!.email = newEmail;

            setMessage('Email changed successfully.');
            setNewEmail('');
            setError('');
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="change-email-page">
            <h2>Change Email</h2>
            <form id="email-form" onSubmit={handleChangeEmail}>
                <div className="form-floating mb-3 text-black">
                    <input
                        type="email"
                        className="form-control"
                        value={userProfile?.email}
                        disabled
                    />
                    <label className="label-name">Current Email</label>
                </div>
                <div className="form-floating mb-3 text-black">
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

export default EmailComponent;