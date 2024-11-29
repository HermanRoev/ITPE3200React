// PostComponent.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PostDto, CommentDto } from '../models';
import { useAuth } from '../context/AuthContext';

interface PostComponentProps {
    post: PostDto;
    onDeletePost?: (postId: string) => void; // Callback to remove post from parent state
}

const PostComponent: React.FC<PostComponentProps> = ({ post, onDeletePost }) => {
    const { isAuthenticated, token } = useAuth();
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const [commentsExpanded, setCommentsExpanded] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [editingComment, setEditingComment] = useState<CommentDto | null>(null);
    const [postData, setPostData] = useState<PostDto>(post);

    // Handler for deleting a post
    const handleDeletePost = async (postId: string) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`http://localhost:5094/Post/DeletePost/${postId}`, {
                method: 'Post',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token for authentication
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                if (onDeletePost) {
                    onDeletePost(postId); // Remove post from parent component
                }
            } else {
                const errorData = await response.json();
                console.error('Error deleting post:', errorData.message);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Handler for toggling like status
    const handleToggleLike = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:5094/Post/ToggleLike/${postId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token for authentication
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedPost: PostDto = await response.json();
                setPostData((prevPost) => ({
                    ...prevPost,
                    isLikedByCurrentUser: updatedPost.isLikedByCurrentUser,
                    likeCount: updatedPost.likeCount,
                }));
            } else {
                console.error('Error toggling like:', response.statusText);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Handler for toggling save status
    const handleToggleSave = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:5094/Post/ToggleSave/${postId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token for authentication
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedPost: PostDto = await response.json();
                setPostData((prevPost) => ({
                    ...prevPost,
                    isSavedByCurrentUser: updatedPost.isSavedByCurrentUser,
                }));
            } else {
                console.error('Error toggling save:', response.statusText);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    const handleAddComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newCommentContent.trim()) return;

        try {
            const response = await fetch(`http://localhost:5094/Post/AddComment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token for authentication
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: postData.postId, content: newCommentContent }),
            });
            if (response.ok) {
                const updatedPost: PostDto = await response.json();
                setPostData((prevPost) => ({
                    ...prevPost,
                    comments: updatedPost.comments,
                    commentCount: updatedPost.commentCount,
                }));
                setNewCommentContent('');
            } else {
                const errorData = await response.json();
                console.error('Error adding comment:', errorData.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleEditComment = (comment: CommentDto) => {
        setEditingComment(comment);
    };

    // Handler for saving edited comment
    const handleSaveEditedComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingComment) return;

        try {
            const response = await fetch(`http://localhost:5094/Post/EditComment`, {
                method: 'POST', // Consider changing to PUT or PATCH for semantic clarity
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token for authentication
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postData.postId,
                    commentId: editingComment.commentId,
                    content: editingComment.content,
                }),
            });
            if (response.ok) {
                const updatedPost: PostDto = await response.json();
                setPostData((prevPost) => ({
                    ...prevPost,
                    comments: updatedPost.comments,
                }));
                setEditingComment(null);
            } else {
                const errorData = await response.json();
                console.error('Error editing comment:', errorData.message);
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    // Handler for deleting a comment
    const handleDeleteComment = async (commentId: string) => {
        // Confirm deletion with the user
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            // Send a POST request to the DeleteComment endpoint with query parameters
            const response = await fetch(`http://localhost:5094/Post/DeleteComment?postId=${postData.postId}&commentId=${commentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT token for authentication
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Parse the updated post data from the response
                const updatedPost: PostDto = await response.json();

                // Update the postData state with the updated post
                setPostData(updatedPost);

            } else {
                // Handle non-OK responses by parsing and logging the error message
                const errorData = await response.json();
                console.error('Error deleting comment:', errorData.message);
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="row justify-content-center mb-3" id={`post-${postData.postId}`}>
            <div className="card col-xl-8 mt-3" style={{ backgroundColor: '#7CBEEA14' }}>
                {/* Post Container */}
                <div className="post-container mt-3 mb-3">
                    {/* Triple-dot Dropdown Menu */}
                    {postData.isOwnedByCurrentUser && (
                        <div className="dropdown post-options">
                            <button
                                className="btn btn-link text-white p-0 m-0"
                                type="button"
                                id={`postOptionsMenu-${postData.postId}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-three-dots"></i>
                            </button>
                            <ul
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby={`postOptionsMenu-${postData.postId}`}
                            >
                                <li>
                                    <Link
                                        className="dropdown-item d-flex align-items-center"
                                        to={`/post/edit/${postData.postId}`}
                                    >
                                        <i className="bi bi-pencil me-2"></i> Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item d-flex align-items-center"
                                        onClick={() => handleDeletePost(postData.postId)}
                                    >
                                        <i className="bi bi-trash me-2 text-danger"></i> Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Carousel */}
                    <div
                        id={`carouselPostImages-${postData.postId}`}
                        className="carousel slide"
                    >
                        {/* Indicators */}
                        {postData.imageUrls.length > 1 && (
                            <div className="carousel-indicators" style={{ position: 'absolute', top: '10px' }}>
                                {postData.imageUrls.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target={`#carouselPostImages-${postData.postId}`}
                                        data-bs-slide-to={index}
                                        className={index === 0 ? 'active' : ''}
                                        aria-current={index === 0 ? 'true' : 'false'}
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                ))}
                            </div>
                        )}

                        {/* Images */}
                        <div className="carousel-inner">
                            {postData.imageUrls.map((imageUrl, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img
                                        src={`http://localhost:5094${imageUrl}`} // API base URL
                                        className="d-block w-100"
                                        alt="Post"
                                        style={{
                                            width: '100%',
                                            aspectRatio: '3/4',
                                            objectFit: 'contain',
                                            backgroundColor: 'black',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        {postData.imageUrls.length > 1 && (
                            <>
                                <button
                                    className="carousel-control-prev carousel-control-prev-icon"
                                    style={{ top: '50%' }}
                                    type="button"
                                    data-bs-target={`#carouselPostImages-${postData.postId}`}
                                    data-bs-slide="prev"
                                >
                                </button>
                                <button
                                    className="carousel-control-next carousel-control-next-icon"
                                    style={{ top: '50%' }}
                                    type="button"
                                    data-bs-target={`#carouselPostImages-${postData.postId}`}
                                    data-bs-slide="next"
                                >
                                </button>
                            </>
                        )}
                    </div>

                    {/* Overlay Elements */}
                    <div className="overlay-elements">
                        {/* Profile Picture and Account Name */}
                        <div className="profile-info d-flex align-items-center" style={{ width: 'calc(100% - 100px)' }}>
                            <Link
                                className="nav-link d-flex align-items-center"
                                style={{ padding: 0, maxWidth: '100%' }}
                                to={`/profile/${postData.userName}`}
                            >
                                {postData.profilePictureUrl ? (
                                    <>
                                        <img
                                            src={postData.profilePictureUrl}
                                            alt="Profile"
                                            className="rounded-circle profile-picture me-2"
                                            id="post-profile-pic"
                                            style={{ width: '2rem', height: '2rem' }}
                                        />
                                        <span
                                            className="username text-white"
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '100%',
                                            }}
                                        >
                                            {postData.userName}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <i
                                            className="bi bi-person-circle"
                                            style={{ fontSize: '2.5rem', color: '#7cbeea' }}
                                        ></i>
                                        <span
                                            className="username ms-2"
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '100%',
                                            }}
                                        >
                                            {postData.userName}
                                        </span>
                                    </>
                                )}
                            </Link>
                        </div>

                        {/* Like and Save Icons */}
                        <div className="post-actions position-absolute" style={{ right: 0, bottom: 0 }}>
                            {/* Comment Button */}
                            <button
                                type="button"
                                className="btn btn-sm text-white"
                                onClick={() => setCommentsExpanded(!commentsExpanded)}
                                aria-expanded={commentsExpanded}
                                aria-controls={`commentsSection-${postData.postId}`}
                            >
                                <i className="bi bi-chat icon-drop-shadow"></i>
                                <p>{postData.commentCount}</p>
                            </button>

                            {/* Like Button */}
                            <button
                                type="button"
                                className="btn btn-sm text-white"
                                onClick={() => handleToggleLike(postData.postId)}
                            >
                                {postData.isLikedByCurrentUser ? (
                                    <i className="bi bi-heart-fill text-danger"></i>
                                ) : (
                                    <i className="bi bi-heart icon-drop-shadow"></i>
                                )}
                                <p>{postData.likeCount}</p>
                            </button>

                            {/* Save Button */}
                            <button
                                type="button"
                                className="btn btn-sm text-white"
                                onClick={() => handleToggleSave(postData.postId)}
                            >
                                {postData.isSavedByCurrentUser ? (
                                    <i className="bi bi-bookmark-fill"></i>
                                ) : (
                                    <i className="bi bi-bookmark-plus icon-drop-shadow"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content and Comments */}
                <div className="post-content mt-2 mb-3">
                    {/* Content */}
                    <div>
                        {postData.content && postData.content.length > 100 ? (
                            !isContentExpanded ? (
                                <p id={`postContentShort-${postData.postId}`}>
                                    {postData.content.substring(0, 100)}...{' '}
                                    <span
                                        style={{ color: '#76b5e0', cursor: 'pointer' }}
                                        onClick={() => setIsContentExpanded(true)}
                                    >
                                        Read more
                                    </span>
                                </p>
                            ) : (
                                <p id={`postContentFull-${postData.postId}`}>
                                    {postData.content}{' '}
                                    <span
                                        style={{ color: '#76b5e0', cursor: 'pointer' }}
                                        onClick={() => setIsContentExpanded(false)}
                                    >
                                        Show less
                                    </span>
                                </p>
                            )
                        ) : (
                            <p>{postData.content}</p>
                        )}
                    </div>

                    {/* Comments Section */}
                    {commentsExpanded && (
                        <div className="mt-3" id={`commentsSection-${postData.postId}`}>
                            <div id={`comments-section-${postData.postId}`}>
                                <ul className="list-group list-group-flush">
                                    {postData.comments.map((comment) => (
                                        <li key={comment.commentId} className="list-group-item pb-3">
                                            {/* First Line: Username, Time, and Action Buttons */}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="username mb-0">{comment.userName}</span>
                                                <div className="d-flex align-items-center gap-2">
                                                    <small className="text-muted text-nowrap">
                                                        {comment.timeSincePosted}
                                                    </small>
                                                    {comment.isCreatedByCurrentUser && (
                                                        <>
                                                            {/* Edit Button */}
                                                            <button
                                                                type="button"
                                                                className="btn btn-icon p-0"
                                                                onClick={() => handleEditComment(comment)}
                                                            >
                                                                <i className="bi bi-pencil text-primary"></i>
                                                            </button>

                                                            {/* Delete Button */}
                                                            <button
                                                                type="button"
                                                                className="btn btn-icon p-0"
                                                                onClick={() => handleDeleteComment(comment.commentId)}
                                                            >
                                                                <i className="bi bi-trash text-danger"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Second Line: Comment Content */}
                                            <p className="mt-1 mb-0" style={{ color: '#f6f6f6' }}>{comment.content}</p>
                                        </li>
                                    ))}
                                </ul>

                                {/* Add Comment Form */}
                                {isAuthenticated ? (
                                    <form onSubmit={handleAddComment} className="comment-form">
                                        <div className="input-group mt-3">
                                            <input
                                                type="text"
                                                name="content"
                                                className="form-control bg-dark text-white border-dark"
                                                placeholder="Add a comment..."
                                                required
                                                value={newCommentContent}
                                                onChange={(e) => setNewCommentContent(e.target.value)}
                                            />
                                            <button type="submit" className="btn loginbtn-primary">
                                                Post
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="alert alert-info mt-3 bg-dark text-white border-0" role="alert">
                                        <Link to="/login" style={{ color: '#7cbeea' }}>
                                            Log in
                                        </Link>{' '}
                                        to add a comment.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Comment Modal */}
            {editingComment && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Comment</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setEditingComment(null)}
                                ></button>
                            </div>
                            <form onSubmit={handleSaveEditedComment}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="commentContent" className="form-label">
                                            Content
                                        </label>
                                        <textarea
                                            className="form-control bg-dark text-white"
                                            id="commentContent"
                                            name="content"
                                            rows={3}
                                            required
                                            value={editingComment.content}
                                            onChange={(e) =>
                                                setEditingComment({
                                                    ...editingComment,
                                                    content: e.target.value,
                                                })
                                            }
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setEditingComment(null)}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn loginbtn-primary">
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostComponent;