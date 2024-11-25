import React, {useState, useEffect }from 'react';


const ProfilePage = () => {
    //State for user profile data
    const [user, setUser] = useState({
        username: "",
        profilePictureUrl: "",
        bio: "",
        followers: 0,
        following: 0,
    });
    const [posts, setPosts] = useState([]); //State for user posts
    const [gridLayout, setGridLayout] = useState("3x3"); // Grid layout state

    // Placeholder useEffect for fetching profile data (replace with API call later)
    useEffect(() => {
        // Mock data for now
        const mockUser = {
            username: "tina",
            profilePictureUrl: "/public/images/test5.jpg",
            bio: "Student",
            followers: 120,
            following: 75,
        };

        const mockPosts = [
            { id: 1, imageUrl: "/public/images/test3.jpg" },
            { id: 2, imageUrl: "/public/images/test4.jpg" },
        ];

        setUser(mockUser);
        setPosts(mockPosts);
    }, []);

    // Function to toggle grid layout
    const toggleGridLayout = (layout) => {
        setGridLayout(layout);
    };

    return (
        <div className="profile-page container py-5">
            {/* Profile Header Section */}
            <div className="row align-items-center mb-4">
                <div className="col-md-4 text-center">
                    {user.profilePictureUrl ? (
                        <img
                            src={user.profilePictureUrl}
                            alt="Profile"
                            className="img-fluid rounded-circle"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            className="bg-secondary rounded-circle d-flex justify-content-center align-items-center"
                            style={{ width: "150px", height: "150px" }}
                        >
                            <i className="bi bi-person fs-1 text-white"></i>
                        </div>
                    )}
                </div>
                <div className="col-md-8 text-center text-md-start">
                    <h1 className="fw-bold">{user.username}</h1>
                    <p className="text-muted">{user.bio}</p>
                    <div className="d-flex justify-content-center justify-content-md-start">
            <span className="me-4">
              <strong>{user.followers}</strong> Followers
            </span>
                        <span>
              <strong>{user.following}</strong> Following
            </span>
                    </div>
                </div>
            </div>

            {/* Grid Toggle Section */}
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

            {/* Posts Section */}
            <div
                className={`row ${
                    gridLayout === "3x3" ? "row-cols-1 row-cols-sm-2 row-cols-md-3" : "row-cols-1 row-cols-sm-2"
                } g-3`}
            >
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
        </div>
    );
};

export default ProfilePage;