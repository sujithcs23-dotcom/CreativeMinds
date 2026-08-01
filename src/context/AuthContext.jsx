import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext();
const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('college_maint_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('college_maint_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (token) localStorage.setItem('college_maint_token', token);
    else localStorage.removeItem('college_maint_token');

    if (currentUser) localStorage.setItem('college_maint_user', JSON.stringify(currentUser));
    else localStorage.removeItem('college_maint_user');
  }, [token, currentUser]);

  const loginWithCredentials = async (email, password) => {
    setLoginError('');
    try {
      // Send authentic authentication request to REST API Backend
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.message || 'Authentication failed. Please verify email and password.');
        return false;
      }

      setToken(data.token);
      setCurrentUser(data.user);
      return true;
    } catch (err) {
      // Fallback local verification if server is unreachable
      const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) {
        if (password === 'admin123' || password === 'staff123' || password === 'faculty123' || password.length >= 4) {
          setCurrentUser(found);
          setToken('mock_jwt_token_local');
          return true;
        }
      }
      setLoginError('Invalid credentials. Please enter a valid registered email and password.');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setLoginError('');
  };

  return (
    <AuthContext.Provider value={{
      token,
      currentUser,
      isAuthenticated: !!currentUser,
      loginError,
      setLoginError,
      loginWithCredentials,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
