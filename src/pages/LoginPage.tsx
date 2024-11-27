import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './LoginPage.css'; // Custom styling

const LoginPage: React.FC = () => {
    // State to manage form inputs and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the form from refreshing the page

        try {
            // Send a POST request to the API
            const response = await fetch('http://localhost:5094/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store the token in localStorage
                localStorage.setItem('token', data.token);

                // Redirect the user to the homepage or another protected route
                navigate('/');
            } else {
                // If the response is not ok, handle the error
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            // Handle network or unexpected errors
            setErrorMessage('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="vh-100 overflow-hidden d-flex justify-content-center align-items-center" style={{ paddingBottom: "5em" }}>
            {/* Close button */}
            <Link
                to="/"
                className="btn-close btn-close-white"
                aria-label="Close"
                style={{ position: "absolute", top: "2rem", left: "2rem", fontSize: "1.8rem" }}
            ></Link>

            {/* Main Content */}
            <div className="col-md-8 d-flex flex-column text-center justify-content-center align-items-center w-100">
                {/* Header */}
                <h2 className="mb-3 colored-text">Login Here</h2>
                <p className="lead mb-4">Welcome back you’ve been missed!</p>

                {/* Error Message */}
                {errorMessage && (
                    <div className="alert alert-danger w-100" role="alert" style={{ maxWidth: "500px" }}>
                        {errorMessage}
                    </div>
                )}

                {/* Login Form */}
                <form
                    id="account"
                    method="post"
                    className="card bg-transparent text-dark p-4 border-0 w-100"
                    style={{ maxWidth: "500px", width: "100%" }}
                    onSubmit={handleLogin} // Attach the handleLogin function to the form
                >
                    {/* Email Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update state
                            autoComplete="email"
                            aria-required="true"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update state
                            autoComplete="current-password"
                            aria-required="true"
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="form-check mb-4 text-end">
                        <Link to="/forgot-password" className="colored-text">
                            Forgot your password?
                        </Link>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="btn loginbtn-primary btn-lg w-100"
                    >
                        Sign in
                    </button>

                    {/* Register Button */}
                    <div className="mt-3 text-center">
                        <Link
                            to="/register"
                            className="btn loginbtn-secondary btn-lg w-100"
                            role="button"
                        >
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
