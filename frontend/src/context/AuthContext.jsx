import React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('cybercrime_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('cybercrime_token', data.token);
    localStorage.setItem('cybercrime_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('cybercrime_token');
    localStorage.removeItem('cybercrime_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
