"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, expiry: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || Cookies.get('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string, expiry: string, user: any) => {

    const options = {
      expires: new Date(expiry), // Set the cookie to expire at the same time as the token
      secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS in production
      path: '/' // Make the cookie available across the entire site
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiry', expiry);
    localStorage.setItem('userData', JSON.stringify(user.id));
    
    Cookies.set('authToken', token, options);
    Cookies.set('userData', JSON.stringify(user.id), options);

    setIsAuthenticated(true);
  };

  const logout = () => {
    // --- Removing from localStorage ---
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userData');
    
    // --- Removing from Cookies ---
    // We need to provide the path to ensure the correct cookie is removed.
    Cookies.remove('authToken', { path: '/' });
    Cookies.remove('userData', { path: '/' });
    
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
