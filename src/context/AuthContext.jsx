import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('edupulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login(email, password, role);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('edupulse_user', JSON.stringify(res.user));
        localStorage.setItem('edupulse_auth_token', res.token || 'mock_token');
        return res.user;
      } else {
        throw new Error(res.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchPersona = async (role) => {
    setLoading(true);
    try {
      let email = 'alex.mercer@edupulse.edu';
      if (role === 'teacher') email = 'sarah.jenkins@edupulse.edu';
      if (role === 'admin') email = 'admin@edupulse.edu';

      const res = await apiService.login(email, 'demo123', role);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('edupulse_user', JSON.stringify(res.user));
        localStorage.setItem('edupulse_auth_token', res.token || 'mock_token');
      }
    } catch (e) {
      console.error('Persona switch failed', e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edupulse_user');
    localStorage.removeItem('edupulse_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchPersona, loading, error }}>
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
