import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
    username: string;
    profilePictureUrl: string;
    email: string;
    phoneNumber: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    userProfile: UserProfile | null;
    login: (token: string) => void;
    logout: () => void;
    authload: boolean;
    fetchProfile: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    token: null,
    userProfile: null,
    login: () => {},
    logout: () => {},
    authload: true,
    fetchProfile: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [authload, setAuthload] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        setAuthload(false);
    }, []);

    // Fetch user profile whenever token changes or on mount
    useEffect(() => {
        if (!token) {
            setUserProfile(null);
            setIsAuthenticated(false);
            return;
        }

        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchProfile = async () => {
        try {
            const response = await fetch("http://localhost:5094/Profile/basic", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data: UserProfile = await response.json();
                setUserProfile(data);
                setIsAuthenticated(true);
            } else {
                console.error("Failed to fetch profile data");
                setUserProfile(null);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
        }
        finally {
            setAuthload(false);
        }
    };

    const login = (userToken: string) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, userProfile, login, logout, authload, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);