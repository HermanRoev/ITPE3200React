import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './RegisterPage.css'; // Minimal overrides for custom styling

const RegisterPage: React.FC = () => {
    return (
        <div className="vw-100 overflow-hidden">
            {/* Close button */}
            <Link
                to="/"
                className="btn-close btn-close-white"
                aria-label="Close"
                style={{ position: "absolute", top: "2rem", left: "2rem", fontSize: "1.8rem" }}
            ></Link>

            {/* Main Container */}
            <div className="container vh-100 w-75">
                <div
                    className="row justify-content-center vh-100 align-items-center"
                    style={{ paddingBottom: "5em" }}
                >
                    <div className="col-md-8 pt-4 text-center">
                        {/* Header */}
                        <h2 className="mb-3 colored-text">Create Your Account</h2>
                        <p className="lead mb-4">
                            Unlock your creativity and start capturing moments with us!
                        </p>

                        {/* Register Form */}
                        <form
                            id="registerForm"
                            method="post"
                            className="card bg-transparent text-dark p-4 border-0"
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
                                />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            </div>

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
            </div>
        </div>
    );
};

export default RegisterPage;