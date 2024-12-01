import React, {FormEvent, useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";

const ProfileComponent = () => {
    // State to store form data
    const { token, userProfile, authload } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Function to validate the phone number (exactly 8 digits)
    const validatePhoneNumber = (number: string): boolean => {
        const regex = /^\d{8}$/;
        return regex.test(number);
    };

    // Initialize phoneNumber when userProfile becomes available
    useEffect(() => {
        if (!authload) {
            if (userProfile?.phoneNumber) {
                setPhoneNumber(userProfile.phoneNumber);
            }
        }
    }, [authload, userProfile]);

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            setMessage('')
            setError('Phone number must be exactly 8 digits.');
            return;
        }

        if (phoneNumber === userProfile?.phoneNumber) {
            console.log(phoneNumber)
            setError('Please enter a new phone number.');
            setMessage('')
            return;
        }

        try {
            const response = await fetch('http://localhost:5094/Auth/change-number', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(phoneNumber),
            })

            if (!response.ok) {
                const errorData = await response.json();
                setMessage('');
                setError(errorData.message || 'Failed to update phone number.');
                return;
            }

            userProfile!.phoneNumber = phoneNumber;
            setError('');
            setMessage('Phone number updated successfully.');
        }
        catch (error) {
            setMessage('');
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="change-profile">
            <h2>Settings</h2>
            <form id="profile-form" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={userProfile?.username}
                        disabled
                    />
                    <label className="form-label">Username</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Please enter your phone number."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <label className="form-label">Phone Number</label>
                </div>
                <button id="update-profile-button" type="submit" className="btn loginbtn-primary btn-lg w-100">
                    Save
                </button>
            </form>

            {message && <div className="text-success mt-3">{message}</div>}
            {error && <div className="text-danger mt-3">{error}</div>}
        </div>
    )
};

export default ProfileComponent;

