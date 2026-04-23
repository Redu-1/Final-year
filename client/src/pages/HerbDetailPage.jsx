// src/pages/HerbDetailPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HerbDetail from '../components/herbs/HerbDetail'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { AlertCircle, ArrowLeft, Activity, Thermometer, Bug, Shield, Zap, Pill, Flower2, BookOpen } from 'lucide-react'
import { herbApi, getApiBaseUrl } from '../services/herbApi'
import Button from '../components/common/Button'
import { useLanguage } from '../contexts/LanguageContext'

const HerbDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [herb, setHerb] = useState(null)
  const [error, setError] = useState(null)
  const [conditions, setConditions] = useState([])

  // Fetch conditions for mapping
  const fetchConditions = async () => {
    try {
      const conditionsList = await herbApi.getConditions()
      setConditions(conditionsList)
      return conditionsList
    } catch (error) {
      console.error('Error fetching conditions:', error)
      return []
    }
  }

  // Get condition names from IDs array
  const getConditionNamesFromIds = (conditionIds, conditionsList) => {
    if (!conditionIds || !conditionIds.length || !conditionsList.length) return []
    return conditionIds
      .map(id => conditionsList.find(c => c.id === id)?.name)
      .filter(name => name !== undefined)
  }

  // Fetch translation for herb
  const fetchHerbTranslation = async (herbId, langCode) => {
    if (langCode === 'EN') return null;
    
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      const response = await fetch(`${getApiBaseUrl()}/translations/${herbId}/${langCode}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log(`✅ Loaded ${langCode} translation for herb ${herbId}`);
          return data.data;
        }
      }
      return null;
    } catch (error) {
      console.log(`No ${langCode} translation found for herb ${herbId}`);
      return null;
    }
  };

  // Fetch translations for conditions
  const fetchConditionTranslation = async (conditionId, langCode) => {
    if (langCode === 'EN') return null;
    
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      const response = await fetch(`${getApiBaseUrl()}/condition-translations/${conditionId}/${langCode}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
      return null;
    } catch (error) {
      console.log(`No condition translation found for condition ${conditionId} in ${langCode}`);
      return null;
    }
  };

  // Fetch all translations for conditions
  const fetchAllConditionTranslations = async (conditionIds, langCode) => {
    if (langCode === 'EN') return {};
    
    const translations = {};
    for (const conditionId of conditionIds) {
      const translation = await fetchConditionTranslation(conditionId, langCode);
      if (translation) {
        translations[conditionId] = translation;
      }
    }
    return translations;
  };

  // Get condition icon based on name
  const getConditionIcon = (conditionName) => {
    const name = conditionName?.toLowerCase() || '';
    if (name.includes('acne')) return Bug;
    if (name.includes('inflammation') || name.includes('inflammatory')) return Thermometer;
    if (name.includes('rash')) return Activity;
    if (name.includes('skin')) return Shield;
    if (name.includes('chebt')) return Zap;
    if (name.includes('hb')) return Pill;
    return Flower2;
  }

  useEffect(() => {
    const fetchHerbDetails = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        console.log(`🌿 Fetching herb details for ID: ${id} with language: ${language}`)
        
        // Fetch conditions first
        const conditionsList = await fetchConditions()
        
        // Try direct fetch first
        let herbData = await herbApi.getHerbByIdDirect(id)
        
        // If direct fails, fall back to list search
        if (!herbData) {
          console.log('Direct fetch failed, trying list search...')
          herbData = await herbApi.getHerbById(id)
        }
        
        console.log('✅ Herb details received:', herbData)
        
        if (herbData) {
          // Get condition names from IDs if not already provided
          let conditionNames = herbData.conditionNames || [];
          if ((!conditionNames || conditionNames.length === 0) && herbData.conditionIds && herbData.conditionIds.length > 0) {
            conditionNames = getConditionNamesFromIds(herbData.conditionIds, conditionsList)
            console.log('📋 Derived condition names from IDs:', conditionNames)
          }
          
          // Fetch translations based on current language
          let herbTranslation = null;
          let conditionTranslations = {};
          
          if (language !== 'EN') {
            herbTranslation = await fetchHerbTranslation(herbData.id, language);
            conditionTranslations = await fetchAllConditionTranslations(herbData.conditionIds || [], language);
            console.log(`📖 Translations loaded for language: ${language}`, { herbTranslation, conditionTranslations });
          }
          
          // Create translated version of the herb if available
          let finalHerbData = { ...herbData };
          
          if (herbTranslation) {
            finalHerbData = {
              ...finalHerbData,
              name: herbTranslation.translated_name || herbData.name,
              description: herbTranslation.translated_uses || herbData.description,
              preparation: herbTranslation.translated_preparation || herbData.preparation,
              safetyWarning: herbTranslation.translated_safety || herbData.safetyWarning,
              source: herbTranslation.source || herbData.source
            };
            console.log('✅ Applied herb translations');
          }
          
          // Translate condition names if translations exist
          let translatedConditionNames = [...conditionNames];
          if (Object.keys(conditionTranslations).length > 0) {
            translatedConditionNames = conditionNames.map((name, index) => {
              const conditionId = herbData.conditionIds?.[index];
              const translation = conditionTranslations[conditionId];
              return translation?.translated_name || name;
            });
            console.log('✅ Applied condition translations:', translatedConditionNames);
          }
          
          const transformedHerb = {
            id: herbData.id,
            name: finalHerbData.name || 'Unknown Herb',
            scientificName: herbData.scientific_name || herbData.scientificName || '',
            description: finalHerbData.description || 'No description available',
            preparation: finalHerbData.preparation || 'No preparation information available',
            safetyWarning: finalHerbData.safetyWarning || 'No safety information available',
            source: finalHerbData.source || '',
            conditionIds: herbData.conditionIds || [],
            conditionNames: translatedConditionNames,
            views: herbData.views || 0,
            imageUrl: herbData.image_url || herbData.imageUrl || null,
            createdAt: herbData.created_at || herbData.createdAt,
            updatedAt: herbData.updated_at || herbData.updatedAt,
            status: herbData.status
          }
          
          console.log('📋 Final transformed herb:', {
            name: transformedHerb.name,
            conditionNames: transformedHerb.conditionNames,
            hasTranslations: !!herbTranslation
          })
          
          setHerb(transformedHerb)
        } else {
          setError('Herb not found')
        }
      } catch (error) {
        console.error('❌ Error fetching herb details:', error)
        setError(error.message || 'Failed to load herb details')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchHerbDetails()
    }
  }, [id, language])

  const handleGoBack = () => {
    navigate('/herbs')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingDots size="lg" />
      </div>
    )
  }

  if (error || !herb) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={handleGoBack}
            className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Herbs
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Herb</h2>
            <p className="text-red-600 mb-6">{error || 'Herb not found'}</p>
            <Button variant="primary" onClick={handleGoBack}>
              Return to Herb Directory
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language Indicator */}
        {language !== 'EN' && (
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              <BookOpen className="h-3 w-3 mr-1" />
              Viewing in: {language === 'AM' ? 'አማርኛ' : 'Oromiffa'}
            </div>
          </div>
        )}

        {/* Multiple Conditions Badges - Display at top */}
        {herb.conditionNames && herb.conditionNames.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <Activity className="h-4 w-4 mr-2" />
              Treats:
            </div>
            {herb.conditionNames.map((conditionName, index) => {
              const Icon = getConditionIcon(conditionName)
              return (
                <div key={index} className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                  <Icon className="h-4 w-4 mr-2" />
                  {conditionName}
                </div>
              )
            })}
          </div>
        )}

        {/* Source Badge - Display at top if source exists */}
        {herb.source && herb.source.trim() !== '' && (
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <BookOpen className="h-4 w-4 mr-2" />
              Has Reference Source
            </div>
          </div>
        )}
        
        <HerbDetail herb={herb} />
      </div>
    </div>
  )
}

export default HerbDetailPage