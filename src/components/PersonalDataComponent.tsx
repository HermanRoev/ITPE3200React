import React, { useState, useEffect } from "react";

const PersonalDataComponent = () => {
    const [password, setPassword] = useState("");
    const [requirePassword, setRequirePassword] = useState(false); // Simulate server-determined requirement
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch("http://localhost:5094/User/Settings", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const settingsData = await response.json();
                    setRequirePassword(settingsData.requirePassword);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Failed to fetch settings.");
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
                setErrorMessage("Failed to fetch settings. Please try again later.");
            }
        };

        fetchSettings();
    }, []);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setErrorMessage(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (requirePassword && password.trim() === "") {
            setErrorMessage("Password is required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:5094/User/DeleteAccount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    password: requirePassword ? password : undefined,
                }),
            });

            if (response.ok) {
                alert("Your account has been deleted.");
                window.location.href = "/"; // Redirect to home page
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to delete account.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while deleting the account. Please try again later.");
        }
    };

    return (
        <div>
            <div className="alert alert-warning" role="alert">
                <p>
                    <strong>
                        Deleting this data will permanently remove your account, and this cannot be recovered.
                    </strong>
                </p>
            </div>

            <form id="delete-user" onSubmit={handleSubmit}>
                {errorMessage && (
                    <div className="text-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                {requirePassword && (
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <label>Password</label>
                    </div>
                )}

                <button className="w-100 btn btn-lg btn-danger" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Deleting..." : "Delete data and close my account"}
                </button>
            </form>
        </div>
    );
};

export default PersonalDataComponent;
