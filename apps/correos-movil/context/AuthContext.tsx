// authContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfoFromToken } from '../utils/jwt.utils';

type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | undefined;
    userRol: string | null;
    setIsAuthenticated: (value: boolean) => void;
    setUserInfo: (info: { userId: string, userRol: string }) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    userId: undefined,
    userRol: null,
    setIsAuthenticated: () => { },
    setUserInfo: () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [userRol, setUserRol] = useState<string | null>(null);

    // Cargar token al iniciar la app
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token')
                const storedId = await AsyncStorage.getItem('userId')
                 if (storedId) {
                    setUserId(storedId);
                } else {
                    console.warn('No se encontró userId en AsyncStorage');
                }
                console.log('token: ', token);
                if (token) {
                    const userInfo = await getUserInfoFromToken();
                    if (userInfo) {
                        setUserId(userInfo.profileId);
                        setUserRol(userInfo.rol);
                        console.log('userInfo: ', userInfo);
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        loadUserData();
    }, []);

    const setUserInfo = (info: { userId: string, userRol: string }) => {
        setUserId(info.userId);
        setUserRol(info.userRol);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        setUserId(undefined);
        setUserRol(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, userRol, setIsAuthenticated, setUserInfo, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useMyAuth = () => useContext(AuthContext);