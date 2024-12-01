import React, {FormEvent, useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";

const ProfileComponent = () => {
    // State to store form data
    const { token, userProfile } = useAuth();
    const [username, setUsername] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    // Function to validate the phone number (exactly 8 digits)
    const validatePhoneNumber = (number: string): boolean => {
        const regex = /^\d{8}$/;
        return regex.test(number);
    };

    // Handle form submission
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage([]) // Clear previous errors

        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            setErrorMessage(['Phone number must be exactly 8 digits.']);
            return;
        }

        // Submit the updated phone number to the backend
        fetch('/api/user/update', { // Adjust the API endpoint as needed
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber }),
        })
            .then(response => {
                if (response.ok) {
                    // Handle success (e.g., display a success message)
                    console.log('Profile updated successfully.');
                } else {
                    // Handle server-side validation errors
                    response.json().then(data => {
                        setErrorMessage(data.errors || ['An error occurred while updating the profile.']);
                    });
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                setErrorMessage(['An error occurred while updating the profile.']);
            });
    };

    return (
        <div className="change-profile">
            <h2>Settings</h2>
            <form id="profile-form" onSubmit={handleSubmit}>
                <div className="text-danger" role="alert">
                    {errorMessage}
                </div>
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
                    <span className="text-danger">{errorMessage}</span>
                </div>
                <button id="update-profile-button" type="submit" className="btn loginbtn-primary btn-lg w-100">
                    Save
                </button>
            </form>
        </div>
    )
};

export default ProfileComponent;

