// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    token: null,
    login: () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Load token from local storage if it exists
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (userToken: string) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);