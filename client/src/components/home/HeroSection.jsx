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
      navigate(`/${activeTab}?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const tabs = [
    { id: 'herbs', label: t('hero.search.herbs'), icon: Leaf },
    { id: 'conditions', label: t('hero.search.conditions'), icon: Shield }
  ]

  const stats = [
    { icon: Award, value: '500+', label: t('home.trust.healers.title') },
    { icon: BookOpen, value: '200+', label: t('common.learnMore') },
    { icon: Shield, value: 'WHO', label: t('home.trust.who.title') }
  ]

  const popularSearches = [
    { en: 'Aloe Vera', key: 'aloe' },
    { en: 'Kosso', key: 'kosso' },
    { en: 'Gesho', key: 'gesho' },
    { en: 'Acne', key: 'acne' },
    { en: 'Dry Skin', key: 'dry_skin' }
  ]

  return (
    <section className="relative w-full bg-emerald-900 -mt-20 md:-mt-24 lg:-mt-28">
      {/* Background Image - Full width with no gaps */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={backgroundImage}
          alt="Herbal background" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content - Matches navbar container width */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-700 text-sm font-medium mb-6 shadow-lg">
            <Sparkles className="h-4 w-4" />
            {t('hero.badge')}
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {t('hero.title1')}{' '}
            <span className="text-emerald-300">{t('hero.title2')}</span>
            <br />
            <span className="text-4xl md:text-5xl text-white/90">{t('hero.title3')}</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          {/* Search Tabs */}
          <div className="flex justify-center gap-2 mb-4">
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
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="flex items-center bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Search className="h-5 w-5 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'herbs' 
                  ? t('hero.search.placeholder.herbs')
                  : t('hero.search.placeholder.conditions')
                }
                className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="mr-2 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {t('hero.search.button')}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="text-sm text-white/80">{t('hero.popular')}</span>
            {popularSearches.map((term) => (
              <button
                key={term.key}
                onClick={() => setSearchQuery(term.en)}
                className="px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
              >
                {t(`herbs.${term.key}`)}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 pt-6 border-t border-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection