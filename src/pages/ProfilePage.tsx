import React, { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";
import CreatePostModal from "./CreatePostModal";
import { followUser, unfollowUser } from "../services/profileService";
import { useAuth } from "../context/AuthContext";

interface Post {
    id: string;
    imageUrl: string;
}

const ProfilePage: React.FC = () => {
    const { isAuthenticated, userProfile, token, setUserProfile } = useAuth(); // Hent data fra AuthContext, inkludert token
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
        if (!isAuthenticated || !user || !token) {
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
        <div className="profile-page container py-5">
            {/* Profil-oversikt */}
            <div className="row align-items-center mb-4">
                <div className="col-md-4 text-center">
                    {user.profilePictureUrl ? (
                        <img
                            src={user.profilePictureUrl}
                            alt="Profile"
                            className="profile-picture"
                            style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "1.2em",
                            }}
                        />
                    ) : (
                        <div
                            className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
                            style={{
                                width: "200px",
                                height: "200px",
                                borderRadius: "1.2em",
                            }}
                        >
                            <i className="bi bi-person fs-1 text-white"></i>
                        </div>
                    )}
                </div>
                <div className="col-md-8 text-center text-md-start">
                    <h1 className="fw-bold">{user.username}</h1>
                    <p className="text-white">{user.bio}</p>
                    <div className="d-flex justify-content-center justify-content-md-between mb-3">
                        <span>{posts.length} Posts</span>
                        <span>{user.followers} Followers</span>
                        <span>{user.following} Following</span>
                    </div>
                    <div className="mt-3">
                        {userProfile?.username === user.username ? (
                            <>
                                <button
                                    className="btn btn-primary me-3"
                                    onClick={() => setShowEditModal(true)}
                                >
                                    Edit Profile
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreatePostModal(true)}
                                >
                                    Create Post
                                </button>
                            </>
                        ) : (
                            <button
                                className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Posts */}
            <div className="d-flex justify-content-center mb-3">
                <i
                    className={`bi bi-grid-3x3-gap ${gridLayout === "3x3" ? "text-primary" : "text-muted"}`}
                    style={{ fontSize: "1.5rem", cursor: "pointer", marginRight: "1rem" }}
                    onClick={() => toggleGridLayout("3x3")}
                ></i>
                <i
                    className={`bi bi-grid ${gridLayout === "2x2" ? "text-primary" : "text-muted"}`}
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    onClick={() => toggleGridLayout("2x2")}
                ></i>
            </div>
            <div className={`row ${gridLayout === "3x3" ? "row-cols-3" : "row-cols-2"} g-3`}>
                {posts.map((post) => (
                    <div key={post.id} className="col">
                        <div className="card border-0">
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





