import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css"; // Custom styling
import { useAuth } from "../context/AuthContext";

const CreatePost: React.FC = () => {
    const { token } = useAuth(); // Get the token from AuthContext
    const navigate = useNavigate();

    // State to handle form inputs and messages
    const [content, setContent] = useState<string>(""); // State for post content
    const [images, setImages] = useState<File[]>([]); // State for image files
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files)); // Convert FileList to an array of files
        }
    };

    // Clear selected images
    const clearImages = () => {
        setImages([]); // Clear the images array
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure user is authenticated
        // Should not be possible to reach this page without being logged in, but added for safety
        if (!token) {
            setErrorMessage("You must be logged in to create a post.");
            navigate("/login");
            return;
        }

        try {
            const formData = new FormData(); // FormData to send multipart/form-data
            formData.append("Content", content); // Add post content
            images.forEach((image) => formData.append("ImageFiles", image)); // Add images

            // Send the create post request to the backend
            const response = await fetch("http://localhost:5094/Post/CreatePost", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
                },
                body: formData,
            });

            if (response.ok) {
                setSuccessMessage("Post created successfully! Redirecting...");
                setTimeout(() => navigate("/"), 2000); // Redirect to the homepage after success
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to create post. Please try again.");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="create-post-container">
            <h2 className="text-center">Create a Post</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                {/* Error Message */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Success Message */}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {/* Post Content Input */}
                <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        id="content"
                        placeholder="Write your post content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                    <label htmlFor="content">Content</label>
                </div>

                {/* File Upload Section */}
                <div className="mb-3 position-relative">
                    <input
                        type="file"
                        className="custom-file-input"
                        id="imageFiles"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="imageFiles" className="custom-file-label">
                        {images.length > 0
                            ? `${images.length} file(s) selected`
                            : "Choose Images"}
                    </label>
                    {images.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-danger clear-images-btn"
                            onClick={clearImages}
                        >
                            Clear Images
                        </button>
                    )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn loginbtn-primary btn-lg w-100">
                    Create Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;