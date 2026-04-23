// src/services/conditionApi.js
import axios from "axios";

const API_BASE_URL = "https://herbisense-api.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token attached for conditions API:', config.url);
  } else {
    console.warn('⚠️ No token found for conditions API');
  }
  return config;
});

export const conditionApi = {
  // Get all conditions
  getAllConditions: async () => {
    try {
      console.log('📤 Fetching all conditions');
      const response = await api.get("/conditions");
      console.log('✅ Conditions fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch conditions:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get a single condition by ID
  getConditionById: async (id) => {
    try {
      console.log(`📤 Fetching condition with ID: ${id}`);
      const response = await api.get(`/conditions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch condition ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new condition
  createCondition: async (data) => {
    try {
      if (!data.name?.trim()) throw new Error('Condition name is required');
      
      const apiData = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
      };
      
      console.log('📤 Creating condition:', apiData);
      const response = await api.post("/conditions", apiData);
      console.log('✅ Condition created:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create condition:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update a condition
  updateCondition: async (id, data) => {
    try {
      if (!id) throw new Error('Condition ID is required');
      if (!data.name?.trim()) throw new Error('Condition name is required');
      
      const apiData = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
      };
      
      console.log(`📤 Updating condition ${id}:`, apiData);
      const response = await api.put(`/conditions/${id}`, apiData);
      console.log('✅ Condition updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to update condition ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a condition
  deleteCondition: async (id) => {
    try {
      if (!id) throw new Error('Condition ID is required');
      
      console.log(`📤 Deleting condition: ${id}`);
      const response = await api.delete(`/conditions/${id}`);
      console.log('✅ Condition deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to delete condition ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};