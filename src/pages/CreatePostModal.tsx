import React, { useState } from "react";

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
        <div className={`modal ${show ? "d-block" : "d-none"}`} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Post</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <textarea
                            className="form-control mb-3"
                            placeholder="Write your post content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isUploading} // Disable while uploading
                        />
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            disabled={isUploading} // Disable while uploading
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={isUploading} // Disable while uploading
                        >
                            {isUploading ? "Posting..." : "Post"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={isUploading} // Disable while uploading
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;