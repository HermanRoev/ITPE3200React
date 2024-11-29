import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

interface EditProfileModalProps {
    show: boolean;
    handleClose: () => void;
    user: {
        profilePictureUrl: string;
        bio: string;
    };
    onSaveChanges: (data: { bio: string; profilePicture: File | null }) => void; // onSaveChanges prop
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
                                                               show,
                                                               handleClose,
                                                               user,
                                                               onSaveChanges,
                                                           }) => {
    const [bio, setBio] = useState<string>(user.bio || "");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    // Oppdater bio hvis brukerens bio oppdateres
    useEffect(() => {
        setBio(user.bio || "");
    }, [user.bio]);

    // Håndter filendring for profilbilde
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];

            // Valider filtype (kun bilder)
            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validImageTypes.includes(selectedFile.type)) {
                alert("Please upload a valid image file (JPEG, PNG, or GIF).");
                return;
            }

            // Valider filstørrelse (maks 5MB)
            const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
            if (selectedFile.size > maxSizeInBytes) {
                alert("File size must not exceed 5MB.");
                return;
            }

            setProfilePicture(selectedFile);
        }
    };

    // Håndter lagring av endringer (bio og profilbilde)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveChanges({ bio, profilePicture }); // Kall onSaveChanges fra prop
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="mb-4 text-center">
                        {user.profilePictureUrl ? (
                            <img
                                src={user.profilePictureUrl}
                                alt="Profile"
                                className="rounded-circle"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <i
                                className="bi bi-person-circle"
                                style={{
                                    fontSize: "150px",
                                    color: "#7cbeea",
                                }}
                            ></i>
                        )}
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-dark">Upload New Profile Picture</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Form.Group>

                    <Form.Group className="form-floating mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Create your bio..."
                            className="form-control"
                        />
                        <label htmlFor="bio">Create your Bio</label>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 btn-lg"
                        style={{ backgroundColor: "#7cbeea", borderColor: "#7cbeea" }}
                    >
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditProfileModal;


