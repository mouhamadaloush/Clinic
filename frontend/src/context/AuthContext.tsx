"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie'; // 1. استيراد مكتبة الكوكيز

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  expiry: string | null;
  userId: number | null;
  isStaff: boolean;
  login: (token: string, expiry: string, user: { id: number; is_staff: boolean }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);

  useEffect(() => {
    // هذا الجزء يبقى كما هو لإعادة تعبئة الحالة عند تحديث الصفحة في المتصفح
    const savedToken = localStorage.getItem('authToken');
    const savedExpiry = localStorage.getItem('tokenExpiry');
    const savedId = localStorage.getItem("id");

    if (savedToken && savedExpiry && savedId) {
      setToken(savedToken);
      setExpiry(savedExpiry);
      setIsAuthenticated(true);
      
      (async () => {
        try {
          const res = await fetch(`https://clinic-ashen.vercel.app/auth/${savedId}/`, {
            headers: { 'Authorization': `Token ${savedToken}` },
            cache: "no-cache"
          });
          if (!res.ok) throw new Error("Failed to fetch user data");

          const user = await res.json();
          setUserId(user.id);
          setIsStaff(user.is_staff);
          localStorage.setItem("id", user.id.toString());
          localStorage.setItem("isStaff", user.is_staff.toString());
        } catch (err) {
          console.error("Error fetching user data:", err);
          logout(); 
        }
      })();
    }
  }, []);

  const login = (token: string, expiry: string, user: { id: number; is_staff: boolean }) => {
    // الحفظ في localStorage كما كان
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiry', expiry);
    localStorage.setItem('id', user.id.toString());
    localStorage.setItem('isStaff', user.is_staff.toString());

    // -- الإضافة الجديدة: الحفظ في الكوكيز ليتمكن الـ Middleware من قراءتها --
    Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'strict' });
    Cookies.set('isStaff', user.is_staff.toString(), { expires: 7, secure: true, sameSite: 'strict' });
    // ----------------------------------------------------------------------

    setToken(token);
    setExpiry(expiry);
    setUserId(user.id);
    setIsStaff(user.is_staff);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // الحذف من localStorage كما كان
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('id');
    localStorage.removeItem('isStaff');

    // -- الإضافة الجديدة: الحذف من الكوكيز --
    Cookies.remove('authToken');
    Cookies.remove('isStaff');
    // ---------------------------------------------

    setIsAuthenticated(false);
    setToken(null);
    setExpiry(null);
    setUserId(null);
    setIsStaff(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, expiry, userId, isStaff, login, logout }}>
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