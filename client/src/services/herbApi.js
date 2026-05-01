// client/src/services/herbApi.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.48.136.233:5001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  let url = `${API_BASE_URL}${endpoint}`;
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  url += url.includes('?') ? `&_t=${timestamp}` : `?_t=${timestamp}`;

  try {
    console.log(`🌿 Client API ${options.method || 'GET'} request to:`, url);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Client API Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Client API Error:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to the server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Transform function with robust status normalization and condition data
const transformHerb = (herb) => {
  // Determine status properly - check both status and is_published
  let status = 'pending';
  
  // Check multiple possible status indicators
  const statusStr = String(herb.status || '').toLowerCase().trim();
  const isPublished = herb.is_published === true || herb.is_published === 'true';
  
  if (statusStr === 'published' || statusStr === 'PUBLISHED' || isPublished === true) {
    status = 'published';
  } else if (statusStr === 'pending' || statusStr === 'PENDING') {
    status = 'pending';
  }
  
  // Extract condition IDs from the 'conditions' array
  let conditionIds = [];
  let conditionNames = [];
  
  if (herb.conditions && Array.isArray(herb.conditions)) {
    // Extract IDs and names from the conditions array
    conditionIds = herb.conditions.map(c => c.id);
    conditionNames = herb.conditions.map(c => c.name);
    console.log(`📋 Herb "${herb.name}" has ${conditionIds.length} conditions:`, conditionNames);
  } else if (herb.conditionIds && Array.isArray(herb.conditionIds)) {
    // Fallback: if conditionIds array exists
    conditionIds = herb.conditionIds;
  } else if (herb.condition_id) {
    // Fallback: single condition_id
    conditionIds = [herb.condition_id];
  }
  
  // Debug: Log what we're receiving from API
  console.log(`🔍 Raw herb data for "${herb.name}":`, {
    scientific_name: herb.scientific_name,
    scientificName: herb.scientificName,
    safety_warning: herb.safety_warning,
    safetyWarning: herb.safetyWarning,
    description: herb.description
  });
  
  // Try multiple possible field names for scientific name and safety warning
  const scientificName = herb.scientific_name || herb.scientificName || 'Scientific name not available';
  const safetyWarning = herb.safety_warning || herb.safetyWarning || 'No safety information available';
  const description = herb.description || 'No description available';
  const preparation = herb.preparation || 'No preparation information available';
  
  console.log(`🔄 Transforming: ${herb.name} -> scientificName="${scientificName}", safetyWarning="${safetyWarning.substring(0, 50)}..."`);
  
  return {
    id: herb.id,
    name: herb.name,
    local_name: herb.local_name || herb.name,
    scientific_name: scientificName,
    description: description,
    preparation: preparation,
    safety_warning: safetyWarning,
    source: herb.source || '',
    status: status,
    is_published: status === 'published',
    image_url: herb.image_url || herb.imageUrl,
    created_at: herb.created_at,
    updated_at: herb.updated_at,
    views: herb.views || Math.floor(Math.random() * 5000),
    // Condition information - extracted from conditions array
    condition_ids: conditionIds,
    conditionIds: conditionIds,
    conditionNames: conditionNames,
    // CamelCase versions for frontend compatibility
    scientificName: scientificName,
    safetyWarning: safetyWarning,
    description: description,
    preparation: preparation,
    source: herb.source || '',
    imageUrl: herb.image_url || herb.imageUrl,
    createdAt: herb.created_at,
    updatedAt: herb.updated_at
  };
};

// Client-only herb API functions (read-only)
export const herbApi = {
  // Get published herbs with robust status filtering
  getPublishedHerbs: async (page = 1, limit = 100) => {
    try {
      console.log(`🌿 Client fetching published herbs - page ${page}, limit ${limit}`);
      
      const response = await apiCall(`/herbs/published?page=${page}&limit=${limit}`);
      console.log('📦 RAW API RESPONSE:', JSON.stringify(response, null, 2));
      
      if (response && response.success && Array.isArray(response.data)) {
        // Log each herb's raw data before transformation
        console.log('📊 Raw herb data from API:');
        response.data.forEach(herb => {
          console.log(`  - ${herb.name}: scientific_name="${herb.scientific_name}", safety_warning="${herb.safety_warning?.substring(0, 30)}..."`);
        });
        
        // Transform all herbs
        const allHerbs = response.data.map(transformHerb);
        
        // Log after transformation
        console.log('📊 After transform:');
        allHerbs.forEach(herb => {
          console.log(`  - ${herb.name}: scientificName="${herb.scientificName}", safetyWarning="${herb.safetyWarning?.substring(0, 30)}..."`);
        });
        
        // Filter to ONLY published
        const publishedHerbs = allHerbs.filter(herb => {
          const isPublished = herb.status === 'published' || herb.is_published === true;
          return isPublished;
        });
        
        console.log(`✅ Returning ${publishedHerbs.length} published herbs out of ${allHerbs.length} total`);
        
        // Verify the first herb has scientific name
        if (publishedHerbs.length > 0) {
          console.log(`📖 First herb "${publishedHerbs[0].name}" has scientificName: "${publishedHerbs[0].scientificName}"`);
          console.log(`📖 First herb "${publishedHerbs[0].name}" has safetyWarning: "${publishedHerbs[0].safetyWarning?.substring(0, 50)}..."`);
        }
        
        return publishedHerbs;
      }
      
      console.warn('Unexpected response format:', response);
      return [];
    } catch (error) {
      console.error('❌ Error in getPublishedHerbs:', error);
      return [];
    }
  },

  // Get a single herb by ID - IMPROVED VERSION (supports multiple conditions)
  getHerbById: async (id) => {
    try {
      console.log(`🌿 Client fetching herb with ID: ${id}`);
      
      if (!id) {
        console.log('❌ No ID provided');
        return null;
      }
      
      // Try direct endpoint first
      try {
        console.log(`Trying endpoint: /herbs/${id}`);
        const response = await apiCall(`/herbs/${id}`);
        
        if (response && response.success && response.data) {
          const herb = transformHerb(response.data);
          console.log(`📖 Herb source info: ${herb.source ? herb.source.substring(0, 100) + '...' : 'No source'}`);
          console.log(`📖 Herb condition IDs: ${JSON.stringify(herb.conditionIds)}`);
          console.log(`📖 Herb condition names: ${JSON.stringify(herb.conditionNames)}`);
          console.log(`📖 Herb scientificName: ${herb.scientificName}`);
          console.log(`📖 Herb safetyWarning: ${herb.safetyWarning}`);
          if (herb.status === 'published') {
            console.log(`✅ Success with /herbs/${id}`);
            return herb;
          } else {
            console.log(`⚠️ Herb found but status is ${herb.status}, not published`);
            return null;
          }
        } else if (response && response.id) {
          const herb = transformHerb(response);
          console.log(`📖 Herb condition IDs: ${JSON.stringify(herb.conditionIds)}`);
          if (herb.status === 'published') {
            console.log(`✅ Got herb directly`);
            return herb;
          }
          return null;
        } else if (response && response.data && response.data.id) {
          const herb = transformHerb(response.data);
          console.log(`📖 Herb condition IDs: ${JSON.stringify(herb.conditionIds)}`);
          if (herb.status === 'published') {
            console.log(`✅ Got herb from data property`);
            return herb;
          }
          return null;
        }
      } catch (err) {
        console.log(`❌ Direct endpoint /herbs/${id} failed:`, err.message);
      }
      
      // If direct fails, try to find in published list
      console.log('Searching in published herbs list...');
      const allHerbs = await herbApi.getPublishedHerbs(1, 1000);
      const foundHerb = allHerbs.find(h => h.id === id);
      
      if (foundHerb) {
        console.log(`✅ Found herb in published list:`, foundHerb);
        return foundHerb;
      }
      
      console.log(`❌ Herb with ID ${id} not found or not published`);
      return null;
      
    } catch (error) {
      console.error(`❌ Error fetching herb ${id}:`, error);
      return null;
    }
  },

  // Get a single herb by ID - DIRECT VERSION (supports multiple conditions)
  getHerbByIdDirect: async (id) => {
    try {
      console.log(`🌿 Client fetching herb with ID: ${id} (direct)`);
      
      if (!id) return null;
      
      const response = await apiCall(`/herbs/${id}`);
      
      if (response && response.success && response.data) {
        const herb = transformHerb(response.data);
        return herb.status === 'published' ? herb : null;
      } else if (response && response.id) {
        const herb = transformHerb(response);
        return herb.status === 'published' ? herb : null;
      } else if (response && response.data && response.data.id) {
        const herb = transformHerb(response.data);
        return herb.status === 'published' ? herb : null;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error fetching herb ${id}:`, error);
      return null;
    }
  },

  // ================= TRANSLATION API FUNCTIONS =================
  
  // Get herb translation by herb ID and language
  getHerbTranslation: async (herbId, languageCode) => {
    try {
      if (!herbId) throw new Error('Herb ID is required');
      if (!languageCode) throw new Error('Language code is required');
      
      console.log(`🌿 Fetching ${languageCode} translation for herb ${herbId}`);
      const response = await apiCall(`/translations/${herbId}/${languageCode}`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.log(`No ${languageCode} translation found for herb ${herbId}`);
      return null;
    }
  },
  
  // Get condition translation by condition ID and language
  getConditionTranslation: async (conditionId, languageCode) => {
    try {
      if (!conditionId) throw new Error('Condition ID is required');
      if (!languageCode) throw new Error('Language code is required');
      
      console.log(`🌿 Fetching ${languageCode} translation for condition ${conditionId}`);
      const response = await apiCall(`/condition-translations/${conditionId}/${languageCode}`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.log(`No ${languageCode} translation found for condition ${conditionId}`);
      return null;
    }
  },
  
  // Get herb with translations for a specific language
  getHerbWithTranslation: async (id, languageCode) => {
    try {
      console.log(`🌿 Fetching herb ${id} with ${languageCode} translations`);
      
      // Fetch base herb data
      const herb = await herbApi.getHerbById(id);
      if (!herb) return null;
      
      // If language is English, return base herb
      if (languageCode === 'EN') return herb;
      
      // Fetch herb translation
      const herbTranslation = await herbApi.getHerbTranslation(id, languageCode);
      
      // Fetch condition translations for all conditions
      const conditionTranslations = {};
      if (herb.conditionIds && herb.conditionIds.length > 0) {
        for (const conditionId of herb.conditionIds) {
          const translation = await herbApi.getConditionTranslation(conditionId, languageCode);
          if (translation) {
            conditionTranslations[conditionId] = translation;
          }
        }
      }
      
      // Apply translations
      const translatedHerb = {
        ...herb,
        name: herbTranslation?.translated_name || herb.name,
        description: herbTranslation?.translated_uses || herb.description,
        preparation: herbTranslation?.translated_preparation || herb.preparation,
        safetyWarning: herbTranslation?.translated_safety || herb.safetyWarning,
        source: herbTranslation?.source || herb.source,
        conditionNames: herb.conditionNames.map((name, index) => {
          const conditionId = herb.conditionIds?.[index];
          const translation = conditionTranslations[conditionId];
          return translation?.translated_name || name;
        })
      };
      
      return translatedHerb;
    } catch (error) {
      console.error('❌ Error fetching herb with translation:', error);
      return null;
    }
  },

  // Get all conditions for filtering
  getConditions: async () => {
    try {
      console.log('🌿 Client fetching conditions...');
      const response = await apiCall('/conditions');
      console.log('📦 Conditions response:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error fetching conditions:', error);
      return [];
    }
  },

  // Get herbs by condition ID (supports multiple conditions - returns herbs that have this condition in their array)
  getHerbsByCondition: async (conditionId) => {
    try {
      console.log(`🌿 Client fetching herbs for condition ID: ${conditionId}`);
      const allHerbs = await herbApi.getPublishedHerbs(1, 1000);
      // Check if condition ID exists in the herb's conditionIds array
      const filteredHerbs = allHerbs.filter(herb => 
        herb.conditionIds && herb.conditionIds.includes(conditionId)
      );
      console.log(`✅ Found ${filteredHerbs.length} herbs for condition ${conditionId}`);
      return filteredHerbs;
    } catch (error) {
      console.error('❌ Error fetching herbs by condition:', error);
      return [];
    }
  },

  // Get herbs by multiple condition IDs (returns herbs that have at least one of the conditions)
  getHerbsByConditions: async (conditionIds) => {
    try {
      console.log(`🌿 Client fetching herbs for condition IDs: ${JSON.stringify(conditionIds)}`);
      const allHerbs = await herbApi.getPublishedHerbs(1, 1000);
      const filteredHerbs = allHerbs.filter(herb => 
        herb.conditionIds && herb.conditionIds.some(id => conditionIds.includes(id))
      );
      console.log(`✅ Found ${filteredHerbs.length} herbs for conditions ${JSON.stringify(conditionIds)}`);
      return filteredHerbs;
    } catch (error) {
      console.error('❌ Error fetching herbs by conditions:', error);
      return [];
    }
  },

  // Get herbs with source information
  getHerbsWithSource: async () => {
    try {
      console.log('🌿 Client fetching herbs with source information...');
      const allHerbs = await herbApi.getPublishedHerbs(1, 1000);
      const herbsWithSource = allHerbs.filter(herb => herb.source && herb.source.trim() !== '');
      const herbsWithoutSource = allHerbs.filter(herb => !herb.source || herb.source.trim() === '');
      
      console.log(`✅ Herbs with source: ${herbsWithSource.length}`);
      console.log(`📚 Herbs without source: ${herbsWithoutSource.length}`);
      
      return {
        withSource: herbsWithSource,
        withoutSource: herbsWithoutSource,
        total: allHerbs.length
      };
    } catch (error) {
      console.error('❌ Error fetching herbs with source:', error);
      return { withSource: [], withoutSource: [], total: 0 };
    }
  },

  // Get herbs statistics including condition distribution
  getHerbsStatistics: async () => {
    try {
      console.log('🌿 Client fetching herbs statistics...');
      const allHerbs = await herbApi.getPublishedHerbs(1, 1000);
      const conditions = await herbApi.getConditions();
      
      // Count herbs per condition
      const conditionCounts = {};
      conditions.forEach(condition => {
        conditionCounts[condition.id] = {
          name: condition.name,
          count: 0
        };
      });
      
      allHerbs.forEach(herb => {
        if (herb.conditionIds && herb.conditionIds.length > 0) {
          herb.conditionIds.forEach(conditionId => {
            if (conditionCounts[conditionId]) {
              conditionCounts[conditionId].count++;
            }
          });
        }
      });
      
      const herbsWithMultipleConditions = allHerbs.filter(herb => 
        herb.conditionIds && herb.conditionIds.length > 1
      ).length;
      
      console.log('✅ Herbs statistics calculated');
      
      return {
        totalHerbs: allHerbs.length,
        herbsWithMultipleConditions,
        conditionDistribution: conditionCounts,
        averageConditionsPerHerb: allHerbs.reduce((sum, herb) => 
          sum + (herb.conditionIds ? herb.conditionIds.length : 0), 0
        ) / allHerbs.length || 0
      };
    } catch (error) {
      console.error('❌ Error fetching herbs statistics:', error);
      return null;
    }
  },

  // Test API connection
  testConnection: async () => {
    try {
      console.log('Testing API connection to:', `${API_BASE_URL}/herbs/published?limit=1`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/herbs/published?limit=1`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`✅ Connection test received status: ${response.status}`);
      return response.ok;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ Connection test timed out after 5 seconds');
      } else {
        console.error('❌ Connection test failed:', error);
      }
      return false;
    }
  }
};

// Export API base URL for debugging
export const getApiBaseUrl = () => API_BASE_URL;
