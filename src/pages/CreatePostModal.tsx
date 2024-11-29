import React, { useState } from "react";
import { Form, Button } from "react-bootstrap"; // Legger til Button og Form fra react-bootstrap

interface CreatePostModalProps {
    show: boolean;
    handleClose: () => void;
    onCreatePost: (postData: { content: string; images: File[] }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
                                                             show,
                                                             handleClose,
                                                             onCreatePost,
                                                         }) => {
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);

            // Valider filtype og størrelse
            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
            const maxFileSize = 5 * 1024 * 1024; // 5 MB
            const validFiles = selectedFiles.filter((file) => {
                if (!validImageTypes.includes(file.type)) {
                    alert(`${file.name} is not a valid image file.`);
                    return false;
                }
                if (file.size > maxFileSize) {
                    alert(`${file.name} exceeds the maximum size of 5MB.`);
                    return false;
                }
                return true;
            });

            setImages(validFiles);
        }
    };

    const handleSubmit = async () => {
        if (images.length === 0) {
            alert("Please select at least one image.");
            return;
        }

        setIsUploading(true);

        try {
            await onCreatePost({ content, images });
            setContent("");
            setImages([]);
            handleClose(); // Lukk modal automatisk etter innsending
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className={`modal ${show ? "d-block" : "d-none"}`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" style={{ color: "#7cbeea" }}>
                            Create Post
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4 text-center">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-dark">Content</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Write your post content here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        disabled={isUploading}
                                        style={{
                                            fontSize: "1.2em",
                                            padding: "0.5em",
                                            borderRadius: "10px",
                                            borderColor: "#ccc",
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 position-relative">
                                    <label
                                        htmlFor="imageFiles"
                                        className="custom-file-label text-dark d-block"
                                        style={{
                                            backgroundColor: "#f0f0f0",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Choose Files
                                    </label>
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        id="imageFiles"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                        disabled={isUploading}
                                    />
                                    {images.length > 0 && (
                                        <div className="mt-2">
                                            <small>
                                                {images.length}{" "}
                                                {images.length === 1 ? "file" : "files"} selected
                                            </small>
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        </Form>
                    </div>
                    <div className="modal-footer">
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isUploading}
                            style={{
                                backgroundColor: "#7cbeea",
                                borderColor: "#7cbeea",
                                width: "100%",
                            }}
                        >
                            {isUploading ? "Posting..." : "Create Post"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isUploading}
                            style={{ width: "100%" }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;

