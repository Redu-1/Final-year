// src/services/herbApi.js
import axios from "axios";

const API_BASE_URL = "https://herbisense-api.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token attached for:', config.url);
  } else {
    console.warn('⚠️ No token found for:', config.url);
  }
  
  return config;
});

// Log responses for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Helper function to normalize status to lowercase
const normalizeStatus = (status) => {
  if (!status) return 'pending';
  return status.toLowerCase();
};

// Helper function to extract condition IDs from conditions array
const extractConditionIds = (herb) => {
  // Check if conditions array exists and has items
  if (herb.conditions && Array.isArray(herb.conditions) && herb.conditions.length > 0) {
    return herb.conditions.map(c => c.id);
  }
  // Fallback to conditionIds if it exists
  if (herb.conditionIds && Array.isArray(herb.conditionIds)) {
    return herb.conditionIds;
  }
  // Fallback to single condition_id
  if (herb.condition_id) {
    return [herb.condition_id];
  }
  return [];
};

// Helper function to extract condition names from conditions array
const extractConditionNames = (herb) => {
  if (herb.conditions && Array.isArray(herb.conditions) && herb.conditions.length > 0) {
    return herb.conditions.map(c => c.name);
  }
  return [];
};

export const herbApi = {
  // Create a new herb with multiple conditions support
  createHerb: async (data) => {
    try {
      if (!data.name?.trim()) throw new Error('Herb name is required');
      if (!data.scientificName?.trim()) throw new Error('Scientific name is required');
      if (!data.description?.trim()) throw new Error('Description is required');
      if (!data.safetyWarning?.trim()) throw new Error('Safety warning is required');
      
      if (!data.conditionIds || data.conditionIds.length === 0) {
        throw new Error('At least one condition is required');
      }

      // Filter out null, undefined, and empty values, then convert to numbers if possible
      const conditionIdsArray = data.conditionIds
        .filter(id => id !== null && id !== undefined && id !== '')
        .map(id => {
          const numId = Number(id);
          return isNaN(numId) ? id : numId;
        });
      
      if (conditionIdsArray.length === 0) {
        throw new Error('No valid condition IDs provided');
      }
      
      console.log('✅ Condition IDs array (cleaned):', conditionIdsArray);
      
      // Use snake_case for API fields (backend expects snake_case)
      const apiData = {
        name: data.name.trim(),
        scientific_name: data.scientificName.trim(),
        description: data.description.trim(),
        preparation: data.preparation?.trim() || "No preparation information available",
        safety_warning: data.safetyWarning.trim(),
        source: data.source?.trim() || "",
        conditionIds: conditionIdsArray,
        status: "pending"
      };
      
      console.log('📤 Creating herb with API data:', JSON.stringify(apiData, null, 2));
      const response = await api.post("/herbs/create", apiData);
      console.log('✅ Herb created:', response.data);
      
      let herbData;
      if (response.data && response.data.success && response.data.data) {
        herbData = response.data.data;
      } else if (response.data && response.data.data) {
        herbData = response.data.data;
      } else {
        herbData = response.data;
      }
      
      const normalizedStatus = normalizeStatus(herbData.status);
      
      return {
        id: herbData.id,
        name: herbData.name,
        scientificName: herbData.scientific_name || herbData.scientificName,
        description: herbData.description,
        preparation: herbData.preparation,
        safetyWarning: herbData.safety_warning || herbData.safetyWarning,
        source: herbData.source || "",
        status: normalizedStatus,
        createdAt: herbData.created_at || herbData.createdAt,
        updatedAt: herbData.updated_at || herbData.updatedAt,
        conditionIds: extractConditionIds(herbData),
        conditionNames: extractConditionNames(herbData),
        imageUrl: herbData.image_url || null
      };
    } catch (error) {
      console.error('❌ Create herb error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please log in again');
      }
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      throw new Error(errorMessage || 'Failed to create herb');
    }
  },

  // Upload image for a herb
  uploadHerbImage: async (herbId, imageFile) => {
    try {
      if (!herbId) throw new Error('Herb ID is required');
      if (!imageFile) throw new Error('Image file is required');

      const formData = new FormData();
      formData.append('herbId', herbId);
      formData.append('image', imageFile);

      console.log(`📤 Uploading image for herb: ${herbId}`);
      console.log('Image details:', {
        name: imageFile.name,
        size: `${(imageFile.size / 1024).toFixed(2)} KB`,
        type: imageFile.type
      });

      const response = await api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Raw upload response:', JSON.stringify(response.data, null, 2));
      
      const imageUrl = response.data?.data?.image_url || null;
      
      console.log('📸 Extracted image URL:', imageUrl);
      
      if (!imageUrl) {
        console.warn('⚠️ No image_url found in response. Response structure:', Object.keys(response.data));
      }
      
      return {
        success: response.data?.success === true,
        imageUrl: imageUrl,
        message: response.data?.message || 'Image uploaded successfully',
        data: response.data?.data
      };
    } catch (error) {
      console.error('❌ Image upload error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Image upload failed';
      throw new Error(errorMessage);
    }
  },

  // Get image URL for a herb from uploads API
  getHerbImage: async (herbId) => {
    try {
      if (!herbId) throw new Error('Herb ID is required');
      
      console.log(`📸 Fetching image for herb ID: ${herbId}`);
      const response = await api.get(`/uploads/${herbId}`);
      console.log('✅ Uploads API response:', response.data);
      
      if (response.data?.success && response.data?.data?.length > 0) {
        const imageUrl = response.data.data[0].image_url;
        console.log(`📸 Found image URL: ${imageUrl}`);
        return imageUrl;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Failed to fetch image for herb ${herbId}:`, error);
      return null;
    }
  },

  updateHerbStatus: async (id, status) => {
    try {
      if (!id) throw new Error('Herb ID is required');
      if (!status) throw new Error('Status is required');

      const normalizedStatus = status.toLowerCase();
      const apiData = { status: normalizedStatus };
      
      console.log(`📤 Updating herb status ${id} to: "${normalizedStatus}"`);
      const response = await api.patch(`/herbs/${id}/status`, apiData);
      console.log('✅ Herb status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update herb status error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to update herb status');
    }
  },

  getPublishedHerbs: async (page = 1, limit = 100) => {
    try {
      console.log(`📤 Fetching published herbs - page ${page}, limit ${limit}`);
      const response = await api.get(`/herbs/published?page=${page}&limit=${limit}`);
      
      const result = response.data;
      console.log('✅ Published herbs fetched:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch herbs');
      }
      
      const herbs = (result.data || []).map(herb => {
        const conditionIds = extractConditionIds(herb);
        const conditionNames = extractConditionNames(herb);
        
        // ✅ FIX: Use camelCase field names from API
        console.log(`📋 Herb "${herb.name}" - scientificName:`, herb.scientificName);
        console.log(`📋 Herb "${herb.name}" - safetyWarning:`, herb.safetyWarning);
        
        return {
          id: herb.id,
          name: herb.name,
          scientificName: herb.scientificName || herb.scientific_name,
          description: herb.description,
          preparation: herb.preparation,
          safetyWarning: herb.safetyWarning || herb.safety_warning,
          source: herb.source || "",
          status: normalizeStatus(herb.status),
          isPublished: normalizeStatus(herb.status) === 'published',
          imageUrl: herb.image_url || herb.imageUrl || null,
          createdAt: herb.created_at || herb.createdAt,
          updatedAt: herb.updated_at || herb.updatedAt,
          createdBy: herb.created_by || herb.createdBy,
          averageRating: herb.average_rating || herb.averageRating,
          ratingCount: herb.rating_count || herb.ratingCount,
          favoriteCount: herb.favorite_count || herb.favoriteCount,
          conditionIds: conditionIds,
          conditionNames: conditionNames
        };
      });
      
      return {
        herbs,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('❌ Get published herbs error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch herbs');
    }
  },

  getUnpublishedHerbs: async (page = 1, limit = 100) => {
    try {
      console.log(`📤 Fetching unpublished herbs - page ${page}, limit ${limit}`);
      const response = await api.get(`/herbs/unpublished?page=${page}&limit=${limit}`);
      
      const result = response.data;
      console.log('✅ Unpublished herbs fetched:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch herbs');
      }
      
      const herbs = (result.data || []).map(herb => {
        const conditionIds = extractConditionIds(herb);
        const conditionNames = extractConditionNames(herb);
        
        // ✅ FIX: Use camelCase field names from API
        return {
          id: herb.id,
          name: herb.name,
          scientificName: herb.scientificName || herb.scientific_name,
          description: herb.description,
          preparation: herb.preparation,
          safetyWarning: herb.safetyWarning || herb.safety_warning,
          source: herb.source || "",
          status: normalizeStatus(herb.status),
          isPublished: false,
          imageUrl: herb.image_url || herb.imageUrl || null,
          createdAt: herb.created_at || herb.createdAt,
          updatedAt: herb.updated_at || herb.updatedAt,
          createdBy: herb.created_by || herb.createdBy,
          averageRating: herb.average_rating || herb.averageRating,
          ratingCount: herb.rating_count || herb.ratingCount,
          favoriteCount: herb.favorite_count || herb.favoriteCount,
          conditionIds: conditionIds,
          conditionNames: conditionNames
        };
      });
      
      return {
        herbs,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('❌ Get unpublished herbs error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch herbs');
    }
  },

  getAllHerbs: async () => {
    try {
      console.log('📤 Fetching ALL herbs');
      
      const [publishedRes, unpublishedRes] = await Promise.allSettled([
        api.get("/herbs/published?limit=100"),
        api.get("/herbs/unpublished?limit=100")
      ]);
      
      let allHerbs = [];
      
      const processHerb = (herb) => {
        // ✅ FIX: Use camelCase field names from API
        console.log(`📋 Processing herb "${herb.name}":`, {
          scientificName: herb.scientificName,
          safetyWarning: herb.safetyWarning
        });
        
        return {
          id: herb.id,
          name: herb.name,
          scientificName: herb.scientificName || herb.scientific_name,
          description: herb.description,
          preparation: herb.preparation,
          safetyWarning: herb.safetyWarning || herb.safety_warning,
          source: herb.source || "",
          status: normalizeStatus(herb.status),
          isPublished: normalizeStatus(herb.status) === 'published',
          imageUrl: herb.image_url || herb.imageUrl || null,
          createdAt: herb.created_at || herb.createdAt,
          updatedAt: herb.updated_at || herb.updatedAt,
          createdBy: herb.created_by || herb.createdBy,
          averageRating: herb.average_rating || herb.averageRating,
          ratingCount: herb.rating_count || herb.ratingCount,
          favoriteCount: herb.favorite_count || herb.favoriteCount,
          conditionIds: extractConditionIds(herb),
          conditionNames: extractConditionNames(herb)
        };
      };
      
      if (publishedRes.status === 'fulfilled' && publishedRes.value.data?.success) {
        const publishedData = publishedRes.value.data.data || [];
        const publishedHerbs = publishedData.map(processHerb);
        allHerbs = [...allHerbs, ...publishedHerbs];
      }
      
      if (unpublishedRes.status === 'fulfilled' && unpublishedRes.value.data?.success) {
        const unpublishedData = unpublishedRes.value.data.data || [];
        const unpublishedHerbs = unpublishedData.map(processHerb);
        allHerbs = [...allHerbs, ...unpublishedHerbs];
      }
      
      const uniqueHerbs = [];
      const seenIds = new Set();
      for (const herb of allHerbs) {
        if (!seenIds.has(herb.id)) {
          seenIds.add(herb.id);
          uniqueHerbs.push(herb);
        }
      }
      
      uniqueHerbs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      // Log sample to verify data
      if (uniqueHerbs.length > 0) {
        console.log('✅ Sample herb after fix:', {
          name: uniqueHerbs[0].name,
          scientificName: uniqueHerbs[0].scientificName,
          safetyWarning: uniqueHerbs[0].safetyWarning,
          description: uniqueHerbs[0].description
        });
      }
      
      console.log(`✅ Total herbs fetched: ${uniqueHerbs.length}`);
      console.log('Status breakdown:', {
        published: uniqueHerbs.filter(h => h.status === 'published').length,
        pending: uniqueHerbs.filter(h => h.status === 'pending').length,
        draft: uniqueHerbs.filter(h => h.status === 'draft').length,
        withImages: uniqueHerbs.filter(h => h.imageUrl).length
      });
      
      return uniqueHerbs;
    } catch (error) {
      console.error('❌ Get all herbs error:', error);
      throw new Error('Failed to fetch herbs');
    }
  },

  getHerbById: async (id) => {
    try {
      if (!id) throw new Error('Herb ID is required');

      console.log(`📤 Fetching herb with ID: ${id}`);
      const response = await api.get(`/herbs/${id}`);
      
      const result = response.data;
      
      if (!result.success) {
        throw new Error(result.message || 'Herb not found');
      }
      
      const herb = result.data || result;
      
      console.log(`📋 Herb "${herb.name}" - scientificName:`, herb.scientificName);
      console.log(`📋 Herb "${herb.name}" - safetyWarning:`, herb.safetyWarning);
      
      return {
        id: herb.id,
        name: herb.name,
        scientificName: herb.scientificName || herb.scientific_name,
        description: herb.description,
        preparation: herb.preparation,
        safetyWarning: herb.safetyWarning || herb.safety_warning,
        source: herb.source || "",
        status: normalizeStatus(herb.status),
        isPublished: normalizeStatus(herb.status) === 'published',
        imageUrl: herb.image_url || herb.imageUrl || null,
        createdAt: herb.created_at || herb.createdAt,
        updatedAt: herb.updated_at || herb.updatedAt,
        createdBy: herb.created_by || herb.createdBy,
        averageRating: herb.average_rating || herb.averageRating,
        ratingCount: herb.rating_count || herb.ratingCount,
        favoriteCount: herb.favorite_count || herb.favoriteCount,
        conditionIds: extractConditionIds(herb),
        conditionNames: extractConditionNames(herb)
      };
    } catch (error) {
      console.error('❌ Get herb error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch herb');
    }
  },

  updateHerb: async (id, data) => {
    try {
      if (!id) throw new Error('Herb ID is required');
      if (!data.name?.trim()) throw new Error('Herb name is required');
      if (!data.scientificName?.trim()) throw new Error('Scientific name is required');
      if (!data.description?.trim()) throw new Error('Description is required');
      if (!data.safetyWarning?.trim()) throw new Error('Safety warning is required');

      let conditionIdsArray = [];
      if (data.conditionIds && Array.isArray(data.conditionIds)) {
        conditionIdsArray = data.conditionIds
          .filter(id => id !== null && id !== undefined && id !== '')
          .map(id => {
            const numId = Number(id);
            return isNaN(numId) ? id : numId;
          });
      } else if (data.conditionId) {
        const numId = Number(data.conditionId);
        conditionIdsArray = [isNaN(numId) ? data.conditionId : numId];
      }

      const apiData = {
        name: data.name.trim(),
        scientificName: data.scientificName.trim(),
        description: data.description.trim(),
        preparation: data.preparation?.trim() || "No preparation information available",
        safetyWarning: data.safetyWarning.trim(),
        source: data.source?.trim() || "",
        status: data.status ? data.status.toLowerCase() : 'pending',
        conditionIds: conditionIdsArray
      };
      
      console.log(`📤 Updating herb ${id}:`, apiData);
      const response = await api.put(`/herbs/update/${id}`, apiData);
      console.log('✅ Herb updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update herb error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to update herb');
    }
  },

  deleteHerb: async (id) => {
    try {
      if (!id) throw new Error('Herb ID is required');

      console.log(`📤 Deleting herb: ${id}`);
      const response = await api.delete(`/herbs/delete/${id}`);
      console.log('✅ Herb deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete herb error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please log in again');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete herb');
    }
  }
};

export const getApiBaseUrl = () => API_BASE_URL;




// // src/services/herbApi.js
// import axios from "axios";

// const API_BASE_URL = "https://herbisense-api.onrender.com/api";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
  
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log('🔑 Token attached for:', config.url);
//   } else {
//     console.warn('⚠️ No token found for:', config.url);
//   }
  
//   return config;
// });

// // Log responses for debugging
// api.interceptors.response.use(
//   (response) => {
//     console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
//     return response;
//   },
//   (error) => {
//     console.error('❌ API Error:', {
//       url: error.config?.url,
//       method: error.config?.method,
//       status: error.response?.status,
//       data: error.response?.data
//     });
//     return Promise.reject(error);
//   }
// );

// // Helper function to normalize status to lowercase
// const normalizeStatus = (status) => {
//   if (!status) return 'pending';
//   return status.toLowerCase();
// };

// // Helper function to extract condition IDs from conditions array
// const extractConditionIds = (herb) => {
//   // Check if conditions array exists and has items
//   if (herb.conditions && Array.isArray(herb.conditions) && herb.conditions.length > 0) {
//     return herb.conditions.map(c => c.id);
//   }
//   // Fallback to conditionIds if it exists
//   if (herb.conditionIds && Array.isArray(herb.conditionIds)) {
//     return herb.conditionIds;
//   }
//   // Fallback to single condition_id
//   if (herb.condition_id) {
//     return [herb.condition_id];
//   }
//   return [];
// };

// // Helper function to extract condition names from conditions array
// const extractConditionNames = (herb) => {
//   if (herb.conditions && Array.isArray(herb.conditions) && herb.conditions.length > 0) {
//     return herb.conditions.map(c => c.name);
//   }
//   return [];
// };

// export const herbApi = {
//   // Create a new herb with multiple conditions support
//   createHerb: async (data) => {
//     try {
//       if (!data.name?.trim()) throw new Error('Herb name is required');
//       if (!data.scientificName?.trim()) throw new Error('Scientific name is required');
//       if (!data.description?.trim()) throw new Error('Description is required');
//       if (!data.safetyWarning?.trim()) throw new Error('Safety warning is required');
      
//       if (!data.conditionIds || data.conditionIds.length === 0) {
//         throw new Error('At least one condition is required');
//       }

//       const conditionIdsArray = data.conditionIds.map(id => Number(id));
//       console.log('✅ Condition IDs array:', conditionIdsArray);
      
//       const apiData = {
//         name: data.name.trim(),
//         scientificName: data.scientificName.trim(),
//         description: data.description.trim(),
//         preparation: data.preparation?.trim() || "No preparation information available",
//         safetyWarning: data.safetyWarning.trim(),
//         source: data.source?.trim() || "",
//         conditionIds: conditionIdsArray,
//         status: "pending"
//       };
      
//       console.log('📤 Creating herb with API data:', JSON.stringify(apiData, null, 2));
//       const response = await api.post("/herbs/create", apiData);
//       console.log('✅ Herb created:', response.data);
      
//       let herbData;
//       if (response.data && response.data.success && response.data.data) {
//         herbData = response.data.data;
//       } else if (response.data && response.data.data) {
//         herbData = response.data.data;
//       } else {
//         herbData = response.data;
//       }
      
//       const normalizedStatus = normalizeStatus(herbData.status);
      
//       return {
//         id: herbData.id,
//         name: herbData.name,
//         scientificName: herbData.scientific_name || herbData.scientificName,
//         description: herbData.description,
//         preparation: herbData.preparation,
//         safetyWarning: herbData.safety_warning || herbData.safetyWarning,
//         source: herbData.source || "",
//         status: normalizedStatus,
//         createdAt: herbData.created_at || herbData.createdAt,
//         updatedAt: herbData.updated_at || herbData.updatedAt,
//         conditionIds: extractConditionIds(herbData),
//         conditionNames: extractConditionNames(herbData),
//         imageUrl: herbData.image_url || null
//       };
//     } catch (error) {
//       console.error('❌ Create herb error:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         throw new Error('Unauthorized - Please log in again');
//       }
//       const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
//       throw new Error(errorMessage || 'Failed to create herb');
//     }
//   },

//   // ✅ Upload image for a herb
//   uploadHerbImage: async (herbId, imageFile) => {
//     try {
//       if (!herbId) throw new Error('Herb ID is required');
//       if (!imageFile) throw new Error('Image file is required');

//       const formData = new FormData();
//       formData.append('herbId', herbId);
//       formData.append('image', imageFile);

//       console.log(`📤 Uploading image for herb: ${herbId}`);
//       console.log('Image details:', {
//         name: imageFile.name,
//         size: `${(imageFile.size / 1024).toFixed(2)} KB`,
//         type: imageFile.type
//       });

//       const response = await api.post('/uploads', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('✅ Raw upload response:', JSON.stringify(response.data, null, 2));
      
//       const imageUrl = response.data?.data?.image_url || null;
      
//       console.log('📸 Extracted image URL:', imageUrl);
      
//       if (!imageUrl) {
//         console.warn('⚠️ No image_url found in response. Response structure:', Object.keys(response.data));
//       }
      
//       return {
//         success: response.data?.success === true,
//         imageUrl: imageUrl,
//         message: response.data?.message || 'Image uploaded successfully',
//         data: response.data?.data
//       };
//     } catch (error) {
//       console.error('❌ Image upload error:', error.response?.data || error.message);
//       const errorMessage = error.response?.data?.message || error.message || 'Image upload failed';
//       throw new Error(errorMessage);
//     }
//   },

//   // ✅ Get image URL for a herb from uploads API
//   getHerbImage: async (herbId) => {
//     try {
//       if (!herbId) throw new Error('Herb ID is required');
      
//       console.log(`📸 Fetching image for herb ID: ${herbId}`);
//       const response = await api.get(`/uploads/${herbId}`);
//       console.log('✅ Uploads API response:', response.data);
      
//       if (response.data?.success && response.data?.data?.length > 0) {
//         const imageUrl = response.data.data[0].image_url;
//         console.log(`📸 Found image URL: ${imageUrl}`);
//         return imageUrl;
//       }
      
//       return null;
//     } catch (error) {
//       console.error(`❌ Failed to fetch image for herb ${herbId}:`, error);
//       return null;
//     }
//   },

//   updateHerbStatus: async (id, status) => {
//     try {
//       if (!id) throw new Error('Herb ID is required');
//       if (!status) throw new Error('Status is required');

//       const normalizedStatus = status.toLowerCase();
//       const apiData = { status: normalizedStatus };
      
//       console.log(`📤 Updating herb status ${id} to: "${normalizedStatus}"`);
//       const response = await api.patch(`/herbs/${id}/status`, apiData);
//       console.log('✅ Herb status updated:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Update herb status error:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         throw new Error('Unauthorized - Please log in again');
//       }
//       throw new Error(error.response?.data?.message || 'Failed to update herb status');
//     }
//   },

//   getPublishedHerbs: async (page = 1, limit = 100) => {
//     try {
//       console.log(`📤 Fetching published herbs - page ${page}, limit ${limit}`);
//       const response = await api.get(`/herbs/published?page=${page}&limit=${limit}`);
      
//       const result = response.data;
//       console.log('✅ Published herbs fetched:', result);
      
//       if (!result.success) {
//         throw new Error(result.message || 'Failed to fetch herbs');
//       }
      
//       const herbs = (result.data || []).map(herb => {
//         const conditionIds = extractConditionIds(herb);
//         const conditionNames = extractConditionNames(herb);
//         console.log(`📋 Herb "${herb.name}" has conditions:`, conditionNames);
        
//         return {
//           id: herb.id,
//           name: herb.name,
//           scientificName: herb.scientific_name,
//           description: herb.description,
//           preparation: herb.preparation,
//           safetyWarning: herb.safety_warning,
//           source: herb.source || "",
//           status: normalizeStatus(herb.status),
//           isPublished: normalizeStatus(herb.status) === 'published',
//           imageUrl: herb.image_url || null,
//           createdAt: herb.created_at,
//           updatedAt: herb.updated_at,
//           createdBy: herb.created_by,
//           averageRating: herb.average_rating,
//           ratingCount: herb.rating_count,
//           favoriteCount: herb.favorite_count,
//           conditionIds: conditionIds,
//           conditionNames: conditionNames
//         };
//       });
      
//       return {
//         herbs,
//         pagination: result.pagination
//       };
//     } catch (error) {
//       console.error('❌ Get published herbs error:', error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || 'Failed to fetch herbs');
//     }
//   },

//   getUnpublishedHerbs: async (page = 1, limit = 100) => {
//     try {
//       console.log(`📤 Fetching unpublished herbs - page ${page}, limit ${limit}`);
//       const response = await api.get(`/herbs/unpublished?page=${page}&limit=${limit}`);
      
//       const result = response.data;
//       console.log('✅ Unpublished herbs fetched:', result);
      
//       if (!result.success) {
//         throw new Error(result.message || 'Failed to fetch herbs');
//       }
      
//       const herbs = (result.data || []).map(herb => {
//         const conditionIds = extractConditionIds(herb);
//         const conditionNames = extractConditionNames(herb);
        
//         return {
//           id: herb.id,
//           name: herb.name,
//           scientificName: herb.scientific_name,
//           description: herb.description,
//           preparation: herb.preparation,
//           safetyWarning: herb.safety_warning,
//           source: herb.source || "",
//           status: normalizeStatus(herb.status),
//           isPublished: false,
//           imageUrl: herb.image_url || null,
//           createdAt: herb.created_at,
//           updatedAt: herb.updated_at,
//           createdBy: herb.created_by,
//           averageRating: herb.average_rating,
//           ratingCount: herb.rating_count,
//           favoriteCount: herb.favorite_count,
//           conditionIds: conditionIds,
//           conditionNames: conditionNames
//         };
//       });
      
//       return {
//         herbs,
//         pagination: result.pagination
//       };
//     } catch (error) {
//       console.error('❌ Get unpublished herbs error:', error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || 'Failed to fetch herbs');
//     }
//   },

//   getAllHerbs: async () => {
//     try {
//       console.log('📤 Fetching ALL herbs');
      
//       const [publishedRes, unpublishedRes] = await Promise.allSettled([
//         api.get("/herbs/published?limit=100"),
//         api.get("/herbs/unpublished?limit=100")
//       ]);
      
//       let allHerbs = [];
      
//       if (publishedRes.status === 'fulfilled' && publishedRes.value.data?.success) {
//         const publishedData = publishedRes.value.data.data || [];
//         const publishedHerbs = publishedData.map(herb => ({
//           id: herb.id,
//           name: herb.name,
//           scientificName: herb.scientific_name,
//           description: herb.description,
//           preparation: herb.preparation,
//           safetyWarning: herb.safety_warning,
//           source: herb.source || "",
//           status: normalizeStatus(herb.status),
//           isPublished: normalizeStatus(herb.status) === 'published',
//           imageUrl: herb.image_url || null,
//           createdAt: herb.created_at,
//           updatedAt: herb.updated_at,
//           createdBy: herb.created_by,
//           averageRating: herb.average_rating,
//           ratingCount: herb.rating_count,
//           favoriteCount: herb.favorite_count,
//           conditionIds: extractConditionIds(herb),
//           conditionNames: extractConditionNames(herb)
//         }));
//         allHerbs = [...allHerbs, ...publishedHerbs];
//       }
      
//       if (unpublishedRes.status === 'fulfilled' && unpublishedRes.value.data?.success) {
//         const unpublishedData = unpublishedRes.value.data.data || [];
//         const unpublishedHerbs = unpublishedData.map(herb => ({
//           id: herb.id,
//           name: herb.name,
//           scientificName: herb.scientific_name,
//           description: herb.description,
//           preparation: herb.preparation,
//           safetyWarning: herb.safety_warning,
//           source: herb.source || "",
//           status: normalizeStatus(herb.status),
//           isPublished: false,
//           imageUrl: herb.image_url || null,
//           createdAt: herb.created_at,
//           updatedAt: herb.updated_at,
//           createdBy: herb.created_by,
//           averageRating: herb.average_rating,
//           ratingCount: herb.rating_count,
//           favoriteCount: herb.favorite_count,
//           conditionIds: extractConditionIds(herb),
//           conditionNames: extractConditionNames(herb)
//         }));
//         allHerbs = [...allHerbs, ...unpublishedHerbs];
//       }
      
//       const uniqueHerbs = [];
//       const seenIds = new Set();
//       for (const herb of allHerbs) {
//         if (!seenIds.has(herb.id)) {
//           seenIds.add(herb.id);
//           uniqueHerbs.push(herb);
//         }
//       }
      
//       uniqueHerbs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
//       console.log(`✅ Total herbs fetched: ${uniqueHerbs.length}`);
//       console.log('Status breakdown:', {
//         published: uniqueHerbs.filter(h => h.status === 'published').length,
//         pending: uniqueHerbs.filter(h => h.status === 'pending').length,
//         draft: uniqueHerbs.filter(h => h.status === 'draft').length,
//         withImages: uniqueHerbs.filter(h => h.imageUrl).length
//       });
      
//       return uniqueHerbs;
//     } catch (error) {
//       console.error('❌ Get all herbs error:', error);
//       throw new Error('Failed to fetch herbs');
//     }
//   },

//   getHerbById: async (id) => {
//     try {
//       if (!id) throw new Error('Herb ID is required');

//       console.log(`📤 Fetching herb with ID: ${id}`);
//       const response = await api.get(`/herbs/${id}`);
      
//       const result = response.data;
      
//       if (!result.success) {
//         throw new Error(result.message || 'Herb not found');
//       }
      
//       const herb = result.data || result;
      
//       console.log(`📋 Herb "${herb.name}" conditions:`, herb.conditions);
      
//       return {
//         id: herb.id,
//         name: herb.name,
//         scientificName: herb.scientific_name,
//         description: herb.description,
//         preparation: herb.preparation,
//         safetyWarning: herb.safety_warning,
//         source: herb.source || "",
//         status: normalizeStatus(herb.status),
//         isPublished: normalizeStatus(herb.status) === 'published',
//         imageUrl: herb.image_url || null,
//         createdAt: herb.created_at,
//         updatedAt: herb.updated_at,
//         createdBy: herb.created_by,
//         averageRating: herb.average_rating,
//         ratingCount: herb.rating_count,
//         favoriteCount: herb.favorite_count,
//         conditionIds: extractConditionIds(herb),
//         conditionNames: extractConditionNames(herb)
//       };
//     } catch (error) {
//       console.error('❌ Get herb error:', error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || 'Failed to fetch herb');
//     }
//   },

//   updateHerb: async (id, data) => {
//     try {
//       if (!id) throw new Error('Herb ID is required');
//       if (!data.name?.trim()) throw new Error('Herb name is required');
//       if (!data.scientificName?.trim()) throw new Error('Scientific name is required');
//       if (!data.description?.trim()) throw new Error('Description is required');
//       if (!data.safetyWarning?.trim()) throw new Error('Safety warning is required');

//       let conditionIdsArray = [];
//       if (data.conditionIds && Array.isArray(data.conditionIds)) {
//         conditionIdsArray = data.conditionIds.map(id => Number(id));
//       } else if (data.conditionId) {
//         conditionIdsArray = [Number(data.conditionId)];
//       }

//       const apiData = {
//         name: data.name.trim(),
//         scientificName: data.scientificName.trim(),
//         description: data.description.trim(),
//         preparation: data.preparation?.trim() || "No preparation information available",
//         safetyWarning: data.safetyWarning.trim(),
//         source: data.source?.trim() || "",
//         status: data.status ? data.status.toLowerCase() : 'pending',
//         conditionIds: conditionIdsArray
//       };
      
//       console.log(`📤 Updating herb ${id}:`, apiData);
//       const response = await api.put(`/herbs/update/${id}`, apiData);
//       console.log('✅ Herb updated:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Update herb error:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         throw new Error('Unauthorized - Please log in again');
//       }
//       throw new Error(error.response?.data?.message || 'Failed to update herb');
//     }
//   },

//   deleteHerb: async (id) => {
//     try {
//       if (!id) throw new Error('Herb ID is required');

//       console.log(`📤 Deleting herb: ${id}`);
//       const response = await api.delete(`/herbs/delete/${id}`);
//       console.log('✅ Herb deleted:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Delete herb error:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         throw new Error('Unauthorized - Please log in again');
//       }
//       throw new Error(error.response?.data?.message || 'Failed to delete herb');
//     }
//   }
// };

// export const getApiBaseUrl = () => API_BASE_URL;