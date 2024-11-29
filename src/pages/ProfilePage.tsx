import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { followUser, unfollowUser } from "../services/profileService";
import EditProfileModal from "./EditProfileModal";
import CreatePostModal from "./CreatePostModal";

interface Post {
    id: string;
    imageUrl: string;
}

const ProfilePage: React.FC = () => {
    const { userProfile, token, setUserProfile } = useAuth(); // Hent data fra AuthContext, inkludert token
    const [user, setUser] = useState(userProfile || null);
    const [posts, setPosts] = useState<Post[]>(userProfile?.posts || []);
    const [gridLayout, setGridLayout] = useState("3x3");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setUser(userProfile);
            setPosts(userProfile.posts);
        }
    }, [userProfile]);

    const handleFollowToggle = async () => {
        if (!user || !token) {
            alert("You need to log in to follow/unfollow users.");
            return;
        }

        try {
            if (isFollowing) {
                await unfollowUser(user.username, token); // Bruk token fra AuthContext
                setUser((prevUser) =>
                    prevUser ? { ...prevUser, followers: prevUser.followers - 1 } : null
                );
                setIsFollowing(false);
            } else {
                await followUser(user.username, token); // Bruk token fra AuthContext
                setUser((prevUser) =>
                    prevUser ? { ...prevUser, followers: prevUser.followers + 1 } : null
                );
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Failed to toggle follow status:", error);
            alert("An error occurred while trying to update follow status.");
        }
    };

    const handleSaveProfileChanges = (data: { bio: string; profilePicture: File | null }) => {
        if (!user) return;

        // Update the profile in the local state
        const updatedUser = {
            ...user,
            bio: data.bio,
            profilePictureUrl: data.profilePicture
                ? URL.createObjectURL(data.profilePicture) // If there's a new picture, use it
                : user.profilePictureUrl,
        };

        setUser(updatedUser);

        // Also update userProfile in AuthContext
        if (userProfile) {
            userProfile.bio = data.bio;
            userProfile.profilePictureUrl = updatedUser.profilePictureUrl; // Update profile picture URL
            setUserProfile({ ...userProfile });
        }

        // Call onSaveChanges (provided by parent)
        // This function will update the API and ensure changes are saved server-side as well
    };

    const toggleGridLayout = (layout: string) => {
        setGridLayout(layout);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-page bg-transparent text-light py-5" style={{ backgroundColor: "#222", color: "#fff" }}>
            <div className="container">
                {/* Profile Section */}
                <div className="row align-items-center justify-content-center mb-5">
                    {/* Profile Image */}
                    <div className="col-md-4 col-lg-3 text-center text-md-start mb-4 mb-md-0 d-flex justify-content-center">
                        {user.profilePictureUrl ? (
                            <img
                                src={user.profilePictureUrl}
                                alt="Profile Picture"
                                className="profile-picture"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "1.2em",
                                    marginRight: "2em",
                                }}
                            />
                        ) : (
                            <div
                                className="bg-secondary d-flex justify-content-center align-items-center"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    borderRadius: "1.2em",
                                    marginRight: "2em",
                                }}
                            >
                                <i className="bi bi-person fs-1 text-white"></i>
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="col-md-8 col-lg-6 text-center text-md-start">
                        <h1
                            className="display-6 fw-bold"
                            style={{
                                fontSize: "clamp(1.2em, 3.5vw, 2.5em)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {user.username}
                        </h1>
                        <p className="lead" style={{ fontSize: "1.3em", color: "#aaa" }}>
                            {user.bio}
                        </p>

                        <div className="d-flex justify-content-center justify-content-md-between mb-3 post-info-container">
                            <span className="post-info" style={{ fontSize: "clamp(1em, 2vw, 1.4em)", color: "#bbb", margin: "0 1em" }}>
                                {posts.length} Posts
                            </span>
                            <span className="post-info" style={{ fontSize: "clamp(1em, 2vw, 1.4em)", color: "#bbb", margin: "0 1em" }}>
                                {user.followers} Followers
                            </span>
                            <span className="post-info" style={{ fontSize: "clamp(1em, 2vw, 1.4em)", color: "#bbb", margin: "0 1em" }}>
                                {user.following} Following
                            </span>
                        </div>

                        <div className="d-flex justify-content-center justify-content-md-start">
                            {userProfile?.username === user.username ? (
                                <>
                                    <button
                                        className="btn loginbtn-primary btn-lg me-3 w-50"
                                        onClick={() => setShowEditModal(true)}
                                        style={{ width: "50%" }}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-lg  w-50"
                                        onClick={() => setShowCreatePostModal(true)}
                                        style={{ width: "50%" }}
                                    >
                                        Create Post
                                    </button>
                                </>
                            ) : (
                                <button
                                    className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
                                    onClick={handleFollowToggle}
                                    style={{ width: "100%" }}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid Layout Buttons */}
                <div className="d-flex justify-content-evenly icon-section">
                    <div className="me-5">
                        <i
                            id="grid-3x3"
                            className={`bi bi-grid-3x3-gap grid-icon ${gridLayout === "3x3" ? "active-icon" : ""}`}
                            onClick={() => toggleGridLayout("3x3")}
                        ></i>
                    </div>
                    <div className="ms-5">
                        <i
                            id="grid-2x2"
                            className={`bi bi-grid grid-icon ${gridLayout === "2x2" ? "active-icon" : ""}`}
                            onClick={() => toggleGridLayout("2x2")}
                        ></i>
                    </div>
                </div>

                {/* User Posts Section */}
                <div id="post-grid" className="profile-posts mt-3 container-fluid px-0 px-md-3">
                    <div id="grid-layout" className={`row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center ${gridLayout === "2x2" ? "row-cols-md-2" : ""}`}>
                        {posts.map((post) => (
                            <div key={post.id} className="col">
                                <div className="card h-100 border-0">
                                    <img
                                        src={post.imageUrl}
                                        alt={`Post ${post.id}`}
                                        className="card-img-top"
                                        style={{ objectFit: "cover", height: "200px" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <EditProfileModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                user={user}
                onSaveChanges={handleSaveProfileChanges}
            />
            <CreatePostModal
                show={showCreatePostModal}
                handleClose={() => setShowCreatePostModal(false)}
                onCreatePost={() => {}}
            />
        </div>
    );
};

export default ProfilePage;








