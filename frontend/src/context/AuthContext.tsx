import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    login: (token: string, role: string) => void; // Include token in login
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        // Check localStorage for token and role
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); // Assuming you store role in localStorage

        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    const login = (token: string, role: string) => {
        setIsAuthenticated(true);
        setUserRole(role);
        // Store token and role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
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
