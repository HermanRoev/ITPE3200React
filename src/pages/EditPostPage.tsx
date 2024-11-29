import React, { useState, useEffect, ChangeEvent } from "react";
import "./EditPostPage.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditPostPage: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const [content, setContent] = useState(""); // Post content
    const [currentImages, setCurrentImages] = useState<string[]>([]); // URLs of current images
    const [newImages, setNewImages] = useState<File[]>([]); // New image files
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const MAX_FILES = 5;
    const BASE_URL = "http://localhost:5094"; // Adjust to your backend URL

    // Fetch existing post data on load
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/Post/GetPostById/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const postData = await response.json();
                    setContent(postData.content);

                    // Convert relative image paths to full URLs
                    const imageUrls = postData.imageUrls.map(
                        (url: string) => `${BASE_URL}${url}`
                    );
                    setCurrentImages(imageUrls);
                } else {
                    console.error("Failed to fetch post data.");
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchPostData();
    }, [postId, token]);

    // Delete an existing image
    const handleDeleteImage = (index: number) => {
        const updatedImages = currentImages.filter((_, i) => i !== index);
        setCurrentImages(updatedImages);
    };

    // Delete a new image
    const handleDeleteNewImage = (index: number) => {
        const updatedNewImages = newImages.filter((_, i) => i !== index);
        setNewImages(updatedNewImages);
    };

    // Add new images
    const handleAddImages = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            if (currentImages.length + newImages.length + selectedFiles.length > MAX_FILES) {
                setErrorMessage(`You can only upload up to ${MAX_FILES} images.`);
                return;
            }
            setErrorMessage(null);
            setNewImages([...newImages, ...selectedFiles]);
        }
    };

    // Save changes
    const handleSaveChanges = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("content", content);

        currentImages.forEach((url, index) => formData.append(`currentImageUrls[${index}]`, url));
        newImages.forEach((file) => formData.append("newImages", file));

        try {
            const response = await fetch(`${BASE_URL}/Post/EditPost/${postId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                navigate("/");
            } else {
                console.error("Failed to update the post.");
            }
        } catch (error) {
            console.error("Error updating the post:", error);
        }
    };

    return (
        <div className="edit-post-container">
            <form className="edit-post-form" onSubmit={handleSaveChanges}>
                <h2 className="edit-post-heading">Edit Post</h2>

                <textarea
                    placeholder="Edit your bio..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>

                <div className="image-container">
                    {currentImages.map((image, index) => (
                        <div key={index} className="image-row">
                            <img src={image} alt={`Image ${index + 1}`} className="image-thumbnail"/>
                            <p className="file-name">Image {index + 1}</p>
                            <button
                                type="button"
                                className="btn btn-danger delete-button"
                                onClick={() => handleDeleteImage(index)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {newImages.map((file, index) => (
                        <div key={index} className="image-row">
                            <div className="image-placeholder">
                                <p className="file-name">{file.name}</p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger delete-button"
                                onClick={() => handleDeleteNewImage(index)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {currentImages.length + newImages.length < MAX_FILES && (
                    <div className="file-input-container">
                        <label htmlFor="add-images" className="btn loginbtn-secondary">
                            Add Images
                        </label>
                        <input
                            id="add-images"
                            type="file"
                            multiple
                            accept="image/*"
                            style={{display: "none"}}
                            onChange={handleAddImages}
                        />
                    </div>
                )}

                <button type="submit" className="btn loginbtn-primary mt-3">
                    Save Changes
                </button>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default EditPostPage;