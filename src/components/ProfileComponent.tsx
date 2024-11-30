import React, {useEffect} from "react";

const ProfileComponent = () => {
    const [username, setUsername] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch("http://localhost:5094/User/GetProfile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const profileData = await response.json();
                    setUsername(profileData.username);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Failed to fetch profile data.");
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
                setErrorMessage("Failed to fetch profile data. Please try again later.");
            }
        };

        fetchProfileData();
    }, []);

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d{0,8}$/.test(value)) {
            setPhoneNumber(value);
            setErrorMessage("");
        } else {
            setErrorMessage("Phone number must be exactly 8 digits.");
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (phoneNumber.length !== 8) {
            setErrorMessage("Phone number must be exactly 8 digits.");
            return;
        }
        //TODO:fetch riktig url
        try {
            const response = await fetch("http://localhost:5094/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phoneNumber }),
            });

            if (response.ok) {
                alert("Profile updated successfully.");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to update profile.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while updating the profile.");
        }
    };

    return (
        <div className="row">
            <h2>Settings</h2>
            <div className="col-md-8">
                <form id="profile-form" onSubmit={handleSubmit}>
                    <div className="text-danger" role="alert">
                        {errorMessage}
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            disabled
                        />
                        <label className="form-label">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Please enter your phone number."
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                        />
                        <label className="form-label">Phone Number</label>
                        <span className="text-danger">{errorMessage}</span>
                    </div>
                    <button id="update-profile-button" type="submit" className="btn loginbtn-primary btn-lg w-100">
                        Save
                    </button>
                </form>
            </div>
        </div>
    )


};

export default ProfileComponent;

