// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Función para obtener información del token (similar a tu utils/jwt.utils)
  const getUserInfoFromToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Decodificar el token JWT (parte del payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        profileId: payload.profileId || payload.userId,
        rol: payload.rol
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Cargar token al iniciar la app
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('token: ', token);
      
      if (token) {
        const userInfo = await getUserInfoFromToken();
        if (userInfo) {
          setUserId(userInfo.profileId);
          localStorage.setItem('userId', String(userInfo.profileId));
          setUserRol(userInfo.rol);
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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUserId(null);
    setUserRol(null);
    setIsAuthenticated(false);
    // Redirigir al login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userId, 
      userRol, 
      setIsAuthenticated, 
      setUserInfo, 
      logout, 
      reloadUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useMyAuth = () => useContext(AuthContext);