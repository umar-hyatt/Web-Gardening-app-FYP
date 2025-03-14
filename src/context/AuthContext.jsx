import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getProfile } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile()
        .then(response => {
          setUser(response.data);
          localStorage.setItem('isAuthenticated', 'true'); // ✅ Mark User as Authenticated
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ username, password }) => { // ✅ Fixed Parameter
    try {
      const response = await loginApi({ username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true'); // ✅ Mark User as Authenticated
      setUser(user);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerApi(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      setUser(user);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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
