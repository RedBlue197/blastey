import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    login: (token: string) => void;
    logout: () => void;
}

interface DecodedToken {
    exp: number;
    user_role: string;
    // Add other token fields if necessary
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode<DecodedToken>(token); // Decode the token
            // Check if the token is expired
            if (decoded.exp * 1000 > Date.now()) {
                setIsAuthenticated(true);
                setUserRole(decoded.user_role); // Extract the user role from the decoded token
            } else {
                // Token is expired
                logout();
            }
        }
    }, []);

    const login = (token: string) => {
        const decoded = jwtDecode<DecodedToken>(token);

        // Check if the token is valid
        if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            setUserRole(decoded.user_role); // Set user role from the token
            localStorage.setItem('token', token);
        } else {
            console.error("Token is expired");
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
