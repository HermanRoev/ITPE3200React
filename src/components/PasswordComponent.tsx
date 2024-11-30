import React, { useState } from 'react';

const PasswordComponent: React.FC = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateInput = () => {
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
            return 'All fields are required.';
        }
        if (formData.newPassword.length < 6) {
            return 'New password must be at least 6 characters long.';
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
            return 'New password and confirmation password do not match.';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous messages
        setErrorMessage(null);
        setSuccessMessage(null);

        // Validate input
        const validationError = validateInput();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
    );
};

export default PasswordComponent;
