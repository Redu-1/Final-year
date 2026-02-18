// src/hooks/useHerbs.js
import { useState, useEffect } from 'react';
import herbsService from '../services/herbsService';

const useHerbs = (initialParams = {}) => {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchHerbs = async () => {
    try {
      setLoading(true);
      const response = await herbsService.getAllHerbs(params);
      setHerbs(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch herbs');
    } finally {
      setLoading(false);
    }
  };

  const createHerb = async (herbData) => {
    try {
      const response = await herbsService.createHerb(herbData);
      setHerbs(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateHerb = async (id, herbData) => {
    try {
      const response = await herbsService.updateHerb(id, herbData);
      setHerbs(prev => prev.map(herb => 
        herb.id === id ? response.data : herb
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteHerb = async (id) => {
    try {
      await herbsService.deleteHerb(id);
      setHerbs(prev => prev.filter(herb => herb.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchHerbs();
  }, [params]);

  return {
    herbs,
    loading,
    error,
    params,
    setParams,
    fetchHerbs,
    createHerb,
    updateHerb,
    deleteHerb
  };
};

export default useHerbs;