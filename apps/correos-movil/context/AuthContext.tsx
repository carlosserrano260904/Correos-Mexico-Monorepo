// authContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Cargar token al iniciar la app
    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync('token');
            setIsAuthenticated(!!token);
        };
        loadToken();
    }, []);

    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useMyAuth = () => useContext(AuthContext);