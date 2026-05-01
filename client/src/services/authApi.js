// src/services/authApi.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.48.136.233:5001/api';

export const authApi = {
  // Login user
  login: async (email, password) => {
    try {
      console.log('📤 Logging in user:', email);
      console.log('📤 API URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log('✅ Login response:', data);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check the server URL.');
        } else {
          throw new Error(data.message || 'Login failed');
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ Login error:', error.message);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to the server. Please check if the backend is running at ' + API_BASE_URL);
      }
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      console.log('📤 Registering user:', { ...userData, password: '[REDACTED]' });
      console.log('📤 API URL:', `${API_BASE_URL}/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password
        })
      });
      
      const data = await response.json();
      console.log('✅ Registration response:', data);
      
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('User with this email already exists');
        } else if (response.status === 400) {
          throw new Error(data.message || 'Invalid registration data');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check the server URL.');
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to the server. Please check if the backend is running at ' + API_BASE_URL);
      }
      throw error;
    }
  }
};

export default authApi;
