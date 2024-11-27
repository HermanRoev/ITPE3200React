import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './RegisterPage.css'; // Custom styling

const RegisterPage: React.FC = () => {
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
    );
};

export default RegisterPage;