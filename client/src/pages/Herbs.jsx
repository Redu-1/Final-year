// src/pages/Herbs.jsx
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout, { PageWrapper, ContentSection } from '../components/layout/Layout'
import HerbCard from '../components/herbs/HerbCard'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { 
  Leaf, Filter, Search, Grid, List, 
  X, ChevronDown, Check, Star, 
  Thermometer, Droplets, Shield, 
  Zap, Heart, Scissors, Eye,
  Flower2, Sparkles, Pill
} from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Herbs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [activeSkinCondition, setActiveSkinCondition] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const { t } = useTranslation()

  // Skin conditions from screenshot
  const skinConditions = [
    { id: 'inflammation', name: t('herbs.conditions.inflammation'), icon: Thermometer },
    { id: 'downsitis', name: t('herbs.conditions.downsitis'), icon: Droplets },
    { id: 'burrus', name: t('herbs.conditions.burrus'), icon: Shield },
    { id: 'itching', name: t('herbs.conditions.itching'), icon: Zap },
    { id: 'radical', name: t('herbs.conditions.radical'), icon: Sparkles },
    { id: 'dry-skin', name: t('herbs.conditions.dry_skin'), icon: Droplets },
    { id: 'infections', name: t('herbs.conditions.infections'), icon: Shield },
    { id: 'scars', name: t('herbs.conditions.scars'), icon: Heart },
    { id: 'prioritans', name: t('herbs.conditions.prioritans'), icon: Pill },
    { id: 'aging', name: t('herbs.conditions.aging'), icon: Flower2 },
    { id: 'pain', name: t('herbs.conditions.pain'), icon: Thermometer },
    { id: 'circulation', name: t('herbs.conditions.circulation'), icon: Zap },
    { id: 'antiaspiric', name: t('herbs.conditions.antiaspiric'), icon: Shield },
    { id: 'neurothimans', name: t('herbs.conditions.neurothimans'), icon: Pill },
    { id: 'irritations', name: t('herbs.conditions.irritations'), icon: Zap },
    { id: 'hair', name: t('herbs.conditions.hair'), icon: Sparkles },
    { id: 'cuts', name: t('herbs.conditions.cuts'), icon: Scissors },
  ]

  // Herb categories from screenshot
  const herbCategories = [
    { id: 'spices', name: t('herbs.categories.spices') },
    { id: 'aromatic', name: t('herbs.categories.aromatic') },
    { id: 'seeds', name: t('herbs.categories.seeds') },
    { id: 'medicinal', name: t('herbs.categories.medicinal') },
    { id: 'succulents', name: t('herbs.categories.succulents') },
    { id: 'healing', name: t('herbs.categories.healing') },
    { id: 'resins', name: t('herbs.categories.resins') },
    { id: 'vegetables', name: t('herbs.categories.vegetables') },
    { id: 'grains', name: t('herbs.categories.grains') },
    { id: 'superfoods', name: t('herbs.categories.superfoods') },
    { id: 'legumes', name: t('herbs.categories.legumes') },
    { id: 'trees', name: t('herbs.categories.trees') },
  ]

  // ✅ Ethiopian Traditional Herbal Medicines ONLY (Koseret, Atuch, and Feto removed)
const mockHerbs = [
  {
    id: 1,
    name: "Kosso",
    localName: "Koso",
    scientificName: "Hagenia abyssinica",
    description: t('herbs.descriptions.kosso'),
    image: "https://upload.wikimedia.org/wikipedia/commons/8/83/Hagenia_abyssinica_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-208.jpg",
    category: t('herbs.categories.trees'),
    uses: [t('herbs.uses.antiparasitic'), t('herbs.uses.skin_purification')],
    condition: "infections",
    effectiveness: 92,
    views: 3200,
    featured: true,
  },
  {
    id: 2,
    name: "Enkoko",
    localName: "Enkoko",
    scientificName: "Embelia schimperi",
    description: t('herbs.descriptions.enkoko'),
    image: "https://img.sewasew.com/definitions/2cceaf3495a940acb267aac8d0d3e9fa_295_171",
    category: t('herbs.categories.medicinal'),
    uses: [t('herbs.uses.antiparasitic'), t('herbs.uses.detoxifying')],
    condition: "infections",
    effectiveness: 88,
    views: 2100,
  },
  {
    id: 3,
    name: "Metere",
    localName: "Metere",
    scientificName: "Glinus lotoides",
    description: t('herbs.descriptions.metere'),
    image: "https://www.zimbabweflora.co.zw/speciesdata/images/12/122910-10.jpg",
    category: t('herbs.categories.seeds'),
    uses: [t('herbs.uses.antiparasitic'), t('herbs.uses.digestive')],
    condition: "infections",
    effectiveness: 85,
    views: 1800,
  },
  {
    id: 4,
    name: "Bisana",
    localName: "Bisana",
    scientificName: "Croton macrostachyus",
    description: t('herbs.descriptions.bisana'),
    image: "https://bs.plantnet.org/image/s/eef467e01d1511329718e319263851d6465eb221",
    category: t('herbs.categories.trees'),
    uses: [t('herbs.uses.anti_inflammatory'), t('herbs.uses.wound_healing')],
    condition: "scars",
    effectiveness: 90,
    views: 2600,
    featured: true,
  },
  {
    id: 5,
    name: "Tena Adam",
    localName: "Tena Adam",
    scientificName: "Ruta chalepensis",
    description: t('herbs.descriptions.tena_adam'),
    image: "https://img.sewasew.com/definitions/3238fd076e634cbda36797b9c2df9bbc_960_720",
    category: t('herbs.categories.aromatic'),
    uses: [t('herbs.uses.antibacterial'), t('herbs.uses.anti_inflammatory')],
    condition: "irritations",
    effectiveness: 87,
    views: 2400,
  },
  {
    id: 6,
    name: "Aloe",
    localName: "Eret",
    scientificName: "Aloe spp.",
    description: t('herbs.descriptions.aloe'),
    image: "https://res.cloudinary.com/smartagri/image/upload/v1/blogs/aloe_vera_vfhntj",
    category: t('herbs.categories.succulents'),
    uses: [t('herbs.uses.burn_healing'), t('herbs.uses.moisturizing')],
    condition: "cuts",
    effectiveness: 95,
    views: 4200,
    featured: true,
  },
]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery })
    } else {
      setSearchParams({})
    }
  }, [searchQuery, setSearchParams])

  // Filter herbs based on active filters
  const filteredHerbs = useMemo(() => {
    return mockHerbs.filter(herb => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        herb.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        herb.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        herb.uses.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()))

      // Skin condition filter
      const matchesCondition = activeSkinCondition === 'all' || herb.condition === activeSkinCondition
      
      // Category filter
      const matchesCategory = activeCategory === 'all' || herb.category === activeCategory

      return matchesSearch && matchesCondition && matchesCategory
    })
  }, [searchQuery, activeSkinCondition, activeCategory])

  const clearFilters = () => {
    setActiveSkinCondition('all')
    setActiveCategory('all')
    setSearchQuery('')
    setShowFilters(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots size="lg" />
      </div>
    )
  }

  return (
    <Layout>
      <PageWrapper showHero={false}>
        {/* Main Content Area - Added negative margin to remove gap */}
        <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 -mt-8 md:-mt-12 lg:-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
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
                </div>
                <div className="flex items-center gap-3">
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
                    {(activeSkinCondition !== 'all' || activeCategory !== 'all') && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                        {activeSkinCondition !== 'all' ? 1 : 0 + activeCategory !== 'all' ? 1 : 0}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Search Bar */}
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

              {/* Active Filters Bar */}
              {(activeSkinCondition !== 'all' || activeCategory !== 'all' || searchQuery) && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">{t('herbs.filters.active')}:</span>
                  {activeSkinCondition !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                      {skinConditions.find(c => c.id === activeSkinCondition)?.name}
                      <button
                        onClick={() => setActiveSkinCondition('all')}
                        className="ml-2 hover:text-emerald-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {activeCategory !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {activeCategory}
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {t('herbs.search.label')}: "{searchQuery}"
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
              {/* Left Sidebar - Filters */}
              <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="sticky top-24 space-y-6">
                  
                  {/* Skin Conditions Filter */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{t('herbs.filters.skin_condition')}</h3>
                      <button className="lg:hidden" onClick={() => setShowFilters(false)}>
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      <button
                        onClick={() => setActiveSkinCondition('all')}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeSkinCondition === 'all' ? 'bg-emerald-50 text-emerald-700 font-medium border border-emerald-200' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>{t('herbs.filters.all_conditions')}</span>
                        <span className="text-xs text-gray-500">{mockHerbs.length}</span>
                      </button>
                      {skinConditions.map((condition) => {
                        const Icon = condition.icon
                        const herbCount = mockHerbs.filter(h => h.condition === condition.id).length
                        return (
                          <button
                            key={condition.id}
                            onClick={() => setActiveSkinCondition(condition.id)}
                            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all ${activeSkinCondition === condition.id ? 'bg-emerald-50 text-emerald-700 font-medium border border-emerald-200' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            <Icon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="flex-1 text-left">{condition.name}</span>
                            <span className="text-xs text-gray-500">{herbCount}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Herb Categories Filter */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-4">{t('herbs.filters.category')}</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveCategory('all')}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeCategory === 'all' ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>{t('herbs.filters.all_categories')}</span>
                        <span className="text-xs text-gray-500">{mockHerbs.length}</span>
                      </button>
                      {herbCategories.map((category) => {
                        const herbCount = mockHerbs.filter(h => h.category === category.name).length
                        return (
                          <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.name)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeCategory === category.name ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            <span>{category.name}</span>
                            <span className="text-xs text-gray-500">{herbCount}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-5">
                    <h3 className="font-bold text-emerald-800 mb-3">{t('herbs.stats.title')}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-700">{t('herbs.stats.total_herbs')}</span>
                        <span className="font-bold text-emerald-900">{mockHerbs.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-700">{t('herbs.stats.conditions')}</span>
                        <span className="font-bold text-emerald-900">{skinConditions.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-700">{t('herbs.stats.categories')}</span>
                        <span className="font-bold text-emerald-900">{herbCategories.length}</span>
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
                      {searchQuery ? `${t('herbs.search.results_for')} "${searchQuery}"` : t('herbs.directory.title')}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {t('herbs.results.showing', { count: filteredHerbs.length, total: mockHerbs.length })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Leaf className="h-4 w-4" />
                    <span>{t('herbs.traditional.label')}</span>
                  </div>
                </div>

                {/* Featured Herbs */}
                {filteredHerbs.length > 0 && filteredHerbs.some(h => h.featured) && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{t('herbs.featured.title')}</h3>
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                      {filteredHerbs.filter(h => h.featured).map((herb) => (
                        <HerbCard 
                          key={herb.id} 
                          herb={herb} 
                          viewMode={viewMode}
                          variant="featured"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Herbs */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {filteredHerbs.length === 0 ? t('herbs.no_results.title') : t('herbs.all.title')}
                  </h3>
                  {filteredHerbs.length === 0 ? (
                    <div className="text-center py-12">
                      <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('herbs.no_results.message')}</h4>
                      <p className="text-gray-600 mb-6">{t('herbs.no_results.suggestion')}</p>
                      <button
                        onClick={clearFilters}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        {t('herbs.filters.clear_all')}
                      </button>
                    </div>
                  ) : (
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                      {filteredHerbs.filter(h => !h.featured).map((herb) => (
                        <HerbCard 
                          key={herb.id} 
                          herb={herb} 
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </Layout>
  )
}

export default Herbs