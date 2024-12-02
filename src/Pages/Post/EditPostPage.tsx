import React, { useState, useEffect, ChangeEvent } from "react";
import "./EditPostPage.css";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditPostPage: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const [content, setContent] = useState(""); // Post content
    const [currentImages, setCurrentImages] = useState<string[]>([]); // URLs of current images
    const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]); // New image files with previews
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // New state variables to store initial content and images
    const [initialContent, setInitialContent] = useState("");
    const [initialImages, setInitialImages] = useState<string[]>([]);

    const MAX_FILES = 5;
    const BASE_URL = "http://localhost:5094";

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
                    setInitialContent(postData.content); // Store initial content

                    // Convert relative image paths to full URLs
                    const imageUrls = postData.imageUrls.map(
                        (url: string) => `${BASE_URL}${url}`
                    );
                    setCurrentImages(imageUrls);
                    setInitialImages(imageUrls); // Store initial images
                } else {
                    console.error("Failed to fetch post data.");
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchPostData();
    }, [postId, token]);

    // Helper function to compare arrays
    const arraysEqual = (a: string[], b: string[]) => {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    };

    // Delete an existing image
    const handleDeleteImage = (index: number) => {
        const updatedImages = currentImages.filter((_, i) => i !== index);
        setCurrentImages(updatedImages);
    };

    // Delete a new image
    const handleDeleteNewImage = (index: number) => {
        const imageToDelete = newImages[index];
        URL.revokeObjectURL(imageToDelete.preview); // Free up memory
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

            const newFilePreviews = selectedFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

            setNewImages([...newImages, ...newFilePreviews]);
            setErrorMessage(null); // Clear error
        }
    };

    const handleSaveChanges = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if no changes were made
        if (
            content === initialContent &&
            arraysEqual(currentImages, initialImages) &&
            newImages.length === 0
        ) {
            navigate("/");
            return;
        }

        if (currentImages.length + newImages.length === 0) {
            setErrorMessage("At least one image is required.");
            return;
        }

        const formData = new FormData();

        // Add Post ID and Content
        formData.append("postId", postId!);
        formData.append("content", content);

        // Add existing images as relative URLs
        currentImages.forEach((url) => {
            const relativePath = url.replace(BASE_URL, "");
            formData.append("ExistingImageUrls", relativePath);
        });

        // Add new images
        newImages.forEach((imageObj) => {
            formData.append("ImageFiles", imageObj.file);
        });

        try {
            const response = await fetch(`${BASE_URL}/Post/EditPost`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                navigate("/");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to update the post.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while updating the post.");
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

                <div className="image-container mb-3">
                    {currentImages.map((image, index) => (
                        <div key={index} className="image-row">
                            <img src={image} alt={`PostImage ${index + 1}`} className="image-thumbnail" />
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
                    {newImages.map((imageObj, index) => (
                        <div key={index} className="image-row">
                            <img
                                src={imageObj.preview}
                                alt={`New PostImage ${index + 1}`}
                                className="image-thumbnail"
                            />
                            <p className="file-name">Image {currentImages.length + index + 1}</p> {/* New images */}
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

                <div className="file-input-container">
                    {/* Add Images Button (only visible if limit not reached) */}
                    {currentImages.length + newImages.length < MAX_FILES && (
                        <label
                            htmlFor="add-images"
                            className="btn loginbtn-secondary file-input-button"
                        >
                            Add Images
                        </label>
                    )}
                    <input
                        id="add-images"
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAddImages}
                    />

                    {/* Save Changes Button (always visible) */}
                    <button type="submit" className="btn loginbtn-primary file-input-button">
                        Save Changes
                    </button>
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default EditPostPage;