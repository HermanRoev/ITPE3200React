import React, { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";
import CreatePostModal from "./CreatePostModal";
import { fetchProfileData, followUser, unfollowUser } from "../services/profileService";
import { useAuth } from "../context/AuthContext";

interface User {
    username: string;
    profilePictureUrl: string;
    bio: string;
    followers: number;
    following: number;
}

interface Post {
    id: string;
    imageUrl: string;
}

const ProfilePage: React.FC = () => {
    const { isAuthenticated, token } = useAuth();
    const [user, setUser] = useState<User>({
        username: "",
        profilePictureUrl: "",
        bio: "",
        followers: 0,
        following: 0,
    });
    const [posts, setPosts] = useState<Post[]>([]);
    const [gridLayout, setGridLayout] = useState("3x3");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (!isAuthenticated || !token) {
                alert("You must be logged in to view this profile.");
                return;
            }

            try {
                const profileData = await fetchProfileData(user.username, token);
                setUser(profileData.username);
                setPosts(profileData.posts);
                setIsCurrentUserProfile(profileData.isCurrentUserProfile);
                setIsFollowing(profileData.isFollowing);
            } catch (error) {
                console.error("Failed to load profile data:", error);
                alert("An error occurred while fetching profile data.");
            }
        };

        loadProfile();
    }, [isAuthenticated, token, user.username]);

    const handleFollowToggle = async () => {
        if (!isAuthenticated) {
            alert("You need to log in to follow/unfollow users.");
            return;
        }

        try {
            if (isFollowing) {
                await unfollowUser(user.username, token!);
                setUser((prev: User) => ({
                    ...prev,
                    followers: prev.followers - 1,
                }));
                setIsFollowing(false);
            } else {
                await followUser(user.username, token!);
                setUser((prev: User) => ({
                    ...prev,
                    followers: prev.followers + 1,
                }));
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Failed to toggle follow status:", error);
            alert("An error occurred while trying to update follow status.");
        }
    };

    const handleSaveProfileChanges = (data: { bio: string; profilePicture: File | null }) => {
        setUser((prev: User) => ({
            ...prev,
            bio: data.bio,
            profilePictureUrl: data.profilePicture
                ? URL.createObjectURL(data.profilePicture)
                : prev.profilePictureUrl,
        }));
    };

    const handleCreatePost = async (postData: { content: string; images: File[] }) => {
        if (!postData.images.length) {
            alert("Please upload at least one image.");
            return;
        }

        // Add the new post to the list
        const newPost: Post = {
            id: Math.random().toString(36).substring(7),
            imageUrl: URL.createObjectURL(postData.images[0]),
        };
        setPosts((prev: Post[]) => [newPost, ...prev]);

        // Close the modal
        setShowCreatePostModal(false);
    };

    const toggleGridLayout = (layout: string) => {
        setGridLayout(layout);
    };

    return (
        <div className="profile-page container py-5">
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
                        {isCurrentUserProfile ? (
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
                onCreatePost={handleCreatePost}
            />
        </div>
    );
};

export default ProfilePage;