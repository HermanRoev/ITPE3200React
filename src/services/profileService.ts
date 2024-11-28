const API_BASE_URL = "http://localhost:44349"; // Base URL til API-en

// Typedefinisjon for CreatePostData
interface CreatePostData {
    content: string;
    images: File[];
}

// Hent profildata
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
            throw new Error(`Failed to fetch profile data: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching profile data:", error);
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
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            throw new Error("Failed to follow user");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in followUser:", error);
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
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            throw new Error("Failed to unfollow user");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in unfollowUser:", error);
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
            throw new Error("Failed to create post");
        }

        return await response.json(); // Returner den nye posten
    } catch (error) {
        console.error("Error in createPost:", error);
        throw error;
    }
};