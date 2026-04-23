// src/components/home/HeroSection.jsx
import { useState } from 'react'
import { Search, Sparkles, ChevronRight, Leaf, Shield, Award, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../../assets/back.jpg'
import { useTranslation } from '../../hooks/useTranslation'

const HeroSection = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('herbs')
  const { t } = useTranslation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (activeTab === 'herbs') {
        // Search herbs by name
        navigate(`/herbs?search=${encodeURIComponent(searchQuery)}`)
      } else {
        // Search conditions - redirect to herbs page with condition filter
        // This will filter herbs that treat the searched condition
        navigate(`/herbs?condition=${encodeURIComponent(searchQuery)}`)
      }
    }
  }

  const tabs = [
    { id: 'herbs', label: t('hero.search.herbs'), icon: Leaf },
    { id: 'conditions', label: t('hero.search.conditions'), icon: Shield }
  ]

  const popularSearches = [
    { en: 'Aloe Vera', key: 'aloe', type: 'herb' },
    { en: 'Ginger', key: 'ginger', type: 'herb' },
    { en: 'Turmeric', key: 'turmeric', type: 'herb' },
    { en: 'Acne', key: 'acne', type: 'condition' },
    { en: 'Inflammation', key: 'inflammation', type: 'condition' },
    { en: 'Skin Rash', key: 'skin_rash', type: 'condition' },
    { en: 'Dry Skin', key: 'dry_skin', type: 'condition' }
  ]

  const handlePopularSearch = (term, type) => {
    if (type === 'herb') {
      navigate(`/herbs?search=${encodeURIComponent(term)}`)
    } else {
      navigate(`/herbs?condition=${encodeURIComponent(term)}`)
    }
  }

  return (
    <section className="relative w-full bg-emerald-900 h-[400px] md:h-auto -mt-20 md:-mt-24 lg:-mt-28">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={backgroundImage}
          alt="Herbal background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full md:h-auto flex items-center md:block z-10">
        <div className="text-center max-w-4xl mx-auto md:py-20 lg:py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-700 text-sm font-medium mb-3 md:mb-6 shadow-lg">
            <Sparkles className="h-4 w-4" />
            {t('hero.badge')}
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 leading-tight">
            {t('hero.title1')}{' '}
            <span className="text-emerald-300">{t('hero.title2')}</span>
            <br />
            <span className="text-2xl md:text-4xl lg:text-5xl text-white/90">{t('hero.title3')}</span>
          </h1>

          {/* Description with Poppins font */}
          <p className="text-base md:text-xl text-white/90 mb-4 md:mb-8 max-w-2xl mx-auto font-poppins font-light tracking-wide leading-relaxed">
            {t('hero.description')}
          </p>

          {/* Search Tabs */}
          <div className="hidden md:flex justify-center gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all backdrop-blur-sm ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white/90 text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-4 md:mb-6">
            <div className="flex items-center bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Search className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'herbs' 
                  ? t('hero.search.placeholder.herbs') || "Search herbs by name..."
                  : t('hero.search.placeholder.conditions') || "Search skin conditions..."
                }
                className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="mr-2 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {t('hero.search.button') || 'Search'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="text-sm text-white/80">{t('hero.popular') || 'Popular:'}</span>
            {popularSearches.map((term) => (
              <button
                key={term.key}
                onClick={() => handlePopularSearch(term.en, term.type)}
                className="px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
              >
                {term.en}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection