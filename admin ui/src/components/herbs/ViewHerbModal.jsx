// src/components/herbs/ViewHerbModal.jsx
import { useState, useEffect } from 'react';
import { X, Leaf, MapPin, Tag, Clock, Shield, AlertCircle, FlaskConical, AlertTriangle, Calendar, User, Image as ImageIcon, Activity, Bug, Flame, Zap, Pill, Flower2, BookOpen, Layers, Star } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import ReactDOM from 'react-dom';
import { getApiBaseUrl } from '../../services/herbApi';

const ViewHerbModal = ({ isOpen, onClose, herb }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [herbConditions, setHerbConditions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  const API_BASE_URL = getApiBaseUrl();

  // Fetch conditions list
  const fetchConditions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/conditions`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : {}
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setConditions(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch conditions:', error);
    }
  };

  // Fetch ratings for this herb
// In ViewHerbModal.jsx, update the fetchRatings function:

// Fetch ratings for this herb
const fetchRatings = async () => {
  if (!herb?.id) return;
  
  setIsLoadingRatings(true);
  try {
    // ✅ FIX: Use the correct endpoint
const response = await fetch(`${API_BASE_URL}/ratings/${herbData.id}`, {      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const ratingsData = data.data || [];
        setRatings(ratingsData);
        
        // Calculate average
        const total = ratingsData.reduce((sum, r) => sum + parseFloat(r.rating_value), 0);
        const avg = ratingsData.length > 0 ? total / ratingsData.length : 0;
        setAverageRating(avg);
        setTotalRatings(ratingsData.length);
      }
    }
  } catch (error) {
    console.error('Failed to fetch ratings:', error);
  } finally {
    setIsLoadingRatings(false);
  }
};

  // Get conditions by IDs (supports array)
  const getConditionsByIds = (conditionIds) => {
    if (!conditionIds || conditionIds.length === 0) return [];
    const ids = Array.isArray(conditionIds) ? conditionIds : [conditionIds];
    return conditions.filter(c => ids.includes(c.id));
  };

  // Fetch image from uploads API
  useEffect(() => {
    const fetchImage = async () => {
      if (!isOpen || !herb?.id) return;
      
      if (herb.imageUrl) {
        setImageUrl(herb.imageUrl);
        return;
      }
      
      setIsLoadingImage(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/uploads/${herb.id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : {}
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setImageUrl(data.data[0].image_url);
          }
        }
      } catch (error) {
        console.error('Failed to load image:', error);
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    fetchImage();
    fetchConditions();
    fetchRatings();
  }, [isOpen, herb?.id, herb?.imageUrl]);

  // Update conditions when conditions list or herb changes
  useEffect(() => {
    if (conditions.length > 0 && herb) {
      // Get condition IDs from herb (supports both array and single)
      let conditionIds = [];
      
      if (herb.conditionIds && Array.isArray(herb.conditionIds)) {
        conditionIds = herb.conditionIds;
      } else if (herb.conditionId) {
        conditionIds = [herb.conditionId];
      } else if (herb.condition_id) {
        conditionIds = [herb.condition_id];
      }
      
      console.log('📋 Herb condition IDs:', conditionIds);
      
      const foundConditions = getConditionsByIds(conditionIds);
      console.log('📋 Found conditions:', foundConditions);
      
      setHerbConditions(foundConditions);
    } else {
      setHerbConditions([]);
    }
  }, [herb, conditions]);

  // Get condition icon based on condition name
  const getConditionIcon = (conditionName) => {
    const name = conditionName?.toLowerCase() || '';
    if (name.includes('acne')) return Bug;
    if (name.includes('inflammation') || name.includes('inflammatory')) return Flame;
    if (name.includes('rash')) return Activity;
    if (name.includes('skin')) return Shield;
    if (name.includes('chebt')) return Zap;
    if (name.includes('hb')) return Pill;
    return Flower2;
  };

  // Render stars for rating display
  const renderStars = (rating, size = "h-4 w-4") => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${size} text-yellow-400 fill-current`} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${size} text-yellow-400`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${size} text-yellow-400 fill-current`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${size} text-gray-300`} />
        ))}
      </div>
    );
  };

  if (!isOpen || !herb) return null;

  // Safely get herb properties with defaults
  const herbData = {
    id: herb?.id || herb?._id || 'N/A',
    name: herb?.name || 'Unnamed Herb',
    scientificName: herb?.scientificName || 'No scientific name',
    description: herb?.description || 'No description available',
    preparation: herb?.preparation || 'No preparation information available',
    safetyWarning: herb?.safetyWarning || 'No safety warnings specified',
    source: herb?.source || '',
    status: herb?.status || 'draft',
    createdAt: herb?.createdAt ? new Date(herb.createdAt).toLocaleDateString() : 'Unknown date',
    updatedAt: herb?.updatedAt ? new Date(herb.updatedAt).toLocaleDateString() : 'Unknown',
    createdBy: herb?.createdBy || 'System',
    conditionIds: herb?.conditionIds || (herb?.conditionId ? [herb.conditionId] : (herb?.condition_id ? [herb.condition_id] : []))
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Herb Details</h3>
                  <p className="text-sm text-emerald-50">Complete information about {herbData.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              
              {/* Herb Image */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                  {isLoadingImage ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-pulse w-12 h-12 rounded-full bg-gray-300" />
                    </div>
                  ) : imageUrl && !imageError ? (
                    <img 
                      src={imageUrl} 
                      alt={herbData.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <p className="text-xs text-gray-400 mt-2">No image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-end">
                <StatusBadge status={herbData.status} size="lg" />
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Leaf className="h-5 w-5 text-emerald-500 mr-2" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Herb Name</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{herbData.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Scientific Name</label>
                    <p className="mt-1 text-lg italic text-gray-700">{herbData.scientificName}</p>
                  </div>
                </div>
              </div>

              {/* Rating Section - NEW */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 fill-current" />
                  User Ratings
                </h4>
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(averageRating, "h-6 w-6")}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
                
                {/* Rating Distribution */}
                {totalRatings > 0 && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-xs text-gray-500 mb-2">Rating Distribution</p>
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = ratings.filter(r => r.rating_value === star).length;
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 w-8">{star} ★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Reviews Preview */}
                {ratings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">Recent Reviews</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {ratings.slice(0, 3).map((rating, index) => (
                        <div key={index} className="bg-white/50 rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                {rating.user?.full_name?.charAt(0) || 'U'}
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {rating.user?.full_name || 'Anonymous'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {renderStars(rating.rating_value, "h-3 w-3")}
                            </div>
                          </div>
                          {rating.comment && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{rating.comment}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    {ratings.length > 3 && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        +{ratings.length - 3} more reviews
                      </p>
                    )}
                  </div>
                )}

                {totalRatings === 0 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">No ratings yet. Be the first to rate!</p>
                  </div>
                )}
              </div>

              {/* Conditions Information - SUPPORTS MULTIPLE CONDITIONS */}
              {herbConditions.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
                  <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-emerald-600" />
                    Related Conditions ({herbConditions.length})
                  </h4>
                  <div className="space-y-3">
                    {herbConditions.map((condition, index) => {
                      const Icon = getConditionIcon(condition.name);
                      return (
                        <div key={condition.id} className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Icon className="h-4 w-4 text-emerald-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-emerald-800">{condition.name}</p>
                                <span className="text-xs text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  ID: {condition.id}
                                </span>
                              </div>
                              {condition.description && (
                                <p className="text-sm text-emerald-600 mt-1">{condition.description}</p>
                              )}
                              {index === 0 && (
                                <p className="text-xs text-emerald-500 mt-2">
                                  This herb is traditionally used to help with {condition.name.toLowerCase()} conditions.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {herbConditions.length > 1 && (
                    <p className="text-xs text-emerald-600 mt-3 pt-2 border-t border-emerald-200">
                      This herb is effective for {herbConditions.length} different conditions.
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="h-5 w-5 text-emerald-500 mr-2" />
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{herbData.description}</p>
              </div>

              {/* Preparation */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FlaskConical className="h-5 w-5 text-emerald-500 mr-2" />
                  Preparation
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{herbData.preparation}</p>
              </div>

              {/* Source Field Section */}
              {herbData.source && herbData.source.trim() !== '' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    Source / Reference
                  </h4>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-blue-900 leading-relaxed whitespace-pre-line">
                      {herbData.source}
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-3 flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Information source for this herb
                  </p>
                </div>
              )}

              {/* Safety Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                  Safety Warning
                </h4>
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-amber-900 leading-relaxed whitespace-pre-line font-medium">
                    {herbData.safetyWarning}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Created: {herbData.createdAt}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Updated: {herbData.updatedAt}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Added by: {herbData.createdBy}</span>
                  </div>
                  <div className="flex items-center col-span-full mt-2 pt-2 border-t border-gray-200">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-xs font-mono">ID: {herbData.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8 hover:bg-gray-100"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ViewHerbModal;