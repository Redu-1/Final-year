// src/components/recommendations/RecommendationForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronRight, Loader2,
  Leaf, Star, CheckCircle, Flame, Shield, Zap, Pill, Flower2,
  Activity, Bug, Thermometer, Heart, AlertCircle, BookOpen
} from 'lucide-react'
import Button from '../common/Button'
import HerbCard from '../herbs/HerbCard'
import { useTranslation } from '../../hooks/useTranslation'
import { useLanguage } from '../../contexts/LanguageContext'
import { herbApi, getApiBaseUrl } from '../../services/herbApi'

const RecommendationForm = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate()
  const { language, getApiLanguageCode } = useLanguage()
  const [step, setStep] = useState(1)
  const [selectedCondition, setSelectedCondition] = useState(null)
  const [conditions, setConditions] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [translatedConditions, setTranslatedConditions] = useState({})
  const [isLoadingConditions, setIsLoadingConditions] = useState(false)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const { t } = useTranslation()

  // Fetch real conditions from API
  useEffect(() => {
    const fetchConditions = async () => {
      setIsLoadingConditions(true)
      try {
        const conditionsList = await herbApi.getConditions()
        setConditions(conditionsList)
        console.log('✅ Loaded conditions:', conditionsList)
      } catch (error) {
        console.error('Failed to fetch conditions:', error)
      } finally {
        setIsLoadingConditions(false)
      }
    }
    fetchConditions()
  }, [])

  // Fetch condition translations
  const fetchConditionTranslations = async () => {
    if (language === 'EN' || conditions.length === 0) return;
    
    setIsLoadingTranslations(true)
    const apiLangCode = getApiLanguageCode()
    const translations = {}
    
    for (const condition of conditions) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${getApiBaseUrl()}/condition-translations/${condition.id}/${apiLangCode}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : {},
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            translations[condition.id] = data.data
          }
        }
      } catch (error) {
        console.log(`No translation found for condition ${condition.id}`)
      }
    }
    
    setTranslatedConditions(translations)
    console.log(`✅ Loaded ${Object.keys(translations).length} condition translations for ${language}`)
    setIsLoadingTranslations(false)
  }

  // Fetch translations when language or conditions change
  useEffect(() => {
    if (conditions.length > 0) {
      fetchConditionTranslations()
    }
  }, [language, conditions])

  // Get translated condition name
  const getTranslatedConditionName = (condition) => {
    if (language === 'EN') return condition.name
    const translation = translatedConditions[condition.id]
    return translation?.translated_name || condition.name
  }

  // Get translated condition description
  const getTranslatedConditionDescription = (condition) => {
    if (language === 'EN') return condition.description
    const translation = translatedConditions[condition.id]
    return translation?.translated_description || condition.description
  }

  // Get condition icon based on name
  const getConditionIcon = (conditionName) => {
    const name = conditionName?.toLowerCase() || ''
    if (name.includes('acne')) return Bug
    if (name.includes('inflammation') || name.includes('inflammatory')) return Flame
    if (name.includes('rash')) return Activity
    if (name.includes('skin')) return Shield
    if (name.includes('burn')) return Zap
    if (name.includes('digest')) return Pill
    return Flower2
  }

  // Fetch herb recommendations based on selected condition
  const fetchRecommendations = async () => {
    if (!selectedCondition) return
    
    setIsLoadingRecommendations(true)
    try {
      const allHerbs = await herbApi.getPublishedHerbs(1, 100)
      const recommendedHerbs = allHerbs.filter(herb => 
        herb.conditionIds && herb.conditionIds.includes(selectedCondition.id)
      )
      
      console.log(`Found ${recommendedHerbs.length} herbs for condition ${selectedCondition.name}`)
      setRecommendations(recommendedHerbs)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition)
  }

  const handleGetRecommendations = async () => {
    if (!selectedCondition) return
    await fetchRecommendations()
    setStep(2)
  }

  const resetForm = () => {
    setSelectedCondition(null)
    setRecommendations([])
    setStep(1)
  }

  const handleViewHerb = (herb) => {
    navigate(`/herbs/${herb.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      {/* Language Indicator */}
      {language !== 'EN' && (
        <div className="mb-4 flex justify-end">
          <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            <BookOpen className="h-3 w-3 mr-1" />
            Viewing in: {language === 'AM' ? 'አማርኛ' : 'Oromiffa'}
          </div>
        </div>
      )}

      {/* Step 1: Select Condition */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-xl p-6 sm:p-8 relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Find Herbal Remedies
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Select a condition to get personalized herb recommendations
            </p>
            {language !== 'EN' && (
              <p className="text-xs text-purple-600 mt-2">
                Condition names are shown in {language === 'AM' ? 'Amharic' : 'Oromo'} where available
              </p>
            )}
          </div>

          {/* Conditions Grid with Translations - Responsive */}
          {isLoadingConditions || isLoadingTranslations ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {conditions.map((condition) => {
                const Icon = getConditionIcon(condition.name)
                const isSelected = selectedCondition?.id === condition.id
                const translatedName = getTranslatedConditionName(condition)
                const translatedDescription = getTranslatedConditionDescription(condition)
                
                return (
                  <button
                    key={condition.id}
                    onClick={() => handleConditionSelect(condition)}
                    className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm sm:text-base font-semibold truncate ${isSelected ? 'text-emerald-700' : 'text-gray-900'}`}>
                          {translatedName}
                        </h3>
                        {translatedDescription && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                            {translatedDescription}
                          </p>
                        )}
                        {language !== 'EN' && translatedName !== condition.name && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            Original: {condition.name}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {conditions.length === 0 && !isLoadingConditions && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No conditions available</p>
            </div>
          )}

          {/* Get Recommendation Button */}
          <div className="pt-4 sm:pt-6 border-t border-gray-100">
            <Button
              onClick={handleGetRecommendations}
              disabled={!selectedCondition}
              className="w-full group"
              size="lg"
            >
              Get Recommendation
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {!selectedCondition && (
              <p className="text-xs sm:text-sm text-amber-600 text-center mt-3">
                Please select a condition first
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Show Recommendations using HerbCard */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-xl overflow-hidden relative z-10">
          {/* Header - Responsive */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Recommended Herbs</h2>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                  For: {selectedCondition ? getTranslatedConditionName(selectedCondition) : ''}
                </p>
                <p className="text-emerald-100 text-xs mt-1">
                  Found {recommendations.length} herb{recommendations.length !== 1 ? 's' : ''}
                </p>
                {language !== 'EN' && (
                  <p className="text-emerald-100 text-xs mt-1 hidden sm:block">
                    Herb names and details shown in {language === 'AM' ? 'Amharic' : 'Oromo'} where available
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* View Toggle */}
                <div className="flex bg-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white text-emerald-700' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-emerald-700' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    List
                  </button>
                </div>
                <button
                  onClick={resetForm}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-xs sm:text-sm"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations List using HerbCard - Responsive */}
          <div className="p-4 sm:p-6">
            {isLoadingRecommendations ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No herbs found for this condition</p>
                <button
                  onClick={resetForm}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base"
                >
                  Try another condition
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6`}>
                {recommendations.map((herb) => (
                  <HerbCard 
                    key={herb.id} 
                    herb={herb} 
                    viewMode={viewMode}
                    onView={handleViewHerb}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecommendationForm