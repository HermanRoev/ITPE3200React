export interface CommentDto {
    commentId: string;
    userName: string;
    content: string;
    timeSincePosted: string;
    isCreatedByCurrentUser: boolean;
}