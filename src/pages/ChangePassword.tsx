import React, {useState} from "react";
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext provides token handling
import './ChangePasswordPage.css'; // Include CSS for styling

const ChangePassword: React.FC = () => {
    const { token } = useAuth(); // Access the auth token from context
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError('New password and confirmation password do not match.');
            return;
        }

        try {
            const response = await fetch("http://localhost:5094/Auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Pass the token for authentication
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    confirmNewPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Password change failed.');
                return;
            }

            setMessage('Password changed successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="change-password-page">
            <h3>Change Password</h3>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form id="change-password-form" onSubmit={handleChangePassword}>
                <div className="form-floating mb-4">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <label className="label-name">Old Password</label>
                </div>

                <div className="form-floating mb-4">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label className="label-name">New Password</label>
                </div>

                <div className="form-floating mb-4">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm your new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                    <label className="label-name">Confirm New Password</label>
                </div>

                <button type="submit" className="btn loginbtn-primary btn-lg w-100">
                    Update Password
                </button>
            </form>
        </div>
    )
}

export default ChangePassword;