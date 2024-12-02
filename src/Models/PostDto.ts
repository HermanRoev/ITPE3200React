import { CommentDto } from './CommentDto';

export interface PostDto {
    postId: string;
    content: string;
    imageUrls: string[];
    userName: string;
    profilePictureUrl: string;
    isLikedByCurrentUser: boolean;
    isSavedByCurrentUser: boolean;
    isOwnedByCurrentUser: boolean;
    likeCount: number;
    commentCount: number;
    comments: CommentDto[];
}