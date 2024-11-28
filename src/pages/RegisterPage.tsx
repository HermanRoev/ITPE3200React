import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RegisterPage.css";

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            // Send registration request
            const response = await fetch("http://localhost:5094/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            // Handle registration response
            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(data.message);

                // Attempt login
                const loginResponse = await fetch("http://localhost:5094/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        EmailOrUsername: formData.username, // Use username
                        Password: formData.password,
                    }),
                });

                // Handle login response
                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    login(loginData.token);
                    navigate("/"); // Redirect on success
                } else {
                    setErrorMessage("Registration succeeded, but login failed. Please log in manually.");
                }
            } else {
                // Handle registration errors
                const errorData = await response.json();
                if (Array.isArray(errorData)) {
                    const errorMessages = errorData.map((err) => err.description).join(" ");
                    setErrorMessage(errorMessages);
                } else {
                    setErrorMessage(errorData.message || "Registration failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Something went wrong. Please try again.");
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
                <h2 className="mb-3 colored-text">Create Your Account</h2>
                <p className="lead mb-4">Unlock your creativity and start capturing moments with us!</p>

                {/* Register Form */}
                <form
                    className="card bg-transparent text-dark p-4 border-0 w-100"
                    style={{ maxWidth: "500px", width: "100%" }}
                    onSubmit={handleSubmit}
                >
                    {/* Form Fields */}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>

                    {/* Messages */}
                    {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
                    {successMessage && <div className="text-success mb-3">{successMessage}</div>}

                    <button type="submit" className="btn loginbtn-primary btn-lg w-100">
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
