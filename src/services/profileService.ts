const API_BASE_URL = "http://localhost:5094"; // Base-URL til API-en

// Typedefinisjon for CreatePostData
interface CreatePostData {
    content: string;
    images: File[];
}

// Ny funksjon: Hent grunnleggende data for den innloggede brukeren
export const fetchLoggedInUserProfile = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/basic`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - Token may be invalid or expired.");
            }
            throw new Error(`Failed to fetch logged-in user profile: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching logged-in user profile:", error);
        throw error;
    }
};

// Hent profildata for en spesifikk bruker
export const fetchProfileData = async (username: string, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/${username}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - Token may be invalid.");
            }
            throw new Error(`Failed to fetch profile data for ${username}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching profile data:", error);
        throw error;
    }
};

// Hent innlegg for en spesifikk bruker
export const fetchUserPosts = async (username: string, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/${username}/posts`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - Token may be invalid.");
            }
            throw new Error(`Failed to fetch posts for user ${username}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
};

// Følg en bruker
export const followUser = async (username: string, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/follow`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(username), // Sender kun brukernavn
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - Token may be invalid.");
            }
            throw new Error(`Failed to follow user ${username}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error following user ${username}:`, error);
        throw error;
    }
};

// Avfølg en bruker
export const unfollowUser = async (username: string, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/unfollow`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(username), // Sender kun brukernavn
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - Token may be invalid.");
            }
            throw new Error(`Failed to unfollow user ${username}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error unfollowing user ${username}:`, error);
        throw error;
    }
};

// Opprett en ny post
export const createPost = async (postData: FormData, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: postData, // Ingen Content-Type; FormData håndterer dette
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - Token may be invalid.");
            }
            throw new Error(`Failed to create post: ${response.statusText}`);
        }

        return await response.json(); // Returner den nye posten
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

