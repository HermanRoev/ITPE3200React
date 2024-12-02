export interface ProfileDto {
    username: string;
    profilePictureUrl: string;
    isFollowing: boolean;
    isCurrentUserProfile: boolean;
    followersCount: number;
    followingCount: number;
    bio: string;
}