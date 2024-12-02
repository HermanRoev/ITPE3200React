import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PasswordComponent: React.FC = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const { token } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    //Handle user sumbit new password
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous messages
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch('http://localhost:5094/Auth/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                    password: formData.confirmNewPassword,
                }),
            });

            if (response.ok) {
                setSuccessMessage('Password updated successfully.');
                setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while updating your password. Please try again later.');
        }
    };

    return (
        <div className="change-password">
            <h2>Change Password</h2>
            <form className="change-password-form" onSubmit={handleSubmit}>
                {errorMessage && (
                    <div className="text-danger mb-3" role="alert">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="text-success mb-3">
                        {successMessage}
                    </div>
                )}
                <div className="form-floating mb-4 text-black">
                    <input
                        id={'oldPassword'}
                        type="password"
                        name="oldPassword"
                        className="form-control"
                        placeholder="Please enter your old password."
                        value={formData.oldPassword}
                        onChange={handleChange}
                        required
                    />
                    <label>Old Password</label>
                </div>
                <div className="form-floating mb-4 text-black">
                    <input
                        id={'newPassword'}
                        type="password"
                        name="newPassword"
                        className="form-control"
                        placeholder="Please enter your new password."
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <label>New Password</label>
                </div>
                <div className="form-floating mb-4 text-black">
                    <input
                        id={'confirmNewPassword'}
                        type="password"
                        name="confirmNewPassword"
                        className="form-control"
                        placeholder="Please confirm your new password."
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        required
                    />
                    <label>Confirm New Password</label>
                </div>
                <button type="submit" className="btn loginbtn-primary btn-lg w-100">
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default PasswordComponent;
