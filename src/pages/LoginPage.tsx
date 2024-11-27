import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './LoginPage.css'; // Custom styling

const LoginPage: React.FC = () => {
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

                {/* Login Form */}
                <form
                    id="account"
                    method="post"
                    className="card bg-transparent text-dark p-4 border-0 w-100"
                    style={{ maxWidth: "500px", width: "100%" }} // Ensures the form doesn't stretch too much
                >
                    {/* Username Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="username"
                            autoComplete="username"
                            aria-required="true"
                        />
                        <label htmlFor="username">Username</label>
                    </div>

                    {/* Password Input */}
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="password"
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