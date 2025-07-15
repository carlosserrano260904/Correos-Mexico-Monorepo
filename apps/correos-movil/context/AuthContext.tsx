import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({ isSignedIn: false, login: () => { }, logout: () => { } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    return (
        <AuthContext.Provider value={{
            isSignedIn,
            login: () => setIsSignedIn(true),
            logout: () => setIsSignedIn(false),
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);