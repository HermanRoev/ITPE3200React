import React, { createContext, useState, useEffect, ReactNode } from "react";

// Definerer strukturen for UserProfile
interface UserProfile {
    username: string;
    bio: string;
    profilePictureUrl: string;
    followers: number;
    following: number;
    posts: { id: string; imageUrl: string }[]; // Enkel struktur for postene
}

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    userProfile: UserProfile | null;
    login: (token: string) => void;
    logout: () => void;
    setUserProfile: (userProfile: UserProfile | null) => void; // Funksjon for å oppdatere userProfile
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    token: null,
    userProfile: null,
    login: () => {},
    logout: () => {},
    setUserProfile: () => {}, // Sett en tom funksjon som kan bli brukt til å oppdatere userProfile
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Hent token fra localStorage på første oppstart
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Hent brukerens profildata når token er tilgjengelig
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setUserProfile(null);
                return;
            }

            try {
                const response = await fetch("http://localhost:5094/Profile/loggedin", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data: { profile: UserProfile; posts: UserProfile["posts"] } = await response.json();

                    // Sørg for at followers og following er definert, hvis ikke settes de til 0
                    const userProfileData = {
                        ...data.profile,
                        posts: data.posts,
                        followers: data.profile.followers || 0,  // Hvis ikke, sett til 0
                        following: data.profile.following || 0,  // Hvis ikke, sett til 0
                    };

                    setUserProfile(userProfileData);
                } else {
                    console.error("Failed to fetch profile data");
                    setUserProfile(null);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setUserProfile(null);
            }
        };

        fetchProfile();
    }, [token]);

    const login = (userToken: string) => {
        localStorage.setItem("token", userToken);
        setToken(userToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUserProfile(null);
        window.location.href = "/";
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, userProfile, login, logout, setUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);



