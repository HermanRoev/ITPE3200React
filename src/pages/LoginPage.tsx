import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import "./LoginPage.css"; // Custom styling

const LoginPage: React.FC = () => {
    const [emailOrUsername, setEmailOrUsername] = useState(""); // State for email/username input
    const [password, setPassword] = useState(""); // State for password input
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            // Send the login request to the backend
            const response = await fetch("http://localhost:5094/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    EmailOrUsername: emailOrUsername, // Matches the backend DTO
                    Password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store the JWT token in localStorage
                localStorage.setItem("token", data.token);

                // Redirect to the homepage (or any protected route)
                navigate("/");
            } else {
                // Handle errors from the backend
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login failed. Please try again.");
            }
        } catch (error) {
            // Handle network errors
            setErrorMessage("An unexpected error occurred. Please try again later.");
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
                <h2 className="mb-3 colored-text">Login Here</h2>
                <p className="lead mb-4">Welcome back! You’ve been missed!</p>

                {/* Error Message */}
                {errorMessage && (
                    <div className="alert alert-danger w-100" role="alert" style={{ maxWidth: "500px" }}>
                        {errorMessage}
                    </div>
                )}

                {/* Login Form */}
                <form
                    className="card bg-transparent text-dark p-4 border-0 w-100"
                    style={{ maxWidth: "500px", width: "100%" }}
                    onSubmit={handleLogin} // Attach the login handler
                >
                    {/* Email or Username Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="emailOrUsername"
                            placeholder="Email or Username"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            autoComplete="username"
                            required
                        />
                        <label htmlFor="emailOrUsername">Email or Username</label>
                    </div>

                    {/* Password Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
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
                    <button type="submit" className="btn loginbtn-primary btn-lg w-100">
                        Sign in
                    </button>

                    {/* Register Button */}
                    <div className="mt-3 text-center">
                        <Link to="/register" className="btn loginbtn-secondary btn-lg w-100">
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;