import React from 'react';
import './LoginPage.css'; // Minimal overrides for custom styling

const LoginPage: React.FC = () => {
    return (
        <div className="vw-100 overflow-hidden">
            {/* Close button */}
            <a
                href="/"
                className="btn-close btn-close-white"
                aria-label="Close"
                style={{ position: "absolute", top: "2rem", left: "2rem", fontSize: "1.8rem" }}
            ></a>

            {/* Main Container */}
            <div className="container">
                <div
                    className="row vh-100 justify-content-center align-items-center"
                    style={{ paddingBottom: "5em" }}
                >
                    <div className="col-md-8 text-center">
                        {/* Header */}
                        <h2 className="mb-3 colored-text">Login Here</h2>
                        <p className="lead mb-4">Welcome back you’ve been missed!</p>

                        {/* Login Form */}
                        <form
                            id="account"
                            method="post"
                            className="card bg-transparent text-dark p-4 border-0"
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
                                <a href="/forgot-password" className="colored-text">
                                    Forgot your password?
                                </a>
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
                                <a
                                    href="/register"
                                    className="btn loginbtn-secondary btn-lg w-100"
                                    role="button"
                                >
                                    Register
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;