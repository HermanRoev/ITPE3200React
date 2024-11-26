// src/mockData.ts

import { PostDto } from './models';

export const mockPostData: PostDto = {
    postId: '1',
    content: 'This is a sample post content that is long enough to test the Read more functionality. It should be more than 100 characters long to ensure we can test both the truncated and expanded views of the content.',
    imageUrls: [
        'https://via.placeholder.com/600x800?text=Image+1',
        'https://via.placeholder.com/600x800?text=Image+2',
        'https://via.placeholder.com/600x800?text=Image+3',
    ],
    userName: 'john_doe',
    profilePictureUrl: 'https://via.placeholder.com/100?text=Profile+Pic',
    isLikedByCurrentUser: false,
    isSavedByCurrentUser: false,
    isOwnedByCurrentUser: true,
    likeCount: 10,
    commentCount: 2,
    comments: [
        {
            commentId: 'c1',
            userName: 'jane_doe',
            content: 'Great post!',
            timeSincePosted: '2 hours ago',
            isCreatedByCurrentUser: false,
        },
        {
            commentId: 'c2',
            userName: 'john_doe',
            content: 'Thank you!',
            timeSincePosted: '1 hour ago',
            isCreatedByCurrentUser: true,
        },
    ],
};