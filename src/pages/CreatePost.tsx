import React, { useState, ChangeEvent } from "react";
import "./CreatePost.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreatePost: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // For error handling

    const MAX_FILES = 5; // Define the maximum number of files allowed

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);

            // Check if adding the new files exceeds the limit
            if (selectedFiles.length + newFiles.length > MAX_FILES) {
                setErrorMessage(`You can only select up to ${MAX_FILES} files.`);
                return;
            }

            setErrorMessage(null); // Clear any previous error
            setSelectedFiles([...selectedFiles, ...newFiles]);
        }
    };

    const handleDeleteFile = (fileIndex: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== fileIndex);
        setSelectedFiles(updatedFiles);
        setErrorMessage(null); // Clear any error as files are removed
    };

    const handleDeleteAllFiles = () => {
        setSelectedFiles([]);
        setErrorMessage(null); // Clear any error as all files are removed
    };

    const handleCreatePost = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!token) {
            console.error("User is not authenticated.");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        selectedFiles.forEach((file) => formData.append("imageFiles", file));

        try {
            const response = await fetch("http://localhost:5094/Post/CreatePost", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                console.log("Post created successfully!");
                setContent("");
                setSelectedFiles([]);
                setErrorMessage(null); // Clear error if any
                navigate("/"); // Redirect to home page
            } else {
                console.error("Failed to create post.");
            }
        } catch (error) {
            console.error("Error while creating post:", error);
        }
    };

    return (
        <div className="create-post-container">
            <form className="create-post-form" onSubmit={handleCreatePost}>
                <h2 className="create-post-heading">Create a Post</h2>

                {/* Text Content Input */}
                <textarea
                    placeholder="Write something..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>

                {/* File Input and Buttons */}
                <div className="file-input-container mt-3">
                    {/* Choose Images Button */}
                    <label htmlFor="imageInput" className="btn loginbtn-secondary file-input-button">
                        Choose Images
                    </label>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                    />

                    {/* Create Post Button */}
                    <button
                        type="submit"
                        className="btn loginbtn-primary file-input-button mt-1"
                    >
                        Create Post
                    </button>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="alert alert-danger mt-3">{errorMessage}</div>
                )}

                {/* File Information */}
                {selectedFiles.length > 0 && (
                    <div>
                        <p className={"m-2 opacity-75"}>{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected</p>
                        <button
                            type="button"
                            className="btn btn-danger mb-3"
                            onClick={handleDeleteAllFiles}
                        >
                            Delete All
                        </button>
                        <ul className="file-list">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="file-item">
                                    {file.name}
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteFile(index)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreatePost;