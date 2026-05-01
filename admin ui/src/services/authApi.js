// // src/services/authApi.js
// import axios from "axios";

// const API_BASE_URL = "http://localhost:5001/api";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const authApi = {
//   login: async (email, password) => {
//     try {
//       const response = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       console.log('🔐 Raw login response:', response);
//       console.log('🔐 Response data:', response.data);
      
//       // Return the full response data
//       return response.data;
//     } catch (error) {
//       console.error("Login API Error:", error.response?.data || error.message);
//       throw new Error(
//         error.response?.data?.message ||
//         "Invalid email or password"
//       );
//     }
//   },
// };

// src/services/authApi.js
import axios from "axios";

const API_BASE_URL = "http://10.48.136.233:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("herbisense_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email, password) => {
    try {
      console.log('📤 Login attempt for:', email);
      
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log('🔐 Raw login response:', response);
      console.log('🔐 Response data:', response.data);
      
      // Return the full response data
      return response.data;
    } catch (error) {
      console.error("Login API Error:", error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      }
      if (error.response?.status === 404) {
        throw new Error("Login endpoint not found. Please check the server URL.");
      }
      
      throw new Error(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    }
  },
  
  // Optional: Register new user (if needed)
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'creator' // Default to creator role
      });
      
      return response.data;
    } catch (error) {
      console.error("Registration API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }
};

export default authApi;
