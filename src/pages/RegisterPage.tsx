import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import './RegisterPage.css'; // Custom styling

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            // Send POST request to the API
            const response = await fetch('http://localhost:5094/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });

            if (response.ok) {
                // If registration is successful, log the user in automatically
                const loginResponse = await fetch('http://localhost:5094/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (loginResponse.ok) {
                    const data = await loginResponse.json();
                    localStorage.setItem('token', data.token); // Save JWT token in localStorage
                    navigate('/'); // Redirect to the home page
                } else {
                    const errorData = await loginResponse.json();
                    setErrorMessage(errorData.message || 'Login failed.');
                }
            } else {
                // Handle the structured error response
                const errorData = await response.json();
                if (Array.isArray(errorData)) {
                    // Map over the array of errors and extract descriptions
                    const errorMessages = errorData.map(err => err.description).join(' ');
                    setErrorMessage(errorMessages);
                } else {
                    setErrorMessage('Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="vh-100 overflow-hidden d-flex text-center justify-content-center align-items-center" style={{ paddingBottom: "1em" }}>
            {/* Close button */}
            <Link
                to="/"
                className="btn-close btn-close-white"
                aria-label="Close"
                style={{ position: "absolute", top: "2rem", left: "2rem", fontSize: "1.8rem" }}
            ></Link>

            {/* Main Content */}
            <div className="col-md-8 d-flex flex-column justify-content-center align-items-center w-100">
                {/* Header */}
                <h2 className="mb-3 colored-text">Create Your Account</h2>
                <p className="lead mb-4">
                    Unlock your creativity and start capturing moments with us!
                </p>

                {/* Register Form */}
                <form
                    id="registerForm"
                    className="card bg-transparent text-dark p-4 border-0 w-100"
                    style={{ maxWidth: "500px", width: "100%" }} // Ensures the form doesn't stretch too much
                    onSubmit={handleSubmit} // Attach submit handler
                >
                    {/* Username Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            autoComplete="username"
                            aria-required="true"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <label htmlFor="username">Username</label>
                    </div>

                    {/* Email Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            aria-required="true"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">Email</label>
                    </div>

                    {/* Password Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            aria-required="true"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            aria-required="true"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="text-danger mb-3">
                            {errorMessage}
                        </div>
                    )}

                    {/* Sign Up Button */}
                    <button
                        id="registerSubmit"
                        type="submit"
                        className="btn loginbtn-primary btn-lg mt-4 w-100"
                    >
                        Sign up
                    </button>

                    {/* Already Have an Account Link */}
                    <div className="mt-3 text-center">
                        <Link
                            to="/login"
                            className="btn loginbtn-secondary btn-lg w-100"
                            role="button"
                        >
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
