import React from 'react';
import PostComponent from './PostComponent';
import { mockPostData } from '../mockData';
import { AuthProvider } from '../context/AuthContext';

const PostComponentTest: React.FC = () => {
    return (
        <AuthProvider>
            <div className="container">
                <h1>Post Component Test</h1>
                <PostComponent post={mockPostData} />
            </div>
        </AuthProvider>
    );
};

export default PostComponentTest;