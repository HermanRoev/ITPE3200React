import './PersonalDataPage.css'
import {useState} from "react";
import {useAuth} from "../context/AuthContext";

const PersonalDataPage: React.FC = () => {
    const { token } = useAuth();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleDeletePersonalData = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch("http://localhost:5094/auth/delete", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Account deletion failed.');
                return;
            }

            setMessage('Account deleted successfully.');
            localStorage.removeItem('token');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    // TODO: ridirect this page do the delete page
    return (
        <div className="delete-personal-data">
            <h3>Personal Data</h3>
            <div className="col-md-8">
                <p>
                    Your account contains personal data that you have given us. This
                    page allows you to download or delete that data.
                </p>
                <p>
                    <strong>
                        Deleting this data will permanently remove your account, and this
                        cannot be recovered.
                    </strong>
                </p>
                <p>
                    <button
                        className="w-100 btn btn-lg btn-danger"
                        onClick={handleDeletePersonalData}
                    >
                        Delete
                    </button>
                </p>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default PersonalDataPage;