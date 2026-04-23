// src/components/herbs/HerbCard.jsx (Client Side - With Translation Support)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, Clock, AlertCircle, CheckCircle, 
  Eye, BookOpen, Beaker, AlertTriangle,
  Image as ImageIcon, Activity, Bug, Flame, Shield, Zap, Pill, Flower2,
  Layers
} from 'lucide-react';
import { getApiBaseUrl } from '../../services/herbApi';
import { useLanguage } from '../../contexts/LanguageContext';

const HerbCard = ({ herb, viewMode = 'grid', onView }) => {
  const navigate = useNavigate();
  const { language, getApiLanguageCode } = useLanguage();
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);

  const API_BASE_URL = getApiBaseUrl();

  // Debug log to see what herb data is received
  useEffect(() => {
    console.log('🌿 HerbCard received herb:', {
      id: herb?.id,
      name: herb?.name,
      scientificName: herb?.scientificName,
      safetyWarning: herb?.safetyWarning,
      description: herb?.description,
      status: herb?.status,
      conditionIds: herb?.conditionIds,
      conditionNames: herb?.conditionNames
    });
  }, [herb]);

  // Get condition icon based on name
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

  // Fetch translation for the herb
  const fetchHerbTranslation = async () => {
    if (language === 'EN' || !herb?.id) return null;
    
    setIsLoadingTranslation(true);
    try {
      const token = localStorage.getItem('token');
      const apiLangCode = getApiLanguageCode();
      const response = await fetch(`${API_BASE_URL}/translations/${herb.id}/${apiLangCode}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log(`✅ Loaded translation for ${herb.name} in ${apiLangCode}`);
          return data.data;
        }
      }
      return null;
    } catch (error) {
      console.log(`No translation found for ${herb.name} in ${language}`);
      return null;
    } finally {
      setIsLoadingTranslation(false);
    }
  };

  // Fetch translations for conditions
  const fetchConditionTranslations = async (conditionIds) => {
    if (language === 'EN' || !conditionIds || conditionIds.length === 0) return {};
    
    const apiLangCode = getApiLanguageCode();
    const translations = {};
    
    for (const conditionId of conditionIds) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/condition-translations/${conditionId}/${apiLangCode}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : {},
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            translations[conditionId] = data.data;
          }
        }
      } catch (error) {
        console.log(`No translation found for condition ${conditionId}`);
      }
    }
    
    return translations;
  };

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      if (language !== 'EN' && herb?.id) {
        const herbTranslation = await fetchHerbTranslation();
        const conditionTranslations = await fetchConditionTranslations(herb.conditionIds || []);
        
        setTranslatedData({
          herbTranslation,
          conditionTranslations
        });
      } else {
        setTranslatedData(null);
      }
    };
    
    loadTranslations();
  }, [language, herb?.id]);

  // Fetch image from uploads API
  useEffect(() => {
    const fetchImage = async () => {
      if (!herb?.id) return;
      
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
            const url = data.data[0].image_url;
            setImageUrl(url);
            console.log(`📸 Loaded image for ${herb.name}:`, url);
          }
        }
      } catch (error) {
        console.error(`Failed to load image for ${herb.name}:`, error);
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    fetchImage();
  }, [herb.id, herb.name, herb.imageUrl, API_BASE_URL]);

  const handleCardClick = () => {
    if (onView) {
      onView(herb);
    } else {
      navigate(`/herbs/${herb.id}`);
    }
  };

  const getStatusBadge = () => {
    if (herb.status === 'published') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  // Get translated content or fallback to original
  const getTranslatedName = () => {
    if (language !== 'EN' && translatedData?.herbTranslation?.translated_name) {
      return translatedData.herbTranslation.translated_name;
    }
    return herb?.name || 'Unnamed Herb';
  };

  const getScientificName = () => {
    // Try multiple possible field names
    return herb?.scientificName || herb?.scientific_name || 'Scientific name not available';
  };

  const getTranslatedDescription = () => {
    if (language !== 'EN' && translatedData?.herbTranslation?.translated_uses) {
      return translatedData.herbTranslation.translated_uses;
    }
    return herb?.description || 'No description available';
  };

  const getSafetyWarning = () => {
    // Try multiple possible field names
    return herb?.safetyWarning || herb?.safety_warning || 'No safety information available';
  };

  const getTranslatedSafetyWarning = () => {
    if (language !== 'EN' && translatedData?.herbTranslation?.translated_safety) {
      return translatedData.herbTranslation.translated_safety;
    }
    return getSafetyWarning();
  };

  // Get translated condition names
  const getTranslatedConditionNames = () => {
    const originalNames = herb?.conditionNames || [];
    if (language === 'EN' || !translatedData?.conditionTranslations) {
      return originalNames;
    }
    
    const conditionIds = herb?.conditionIds || [];
    return originalNames.map((name, index) => {
      const conditionId = conditionIds[index];
      const translation = translatedData.conditionTranslations[conditionId];
      return translation?.translated_name || name;
    });
  };

  // Get conditions array (supports multiple conditions)
  const conditionNames = getTranslatedConditionNames();
  const conditionCount = conditionNames.length;
  const hasMultipleConditions = conditionCount > 1;
  const scientificName = getScientificName();
  const safetyWarning = getSafetyWarning();

  // List view
  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            {isLoadingImage ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300" />
              </div>
            ) : imageUrl && !imageError ? (
              <img 
                src={imageUrl} 
                alt={herb?.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{getTranslatedName()}</h3>
                {/* ✅ Display Scientific Name */}
                <p className="text-sm text-gray-500 italic mt-0.5">{scientificName}</p>
                {language !== 'EN' && translatedData?.herbTranslation && (
                  <span className="text-xs text-purple-500 mt-1 inline-block">
                    Translated from {language === 'AM' ? 'Amharic' : 'Oromo'}
                  </span>
                )}
              </div>
              {getStatusBadge()}
            </div>
            
            {/* Condition Badges - Multiple Support */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {conditionNames.slice(0, 2).map((conditionName, index) => {
                const Icon = getConditionIcon(conditionName);
                return (
                  <div key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <Icon className="w-3 h-3 mr-1" />
                    {conditionName}
                  </div>
                );
              })}
              {hasMultipleConditions && conditionNames.length > 2 && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <Layers className="w-3 h-3 mr-1" />
                  +{conditionNames.length - 2} more
                </div>
              )}
              {conditionCount === 0 && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  <Activity className="w-3 h-3 mr-1" />
                  General Wellness
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{getTranslatedDescription()}</p>
            
            {/* ✅ Display Safety Warning */}
            {safetyWarning && safetyWarning !== 'No safety information available' && (
              <div className="mt-2 flex items-start gap-1 text-xs text-amber-600">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{getTranslatedSafetyWarning().substring(0, 80)}...</span>
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Updated: {herb?.updatedAt ? new Date(herb.updatedAt).toLocaleDateString() : 'Recently'}
              </span>
              {conditionCount > 0 && (
                <span className="flex items-center">
                  <Layers className="w-3 h-3 mr-1" />
                  {conditionCount} condition{conditionCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {isLoadingImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse w-12 h-12 rounded-full bg-gray-300" />
          </div>
        ) : imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={herb?.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <p className="text-xs text-gray-400 mt-2">No image</p>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>

        {/* Translation Indicator Overlay */}
        {language !== 'EN' && translatedData?.herbTranslation && (
          <div className="absolute bottom-3 left-3">
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-600/80 text-white backdrop-blur-sm">
              <BookOpen className="w-3 h-3 mr-1" />
              {language === 'AM' ? 'አማርኛ' : 'Oromiffa'}
            </div>
          </div>
        )}

        {/* Multiple Conditions Indicator Overlay */}
        {hasMultipleConditions && (
          <div className="absolute bottom-3 right-3">
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
              <Layers className="w-3 h-3 mr-1" />
              {conditionCount} conditions
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{getTranslatedName()}</h3>
        
        {/* ✅ Display Scientific Name */}
        <p className="text-sm text-gray-500 italic line-clamp-1 mt-0.5">{scientificName}</p>
        
        {/* Language Indicator */}
        {language !== 'EN' && translatedData?.herbTranslation && (
          <p className="text-xs text-purple-500 mt-1">
            Translated
          </p>
        )}
        
        {/* Condition Badges - Multiple Support */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {conditionNames.slice(0, 2).map((conditionName, index) => {
            const Icon = getConditionIcon(conditionName);
            return (
              <div key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                <Icon className="w-3 h-3 mr-1" />
                {conditionName}
              </div>
            );
          })}
          {hasMultipleConditions && conditionNames.length > 2 && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <Layers className="w-3 h-3 mr-1" />
              +{conditionNames.length - 2}
            </div>
          )}
          {conditionCount === 0 && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              <Activity className="w-3 h-3 mr-1" />
              General Wellness
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-1">{getTranslatedDescription()}</p>
        
        {/* ✅ Safety Warning Preview */}
        {safetyWarning && safetyWarning !== 'No safety information available' && (
          <div className="mt-3 flex items-start gap-1 text-xs text-amber-600">
            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{getTranslatedSafetyWarning().substring(0, 60)}</span>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {herb?.updatedAt ? new Date(herb.updatedAt).toLocaleDateString() : 'Recently'}
          </span>
          <div className="flex items-center gap-2">
            {conditionCount > 0 && (
              <span className="flex items-center text-gray-400">
                <Layers className="w-3 h-3 mr-1" />
                {conditionCount}
              </span>
            )}
            <span className="flex items-center text-emerald-600 group-hover:translate-x-1 transition-transform">
              View Details
              <Eye className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HerbCard;