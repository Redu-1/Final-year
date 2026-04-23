// src/components/herbs/HerbsList.jsx (or wherever you're displaying herbs)
import React, { useState, useEffect } from 'react';
import { herbApi } from '../../services/herbApi';
import StatusBadge from '../common/StatusBadge';

const HerbsList = () => {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHerbs();
  }, []);

  const fetchHerbs = async () => {
    try {
      setLoading(true);
      const data = await herbApi.getAllHerbs();
      console.log('📦 Herbs data received:', data); // Debug log
      
      // Handle different response structures
      const herbsArray = data?.data || data || [];
      setHerbs(Array.isArray(herbsArray) ? herbsArray : []);
      
    } catch (err) {
      setError('Failed to fetch herbs');
      console.error('Error fetching herbs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {herbs.map((herb) => (
        <div key={herb.id || herb._id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">{herb.name || 'Unnamed Herb'}</h3>
          <p className="text-sm text-gray-600 italic">
            {herb.scientificName || 'No scientific name'}
          </p>
          <p className="mt-2 text-sm line-clamp-2">
            {herb.description || 'No description'}
          </p>
          <div className="mt-3 flex justify-between items-center">
            {/* Safe usage of StatusBadge */}
            <StatusBadge status={herb.status} />
            <span className="text-xs text-gray-500">
              Added: {herb.createdAt ? new Date(herb.createdAt).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
        </div>
      ))}
      
      {herbs.length === 0 && (
        <p className="text-gray-500 col-span-full text-center py-8">
          No herbs found. Add your first herb!
        </p>
      )}
    </div>
  );
};

export default HerbsList;