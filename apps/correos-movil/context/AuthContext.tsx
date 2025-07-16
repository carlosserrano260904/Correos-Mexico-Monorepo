// authContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfoFromToken } from '../utils/jwt.utils';

type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | null;
    userRol: string | null;
    setIsAuthenticated: (value: boolean) => void;
    setUserInfo: (info: { userId: string, userRol: string }) => void;
    logout: () => Promise<void>;
    reloadUserData: () => Promise<void>;
    };

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    userId: null,
    userRol: null,
    setIsAuthenticated: () => { },
    setUserInfo: () => { },
    logout: async () => { },
    reloadUserData: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRol, setUserRol] = useState<string | null>(null);

    // Cargar token al iniciar la app

    const loadUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token')

            console.log('token: ', token);
            if (token) {
                const userInfo = await getUserInfoFromToken();
                if (userInfo) {
                    setUserId(userInfo.profileId);
                    setUserRol(userInfo.rol);
                    console.log('hola');
                    console.log('userInfo: ', userInfo);
                    setIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };
    useEffect(() => {
        loadUserData();
    }, []);

    const reloadUserData = async () => {
        await loadUserData();
    };


    const setUserInfo = (info: { userId: string, userRol: string }) => {
        setUserId(info.userId);
        setUserRol(info.userRol);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        setUserId(null);
        setUserRol(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, userRol, setIsAuthenticated, setUserInfo, logout, reloadUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useMyAuth = () => useContext(AuthContext);