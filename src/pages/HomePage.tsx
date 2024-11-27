import React, { useState, useEffect } from 'react';
import PostComponent from "../components/PostComponent";
import { PostDto } from '../models'; // Ensure this path is correct

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5094/index', { // Replace with your actual API endpoint
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // Uncomment if needed
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: PostDto[] = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []); // **Empty dependency array ensures this runs only once on mount**

    if (loading) {
        return (
            <div className="container mt-3">
                {/* Header Section */}
                <header className="mb-4">
                    <h1 className="display-4 text-center">Home Page</h1>
                </header>
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-center align-items-center gap-3 m-3" role="alert">
                <span>Error fetching posts: {error}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-3">
            {/* Header Section */}
            <header className="mb-4">
                <h1 className="display-4 text-center">Home Page</h1>
            </header>

            {/* Posts Section */}
            <div className="d-flex flex-column align-items-center gap-4">
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <div className="col-12 col-md-8" key={post.postId}>
                            <PostComponent post={post} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;