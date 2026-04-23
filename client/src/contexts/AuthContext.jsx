// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    try {
      const savedUser = localStorage.getItem('herbisense_user');
      const savedToken = localStorage.getItem('herbisense_token');
      
      if (savedUser && savedUser !== 'undefined' && savedToken) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        console.log('✅ Auth loaded from localStorage, token exists:', !!savedToken);
      } else {
        // Clear invalid data
        localStorage.removeItem('herbisense_user');
        localStorage.removeItem('herbisense_token');
        console.log('⚠️ No valid auth data found in localStorage');
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('herbisense_user');
      localStorage.removeItem('herbisense_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      console.log('Login response:', response);
      
      // Handle different response structures
      let userData = null;
      let authToken = null;
      
      // Based on your API screenshot: { success: true, data: { user: {...}, token: "..." } }
      if (response.data) {
        userData = response.data.user || response.data;
        authToken = response.data.token || response.token;
      } else {
        userData = response.user || response;
        authToken = response.token;
      }
      
      if (!authToken || !userData) {
        throw new Error('Invalid response structure');
      }
      
      // Save user and token to localStorage
      localStorage.setItem('herbisense_token', authToken);
      localStorage.setItem('herbisense_user', JSON.stringify(userData));
      
      setUser(userData);
      setToken(authToken);
      console.log('✅ Login successful, token saved');
      
      return { success: true };
    } catch (error) {
      console.error('Login error in context:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      console.log('Register response:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('herbisense_token');
    localStorage.removeItem('herbisense_user');
    setUser(null);
    setToken(null);
    console.log('✅ Logout complete');
  };

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      // Clean token if it has quotes
      const cleanToken = token.replace(/^["']|["']$/g, '');
      headers['Authorization'] = `Bearer ${cleanToken}`;
    }
    return headers;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      loading,
      getAuthHeaders 
    }}>
      {children}
    </AuthContext.Provider>
  );
};