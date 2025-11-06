// Archivo: apps/correos-movil/src/context/AuthContext.tsx

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

    // Lógica de carga de datos de usuario
    const loadUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUserId = await AsyncStorage.getItem('userId'); // Intenta leer el ID guardado
            console.log('Context token: ', token);
            console.log('Context storedUserId: ', storedUserId);

            if (token && storedUserId) { // Si tenemos AMBOS
                const userInfo = await getUserInfoFromToken(); // Decodifica el token para rol
                if (userInfo) {
                    setUserId(storedUserId); // Usa el ID guardado
                    setUserRol(userInfo.rol);
                    setIsAuthenticated(true); // <-- Establece 'true' AQUÍ
                    console.log('Usuario cargado desde AsyncStorage:', storedUserId);
                } else {
                    throw new Error('Token inválido o expirado');
                }
            } else {
                // Si falta el token o el ID, resetea
                setIsAuthenticated(false);
                setUserId(null);
                setUserRol(null);
                if (token) await AsyncStorage.removeItem('token'); // Limpia solo lo que esté
                if (storedUserId) await AsyncStorage.removeItem('userId');
            }
        } catch (error) {
            // Si algo falla, resetea el estado
            console.error('Error loading user data:', error);
            setIsAuthenticated(false);
            setUserId(null);
            setUserRol(null);
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
        }
    };
    
    useEffect(() => {
        loadUserData(); // Carga al inicio
    }, []);

    const reloadUserData = async () => {
        await loadUserData(); // Vuelve a cargar los datos
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