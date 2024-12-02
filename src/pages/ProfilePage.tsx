import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostDto, ProfileDto } from '../models';
import { useAuth } from '../context/AuthContext';

import PostComponent from '../components/PostComponent';

interface ProfileData {
    profile: ProfileDto;
    posts: PostDto[];
}

const ProfilePage = () => {
    const { username } = useParams<{ username?: string }>(); // Get the username from the URL parameters

    // State variables
    const [userData, setUserData] = useState<ProfileDto | null>(null);
    const [posts, setPosts] = useState<PostDto[] | null>(null);
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [gridView, setGridView] = useState('3x3'); // Possible values: '3x3' or '2x2'
    const { token, isAuthenticated, authload } = useAuth();
    // State variables for the modal and form
    const [showEditModal, setShowEditModal] = useState(false);
    const [bio, setBio] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newImage, setNewImage] = useState<File | null>(null);

    // New error states
    const [profileError, setProfileError] = useState('');
    const [actionError, setActionError] = useState('');

    const fetchProfileData = async () => {
        try {
            const url = username ? `http://localhost:5094/Profile/${username}` : 'http://localhost:5094/Profile/';
            // Fetch profile data
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setProfileError(errorData.message || `Bad response from server: ${response.status} ${response.statusText}`);
                setUserData(null);
                setPosts(null);
                setIsCurrentUserProfile(false);
                setIsFollowing(false);
                return;
            }

            const profileData: ProfileData = await response.json();
            console.log(profileData);

            setUserData(profileData.profile);
            setPosts(profileData.posts);

            setIsCurrentUserProfile(profileData.profile.isCurrentUserProfile);
            setIsFollowing(profileData.profile.isFollowing);
            setProfileError(''); // Clear any previous errors

        } catch (error: any) {
            console.error('Error fetching profile data', error);
            setProfileError('An unexpected error occurred while fetching profile data.');
            setUserData(null);
            setPosts(null);
            setIsCurrentUserProfile(false);
            setIsFollowing(false);
        }
    };

    // Fetch user data when component mounts or when dependencies change
    useEffect(() => {
        if (!authload && isAuthenticated) { // Ensure only fetching when auth is loaded and user is authenticated
            fetchProfileData().then(r => r);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authload, token, username]);

    const handleFollow = async () => {
        try {
            const response = await fetch(`http://localhost:5094/Profile/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData?.username), // Ensure backend expects an object
            });

            if (!response.ok) {
                const errorData = await response.json();
                setActionError(errorData.message || 'Failed to follow the user.');
                return;
            }

            setIsFollowing(true);
            setActionError(''); // Clear any previous errors
            // Update followers count locally, assuming the response is successful
            setUserData(prev => prev ? { ...prev, followersCount: prev.followersCount + 1 } : prev);

        } catch (error: any) {
            console.error('Error following user', error);
            setActionError('An unexpected error occurred while trying to follow the user.');
        }
    };

    const handleUnfollow = async () => {
        try {
            const response = await fetch(`http://localhost:5094/Profile/unfollow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData?.username), // Ensure backend expects an object
            });

            if (!response.ok) {
                const errorData = await response.json();
                setActionError(errorData.message || 'Failed to unfollow the user.');
                return;
            }

            setIsFollowing(false);
            setActionError(''); // Clear any previous errors
            // Update followers count locally, assuming the response is successful
            setUserData(prev => prev ? { ...prev, followersCount: prev.followersCount - 1 } : prev);

        } catch (error: any) {
            console.error('Error unfollowing user', error);
            setActionError('An unexpected error occurred while trying to unfollow the user.');
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData();
        formData.append('Bio', bio);
        if (newImage) {
            formData.append('ProfilePicture', newImage);
        }

        try {
            const response = await fetch('http://localhost:5094/Profile/edit', {
                method: 'POST',
                headers: {
                    // 'Content-Type' should **NOT** be set manually when using FormData
                    'Authorization': `Bearer ${token}`, // Include the authorization token
                },
                body: formData, // The FormData object containing bio and image
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to update the profile');
                return;
            }
            setSuccessMessage('Profile updated successfully');

            await fetchProfileData(); // Fetch the updated profile data

            setTimeout(() => {
                setShowEditModal(false);
                setSuccessMessage('');
            }, 1500);

        }
        catch (error: any) {
            setErrorMessage('An error occurred while updating the profile');
        }
    }

    const handleGridViewChange = (view: React.SetStateAction<string>) => {
        setGridView(view);
    };

    const handleOpenEditModal = () => {
        setBio(userData?.bio || '');
        setNewImage(null);
        setErrorMessage('');
        setShowEditModal(true);
    };

    const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            setNewImage(file);
        }
    }

    return (
        <div className="profile-page bg-transparent text-light py-5" style={{ backgroundColor: '#222', color: '#fff' }}>
            <div className="container">
                {/* Error Messages */}
                {isAuthenticated && profileError && (
                    <div className="alert alert-danger" role="alert">
                        {profileError}
                    </div>
                )}
                {isAuthenticated && actionError && (
                    <div className="alert alert-danger" role="alert">
                        {actionError}
                    </div>
                )}

                {/* Profile Section */}
                <div className="row align-items-center justify-content-center mb-5">
                    {/* Profile Image */}
                    <div className="col-md-4 col-lg-3 text-center text-md-start mb-4 mb-md-0 d-flex justify-content-center">
                        {userData && userData.profilePictureUrl ? (
                            <img
                                src={`http://localhost:5094${userData.profilePictureUrl}`}
                                alt="Profile"
                                className="profile-picture"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '1.2em',
                                    border: 'none',
                                    aspectRatio: '1/1',
                                    marginRight: '2em',
                                }}
                            />
                        ) : (
                            <div
                                className="bg-secondary d-flex justify-content-center align-items-center"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '1.2em',
                                    aspectRatio: '1/1',
                                    marginRight: '2em',
                                }}
                            >
                                <i className="bi bi-person fs-1 text-white"></i>
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="col-md-8 col-lg-6 text-center text-md-start">
                        <h1
                            className="display-6 fw-bold username-text"
                            style={{
                                fontSize: 'clamp(1.2em, 3.5vw, 2.5em)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {userData ? userData.username : 'Loading...'}
                        </h1>
                        <p className="lead" style={{ fontSize: '1.3em', color: '#aaa' }}>
                            {userData ? userData.bio : ''}
                        </p>

                        <div className="d-flex justify-content-center justify-content-md-between mb-3 post-info-container">
                            <span
                                className="post-info"
                                style={{ fontSize: 'clamp(1em, 2vw, 1.4em)', color: '#bbb', margin: '0 1em' }}
                            >
                                {posts ? posts.length : 0} Posts
                            </span>
                            <span
                                className="post-info"
                                style={{ fontSize: 'clamp(1em, 2vw, 1.4em)', color: '#bbb', margin: '0 1em' }}
                            >
                                {userData ? userData.followersCount : 0} Followers
                            </span>
                            <span
                                className="post-info"
                                style={{ fontSize: 'clamp(1em, 2vw, 1.4em)', color: '#bbb', margin: '0 1em' }}
                            >
                                {userData ? userData.followingCount : 0} Following
                            </span>
                        </div>

                        {/* Buttons Section */}
                        <div className="d-flex justify-content-center justify-content-md-start">
                            {isAuthenticated ? (
                                isCurrentUserProfile ? (
                                    // Edit Profile and Create Post Buttons for the current user
                                    <>
                                        <button
                                            className="btn loginbtn-primary btn-lg me-3 w-50"
                                            onClick={handleOpenEditModal}
                                            style={{ width: '50%' }}
                                        >
                                            Edit Profile
                                        </button>
                                    </>
                                ) : (
                                    // Follow/Unfollow Button for other users
                                    <button
                                        onClick={isFollowing ? handleUnfollow : handleFollow}
                                        className={`btn ${
                                            isFollowing ? 'loginbtn-secondary' : 'loginbtn-primary'
                                        } btn-lg w-100`}
                                        style={{ width: '100%' }}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                )
                            ) : (
                                // Login Button for non-logged in users
                                <Link
                                    className="btn loginbtn-primary btn-lg w-100"
                                    to="/login"
                                    style={{ width: '100%' }}
                                >
                                    Login to Follow
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Icons Section */}
                <div className="d-flex justify-content-evenly icon-section">
                    {/* Grid 3x3 Icon */}
                    <div className="me-5">
                        <i
                            id="grid-3x3"
                            className={`bi bi-grid-3x3-gap grid-icon grid-icon-3x3 ${
                                gridView === '3x3' ? 'active-icon' : ''
                            }`}
                            onClick={() => handleGridViewChange('3x3')}
                        ></i>
                    </div>

                    {/* Grid Icon */}
                    <div className="ms-5">
                        <i
                            id="grid-2x2"
                            className={`bi bi-grid grid-icon grid-icon-fill ${
                                gridView === '2x2' ? 'active-icon' : ''
                            }`}
                            onClick={() => handleGridViewChange('2x2')}
                        ></i>
                    </div>
                </div>
            </div>

            {/* User Posts Section */}
            <div id="post-grid" className="profile-posts mt-3 container-fluid px-0 px-md-3">
                {posts && posts.length > 0 ? (
                    <div
                        id="grid-layout"
                        className={`row ${
                            gridView === '3x3'
                                ? 'row-cols-1 row-cols-sm-2 row-cols-md-3'
                                : 'row-cols-1 row-cols-sm-2'
                        } g-3 justify-content-center`}
                    >
                        {posts.map((post) => (
                            <div className="col" key={post.postId}>
                                <div className="card h-100 border-0">
                                    {/* Link image to modal */}
                                    <button
                                        type="button"
                                        className="btn btn-link p-0"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#postModal-${post.postId}`}
                                        style={{ border: 'none', background: 'none' }}
                                    >
                                        <img
                                            src={
                                                post.imageUrls && post.imageUrls.length > 0
                                                    ? `http://localhost:5094${post.imageUrls[0]}` // Use the first image as the post thumbnail
                                                    : ''
                                            }
                                            alt="Post"
                                            className="card-img-top"
                                            style={{
                                                width: '100%',
                                                aspectRatio: '3/4',
                                                objectFit: 'cover',
                                                backgroundColor: 'black',
                                            }}
                                        />
                                    </button>
                                </div>

                                {/* Modal for the post */}
                                <div
                                    className="modal fade p-3"
                                    id={`postModal-${post.postId}`}
                                    tabIndex={-1}
                                    aria-labelledby={`postModalLabel-${post.postId}`}
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content pt-0 pb-0 pe-4 ps-4">
                                            <div id={`post-${post.postId}`}>
                                                {/* Render the post content */}
                                                <PostComponent post={post} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No posts to show</p>
                )}
            </div>

            {showEditModal && (
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            {/* Modal Header */}
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Profile</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body">
                                <div className="edit-post-container">
                                    <form className="edit-post-form" onSubmit={handleSaveChanges}>
                                        {/* Heading */}
                                        <h2 className="edit-post-heading">Edit Profile</h2>

                                        {/* Bio Textarea */}
                                        <textarea
                                            placeholder="Edit your bio..."
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            required
                                        ></textarea>

                                        {/* Image Container */}
                                        <div className="image-container mb-3">
                                            {/* New Image */}
                                            {newImage && (
                                                <div className="image-row">
                                                    <img
                                                        src={URL.createObjectURL(newImage)}
                                                        alt="New Profile"
                                                        className="image-thumbnail"
                                                    />
                                                    <p className="file-name">New Profile Picture</p>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger delete-button"
                                                        onClick={() => setNewImage(null)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* File Input Container */}
                                        <div className="file-input-container">
                                            {/* Add Image Button */}
                                            {!newImage && (
                                                <label
                                                    htmlFor="add-image"
                                                    className="btn loginbtn-secondary file-input-button"
                                                >
                                                    Add Image
                                                </label>
                                            )}
                                            <input
                                                id="add-image"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleAddImage}
                                                multiple={false}
                                            />

                                            {/* Save Changes Button */}
                                            <button type="submit" className="btn loginbtn-primary file-input-button">
                                                Save Changes
                                            </button>
                                        </div>
                                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default ProfilePage;