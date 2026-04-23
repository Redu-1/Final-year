// src/pages/Herbs.jsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import HerbCard from '../components/herbs/HerbCard'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { 
  Leaf, Filter, Search, Grid, List, 
  X, ChevronDown, Check, Star, 
  Thermometer, Droplets, Shield, 
  Zap, Heart, Scissors, Eye,
  Flower2, Sparkles, Pill, AlertCircle,
  Clock, CheckCircle, RefreshCw, Activity, Bug, Flame, Wind,
  Layers, FilterX, Plus, Minus, BookOpen, ChevronUp
} from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { herbApi, getApiBaseUrl } from '../services/herbApi'
import { useLanguage } from '../contexts/LanguageContext'

const Herbs = () => {
  const navigate = useNavigate()
  const { language, getApiLanguageCode } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [herbs, setHerbs] = useState([])
  const [conditions, setConditions] = useState([])
  const [translatedConditions, setTranslatedConditions] = useState({})
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileConditions, setShowMobileConditions] = useState(false)
  const [activeConditions, setActiveConditions] = useState([])
  const [filterLogic, setFilterLogic] = useState('OR')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [apiError, setApiError] = useState(null)
  const [isApiConnected, setIsApiConnected] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const { t } = useTranslation()

  // Handle view herb navigation
  const handleViewHerb = (herb) => {
    console.log('🌿 Navigating to herb detail:', herb.id, herb.name)
    navigate(`/herbs/${herb.id}`)
  }

  // Get translated condition name
  const getTranslatedConditionName = useCallback((condition) => {
    if (language === 'EN') return condition.name;
    const translation = translatedConditions[condition.id];
    return translation?.translated_name || condition.name;
  }, [language, translatedConditions])

  // Fetch condition translations for current language
  const fetchConditionTranslations = useCallback(async () => {
    if (language === 'EN' || conditions.length === 0) return;
    
    const apiLangCode = getApiLanguageCode();
    const translations = {};
    
    for (const condition of conditions) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${getApiBaseUrl()}/condition-translations/${condition.id}/${apiLangCode}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : {},
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            translations[condition.id] = data.data;
          }
        }
      } catch (error) {
        console.log(`No translation found for condition ${condition.id}`);
      }
    }
    
    setTranslatedConditions(translations);
    console.log(`✅ Loaded ${Object.keys(translations).length} condition translations for ${language}`);
  }, [language, conditions, getApiLanguageCode]);

  // Fetch conditions from API
  const fetchConditions = useCallback(async () => {
    try {
      console.log('🌿 Fetching conditions for client view...')
      const token = localStorage.getItem('token')
      const response = await fetch(`${getApiBaseUrl()}/conditions?_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Conditions fetched:', data)
        
        if (data.success && Array.isArray(data.data)) {
          setConditions(data.data)
        } else if (Array.isArray(data)) {
          setConditions(data)
        }
      } else {
        console.warn('Failed to fetch conditions, status:', response.status)
      }
    } catch (error) {
      console.error('❌ Error fetching conditions:', error)
    }
  }, [])

  // Fetch only published herbs from API
  const fetchPublishedHerbs = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setApiError(null)
    
    try {
      console.log('🌿 Fetching published herbs for client view...')
      console.log('📡 API URL:', `${getApiBaseUrl()}/herbs/published?page=1&limit=100`)
      
      const publishedHerbs = await herbApi.getPublishedHerbs(1, 100)
      console.log(`✅ Received ${publishedHerbs.length} published herbs`)
      
      setHerbs(publishedHerbs)
      setIsApiConnected(true)
      setLastUpdated(Date.now())
      
    } catch (error) {
      console.error('❌ Error fetching published herbs:', error)
      setApiError(error.message || 'Failed to load herbs. Please try again.')
      setIsApiConnected(false)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPublishedHerbs()
    fetchConditions()
  }, [fetchPublishedHerbs, fetchConditions])

  // Fetch translations when language or conditions change
  useEffect(() => {
    if (conditions.length > 0) {
      fetchConditionTranslations();
    }
  }, [language, conditions, fetchConditionTranslations]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing herbs...')
      fetchPublishedHerbs(true)
      fetchConditions()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchPublishedHerbs, fetchConditions])

  // Handle condition parameter from URL
  useEffect(() => {
    const conditionParam = searchParams.get('condition')
    if (conditionParam && conditions.length > 0) {
      const matchedCondition = conditions.find(c => 
        c.name.toLowerCase() === conditionParam.toLowerCase() ||
        getTranslatedConditionName(c).toLowerCase() === conditionParam.toLowerCase()
      )
      if (matchedCondition && !activeConditions.includes(matchedCondition.id)) {
        setActiveConditions(prev => [...prev, matchedCondition.id])
        console.log(`🔍 Auto-filtered by condition: ${matchedCondition.name}`)
      }
    }
  }, [searchParams, conditions, getTranslatedConditionName, activeConditions])

  // Handle search parameter from URL
  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam)
      console.log(`🔍 Search query from URL: ${searchParam}`)
    }
  }, [searchParams])

  // Get condition name by ID for search
  const getConditionNameForSearch = (conditionId) => {
    const condition = conditions.find(c => c.id === conditionId)
    if (!condition) return ''
    if (language !== 'EN') {
      const translation = translatedConditions[conditionId];
      return (translation?.translated_name || condition.name).toLowerCase()
    }
    return condition.name.toLowerCase()
  }

  // Map condition icons based on name
  const getConditionIcon = (conditionName) => {
    const name = conditionName?.toLowerCase() || ''
    if (name.includes('acne')) return Bug
    if (name.includes('inflammation') || name.includes('inflammatory')) return Flame
    if (name.includes('rash')) return Activity
    if (name.includes('skin')) return Shield
    if (name.includes('chebt')) return Zap
    if (name.includes('hb')) return Pill
    return Activity
  }

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery })
    } else {
      const conditionParam = searchParams.get('condition')
      if (conditionParam) {
        setSearchParams({ condition: conditionParam })
      } else {
        setSearchParams({})
      }
    }
  }, [searchQuery, setSearchParams])

  // Get condition name by ID
  const getConditionName = (conditionId) => {
    if (!conditionId) return null
    const condition = conditions.find(c => c.id === conditionId)
    if (!condition) return null
    
    if (language !== 'EN') {
      const translation = translatedConditions[conditionId];
      return translation?.translated_name || condition.name;
    }
    return condition?.name || null
  }

  // Get condition names for multiple IDs
  const getConditionNames = (conditionIds) => {
    if (!conditionIds || conditionIds.length === 0) return []
    return conditionIds.map(id => {
      const condition = conditions.find(c => c.id === id)
      if (!condition) return null
      
      if (language !== 'EN') {
        const translation = translatedConditions[id];
        return translation?.translated_name || condition.name;
      }
      return condition?.name || null
    }).filter(name => name !== null)
  }

  // Enrich herbs with condition names
  const enrichedHerbs = useMemo(() => {
    return herbs.map(herb => ({
      ...herb,
      conditionNames: getConditionNames(herb.conditionIds || []),
      primaryConditionName: getConditionName(herb.conditionIds?.[0]),
      conditionCount: herb.conditionIds?.length || 0
    }))
  }, [herbs, conditions, language, translatedConditions])

  // Filter herbs based on active filters AND search query
  const filteredHerbs = useMemo(() => {
    return enrichedHerbs.filter(herb => {
      let matchesSearch = true
      if (searchQuery !== '') {
        const query = searchQuery.toLowerCase()
        
        const matchesName = herb.name?.toLowerCase().includes(query)
        const matchesScientificName = herb.scientificName?.toLowerCase().includes(query)
        const matchesDescription = herb.description?.toLowerCase().includes(query)
        const matchesCondition = herb.conditionNames?.some(conditionName => 
          conditionName?.toLowerCase().includes(query)
        )
        
        matchesSearch = matchesName || matchesScientificName || matchesDescription || matchesCondition
      }

      let matchesCondition = true
      if (activeConditions.length > 0) {
        if (filterLogic === 'OR') {
          matchesCondition = herb.conditionIds && herb.conditionIds.some(id => activeConditions.includes(id))
        } else {
          matchesCondition = herb.conditionIds && activeConditions.every(id => herb.conditionIds.includes(id))
        }
      }
      
      return matchesSearch && matchesCondition
    })
  }, [searchQuery, activeConditions, filterLogic, enrichedHerbs])

  // Toggle condition filter
  const toggleCondition = (conditionId) => {
    setActiveConditions(prev => {
      const newConditions = prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
      
      const matchedCondition = conditions.find(c => c.id === conditionId)
      
      if (newConditions.length === 0) {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('condition')
        setSearchParams(newParams, { replace: true })
      } else if (matchedCondition && !prev.includes(conditionId)) {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('condition', matchedCondition.name)
        setSearchParams(newParams, { replace: true })
      }
      
      return newConditions
    })
  }

  const clearFilters = () => {
    setActiveConditions([])
    setSearchQuery('')
    setFilterLogic('OR')
    setShowFilters(false)
    setShowMobileConditions(false)
    setSearchParams({})
  }

  const clearConditionFilter = () => {
    setActiveConditions([])
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('condition')
    setSearchParams(newParams, { replace: true })
  }

  const retryConnection = () => {
    fetchPublishedHerbs()
    fetchConditions()
  }

  const handleManualRefresh = async () => {
    console.log('🔄 Manual refresh triggered')
    await fetchPublishedHerbs(true)
    await fetchConditions()
    console.log('🔄 Refresh complete')
  }

  const getActiveConditionName = (conditionId) => {
    const condition = conditions.find(c => c.id === conditionId)
    if (!condition) return 'Condition'
    
    if (language !== 'EN') {
      const translation = translatedConditions[conditionId];
      return translation?.translated_name || condition.name;
    }
    return condition.name
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 z-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Language Indicator */}
        {language !== 'EN' && (
          <div className="mb-4 flex justify-end">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              <BookOpen className="h-3 w-3 mr-1" />
              {language === 'AM' ? 'አማርኛ' : 'Oromiffa'}
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {t('herbs.page.title')}
              </h1>
              <p className="text-gray-600">
                {t('herbs.page.subtitle')}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t('herbs.page.updated')}: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all disabled:opacity-50"
                title={t('herbs.refresh')}
              >
                <RefreshCw className={`h-5 w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                {viewMode === 'grid' ? 
                  <List className="h-5 w-5 text-gray-600" /> : 
                  <Grid className="h-5 w-5 text-gray-600" />
                }
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all flex items-center gap-2"
              >
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{t('herbs.filters.title')}</span>
                {activeConditions.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                    {activeConditions.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Condition Search Banner */}
          {searchParams.get('condition') && activeConditions.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Shield className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-emerald-800 font-medium">
                    {t('herbs.banner.showing')} <strong className="text-emerald-900">{searchParams.get('condition')}</strong>
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {filteredHerbs.length} {filteredHerbs.length !== 1 ? t('herbs.banner.herbs_found_plural') : t('herbs.banner.herbs_found_singular')} {t('herbs.banner.for_condition')}
                  </p>
                </div>
              </div>
              <button 
                onClick={clearConditionFilter}
                className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                {t('herbs.banner.clear')}
              </button>
            </div>
          )}

          {/* Mobile Condition Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileConditions(!showMobileConditions)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-gray-700">{t('herbs.mobile.filter')}</span>
                {activeConditions.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                    {activeConditions.length}
                  </span>
                )}
              </div>
              {showMobileConditions ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {/* Mobile Conditions Dropdown */}
            {showMobileConditions && (
              <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{t('herbs.mobile.select')}</span>
                    {activeConditions.length > 0 && (
                      <button
                        onClick={() => setActiveConditions([])}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        {t('herbs.mobile.clear')}
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {conditions.map((condition) => {
                    const Icon = getConditionIcon(condition.name)
                    const translatedName = getTranslatedConditionName(condition)
                    const isActive = activeConditions.includes(condition.id)
                    const herbCount = herbs.filter(h => 
                      h.conditionIds && h.conditionIds.includes(condition.id)
                    ).length
                    
                    return (
                      <button
                        key={condition.id}
                        onClick={() => toggleCondition(condition.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                          isActive ? 'bg-emerald-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                          <div className="text-left">
                            <span className={`text-sm font-medium ${isActive ? 'text-emerald-700' : 'text-gray-700'}`}>
                              {translatedName}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">({herbCount})</span>
                          </div>
                        </div>
                        {isActive && <Check className="h-5 w-5 text-emerald-600" />}
                      </button>
                    )
                  })}
                </div>
                {activeConditions.length > 0 && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      {filterLogic === 'OR' 
                        ? t('herbs.mobile.any', { count: activeConditions.length })
                        : t('herbs.mobile.all', { count: activeConditions.length })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Bar - WITH TRANSLATION */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('herbs.search.placeholder')}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 text-gray-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">{t('herbs.error.title')}</h3>
                  <p className="text-sm text-red-700 mt-1">{apiError}</p>
                  {!isApiConnected && (
                    <p className="text-sm text-red-600 mt-2">
                      API URL: {getApiBaseUrl()}
                    </p>
                  )}
                  <button
                    onClick={retryConnection}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    {t('herbs.error.retry')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Bar */}
          {(activeConditions.length > 0 || searchQuery) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">{t('herbs.filters.active')}:</span>
              
              {activeConditions.length > 1 && (
                <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {filterLogic === 'OR' ? t('herbs.filters.any') : t('herbs.filters.all')}
                  <button
                    onClick={() => setFilterLogic(filterLogic === 'OR' ? 'AND' : 'OR')}
                    className="ml-2 hover:text-purple-900"
                    title={t('herbs.filters.toggle')}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {activeConditions.map(conditionId => (
                <span key={conditionId} className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                  {getActiveConditionName(conditionId)}
                  <button
                    onClick={() => toggleCondition(conditionId)}
                    className="ml-2 hover:text-emerald-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {t('herbs.filters.search')}: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-gray-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium ml-2"
              >
                {t('herbs.filters.clear_all')}
              </button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters (Desktop only) */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              
              {/* Status Info */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-emerald-800">{t('herbs.status.published_title')}</h3>
                </div>
                <p className="text-sm text-emerald-700 mb-3">
                  {t('herbs.status.showing')} {herbs.length} {t('herbs.status.herbs')}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700">{t('herbs.status.last_updated')}:</span>
                  <span className="font-medium text-emerald-900">
                    {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Filter Logic Toggle */}
              {activeConditions.length > 1 && (
                <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5">
                  <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {t('herbs.logic.title')}
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFilterLogic('OR')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterLogic === 'OR'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Plus className="h-3 w-3" />
                        {t('herbs.logic.any')}
                      </div>
                      <p className="text-xs mt-1 opacity-80">{t('herbs.logic.any_desc')}</p>
                    </button>
                    <button
                      onClick={() => setFilterLogic('AND')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterLogic === 'AND'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Minus className="h-3 w-3" />
                        {t('herbs.logic.all')}
                      </div>
                      <p className="text-xs mt-1 opacity-80">{t('herbs.logic.all_desc')}</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Conditions Filter - Desktop */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-gray-600" />
                    <h3 className="font-bold text-gray-900">{t('herbs.conditions.title')}</h3>
                  </div>
                  {activeConditions.length > 0 && (
                    <button
                      onClick={() => setActiveConditions([])}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FilterX className="h-3 w-3" />
                      {t('herbs.conditions.clear')}
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {conditions.map((condition) => {
                    const Icon = getConditionIcon(condition.name)
                    const translatedName = getTranslatedConditionName(condition)
                    const herbCount = herbs.filter(h => 
                      h.conditionIds && h.conditionIds.includes(condition.id)
                    ).length
                    const isActive = activeConditions.includes(condition.id)
                    
                    return (
                      <button
                        key={condition.id}
                        onClick={() => toggleCondition(condition.id)}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700 font-medium border border-emerald-200' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`h-4 w-4 mr-3 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <span className="flex-1 text-left">{translatedName}</span>
                        <span className="text-xs text-gray-400">{herbCount}</span>
                        {isActive && <Check className="h-4 w-4 ml-2 text-emerald-500" />}
                      </button>
                    )
                  })}
                </div>
                
                {/* Selected conditions summary */}
                {activeConditions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">{t('herbs.conditions.selected')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {activeConditions.map(id => {
                        const condition = conditions.find(c => c.id === id)
                        return condition ? (
                          <span key={id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-700">
                            {getTranslatedConditionName(condition)}
                          </span>
                        ) : null
                      })}
                    </div>
                    <p className="text-xs text-emerald-600 mt-2">
                      {filterLogic === 'OR' 
                        ? t('herbs.conditions.any_result', { count: activeConditions.length })
                        : t('herbs.conditions.all_result', { count: activeConditions.length })}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-5">
                <h3 className="font-bold text-emerald-800 mb-3">{t('herbs.stats.title')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">{t('herbs.stats.total_herbs')}</span>
                    <span className="font-bold text-emerald-900">{herbs.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">{t('herbs.stats.conditions')}</span>
                    <span className="font-bold text-emerald-900">{conditions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">{t('herbs.stats.multi_condition')}</span>
                    <span className="font-bold text-emerald-900">
                      {herbs.filter(h => h.conditionIds && h.conditionIds.length > 1).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">{t('herbs.stats.avg_conditions')}</span>
                    <span className="font-bold text-emerald-900">
                      {(herbs.reduce((sum, h) => sum + (h.conditionIds?.length || 0), 0) / herbs.length || 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">{t('herbs.stats.last_sync')}</span>
                    <span className="font-medium text-emerald-900 text-sm">
                      {new Date(lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Herb Cards */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {searchParams.get('condition') 
                    ? `${t('herbs.results.herbs_for')} ${searchParams.get('condition')}`
                    : searchQuery 
                      ? `${t('herbs.results.results_for')} "${searchQuery}"`
                      : t('herbs.directory.title')
                  }
                </h2>
                <p className="text-gray-600 mt-1">
                  {t('herbs.results.showing')} {filteredHerbs.length} {t('herbs.results.of')} {herbs.length} {t('herbs.results.herbs')}
                </p>
                {activeConditions.length > 0 && (
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {t('herbs.results.filtering')} {activeConditions.length} {activeConditions.length === 1 ? t('herbs.results.condition') : t('herbs.results.conditions')} - 
                    <span className="font-medium">
                      {filterLogic === 'OR' ? t('herbs.results.match_any') : t('herbs.results.match_all')}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Leaf className="h-4 w-4" />
                <span>{t('herbs.traditional.label')}</span>
              </div>
            </div>

            {/* All Herbs */}
            <div>
              {filteredHerbs.length === 0 ? (
                <div className="text-center py-12">
                  <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('herbs.no_results.title')}</h4>
                  <p className="text-gray-600 mb-6">
                    {activeConditions.length > 0 
                      ? t('herbs.no_results.message_conditions')
                      : t('herbs.no_results.message')}
                  </p>
                  {apiError ? (
                    <button
                      onClick={retryConnection}
                      className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      {t('herbs.error.retry')}
                    </button>
                  ) : (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      {t('herbs.filters.clear_all')}
                    </button>
                  )}
                </div>
              ) : (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                  {filteredHerbs.map((herb) => (
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
        </div>
      </div>
    </div>
  )
}

export default Herbs