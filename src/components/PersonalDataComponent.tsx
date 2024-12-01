import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PersonalDataComponent = () => {
    const { token, logout } = useAuth();
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Handle input change
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Open modal
    const handleShowModal = () => setShowModal(true);

    // Close modal and reset states
    const handleCloseModal = () => {
        setShowModal(false);
        setPassword("");
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Input validation
        if (password.trim() === "") {
            setErrorMessage("Password is required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:5094/Auth/delete-personal-data", { // Ensure this URL matches your backend route
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(password),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(data.message || "Your account has been deleted successfully.");

                // Logout user
                logout();

                // Optionally, redirect the user after a short delay to show success message
                setTimeout(() => {
                    window.location.href = "/"; // Redirect to home or signup page
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to delete your account.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while deleting your account. Please try again later.");
            console.error("Delete account error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="deactivate-account">
            <h2>Delete Your Account</h2>
            <div className="alert alert-warning" role="alert">
                <p>
                    <strong>
                        Deleting this account will permanently remove all your data, including posts and images. This action cannot be undone.
                    </strong>
                </p>
            </div>

            {/* Trigger Button */}
            <button className="btn btn-danger" onClick={handleShowModal}>
                Delete Account
            </button>

            {/* Delete Account Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            {/* Modal Header */}
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Account Deletion</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body">
                                {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}
                                {successMessage && <div className="text-success mt-3">{successMessage}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Enter Your Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="mt-3 d-flex justify-content-end">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}
                                                disabled={isSubmitting}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-danger ms-2" disabled={isSubmitting}>
                                            {isSubmitting ? "Deleting..." : "Delete Account"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalDataComponent;