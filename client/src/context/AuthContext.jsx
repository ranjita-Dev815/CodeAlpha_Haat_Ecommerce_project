import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem('auth')) || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStored);

  const save = (data) => {
    localStorage.setItem('auth', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth');
    setUser(null);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return save(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return save(data);
  };

  const updateProfile = async (name) => {
    const { data } = await api.put('/auth/profile', { name });
    return save(data);
  };

  // Token expired or user deleted -> the API interceptor fires this event
  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  // Verify a stored token once on load
  useEffect(() => {
    if (readStored()) api.get('/auth/me').catch(() => {});
  }, []);

  const value = useMemo(() => ({ user, login, register, logout, updateProfile }), [user, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);