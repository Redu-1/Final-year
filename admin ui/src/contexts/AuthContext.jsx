// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the Auth Context
const AuthContext = createContext(null);

// Hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mock user data for demo
  const demoUser = {
    id: 1,
    name: 'Sarah Johnson',
    email: 'admin@herbisense.org',
    role: 'SYSTEM_ADMIN',
    avatar: 'SJ',
    permissions: ['all'],
    department: 'Administration',
    lastLogin: new Date().toISOString()
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is stored in localStorage (for demo)
        const storedUser = localStorage.getItem('herbisense_user');
        const token = localStorage.getItem('herbisense_token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
        
        // Simulate API call to verify token
        setTimeout(() => {
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation (in real app, this would be an API call)
      if (email === 'admin@herbisense.org' && password === 'admin123') {
        const userData = {
          ...demoUser,
          email,
          lastLogin: new Date().toISOString()
        };

        // Store in localStorage (for demo)
        localStorage.setItem('herbisense_user', JSON.stringify(userData));
        localStorage.setItem('herbisense_token', 'demo_jwt_token_here');
        
        setUser(userData);
        navigate('/dashboard');
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('herbisense_user');
    localStorage.removeItem('herbisense_token');
    
    // Reset state
    setUser(null);
    setError(null);
    
    // Redirect to login
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('herbisense_user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (err) {
      setError('Failed to update profile');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.permissions?.includes('all')) return true;
    
    return user.permissions?.includes(permission) || false;
  };

  // Check if user has any of the given permissions
  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    
    if (user.permissions?.includes('all')) return true;
    
    return permissions.some(permission => 
      user.permissions?.includes(permission)
    );
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const storedUser = localStorage.getItem('herbisense_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    hasPermission,
    hasAnyPermission,
    refreshUser,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;