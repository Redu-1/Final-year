// src/components/recommendations/RecommendationResults.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Star, CheckCircle, Bookmark, Share2, 
  Download, ExternalLink, Filter, 
  TrendingUp, Heart, Shield, Zap,
  Droplets, Flame, AlertCircle, Calendar
} from 'lucide-react'
import Button from '../common/Button'
import { useTranslation } from '../../hooks/useTranslation'

const RecommendationResults = ({ recommendations, userData }) => {
  const [savedRecommendations, setSavedRecommendations] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('effectiveness')
  const { t } = useTranslation()

  const herbEffectiveness = [
    { icon: Star, color: 'text-amber-500', label: t('rec.effective.high') },
    { icon: TrendingUp, color: 'text-emerald-500', label: t('rec.effective.traditional') },
    { icon: Shield, color: 'text-blue-500', label: t('rec.effective.safe') },
  ]

  const filters = [
    { id: 'all', label: t('rec.filter.all') },
    { id: 'high-impact', label: t('rec.filter.high_impact') },
    { id: 'traditional', label: t('rec.filter.traditional') },
    { id: 'easy-prep', label: t('rec.filter.easy_prep') },
    { id: 'sensitive', label: t('rec.filter.sensitive') },
  ]

  const sortOptions = [
    { id: 'effectiveness', label: t('rec.sort.effectiveness') },
    { id: 'traditional', label: t('rec.sort.traditional_use') },
    { id: 'preparation', label: t('rec.sort.preparation') },
    { id: 'safety', label: t('rec.sort.safety') },
  ]

  const handleSaveRecommendation = (recId) => {
    setSavedRecommendations(prev =>
      prev.includes(recId)
        ? prev.filter(id => id !== recId)
        : [...prev, recId]
    )
  }

  const handleShareRecommendation = (recId) => {
    // Implement share functionality
    console.log('Sharing recommendation:', recId)
  }

  const handleDownloadPlan = () => {
    // Implement download functionality
    console.log('Downloading treatment plan')
  }

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'high-impact') return rec.effectiveness >= 90
    if (activeFilter === 'traditional') return rec.traditionalUse >= 4
    if (activeFilter === 'easy-prep') return rec.preparationDifficulty === 'easy'
    if (activeFilter === 'sensitive') return rec.safetyLevel === 'high'
    return true
  })

  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    switch(sortBy) {
      case 'effectiveness': return b.effectiveness - a.effectiveness
      case 'traditional': return b.traditionalUse - a.traditionalUse
      case 'preparation': 
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 }
        return difficultyOrder[a.preparationDifficulty] - difficultyOrder[b.preparationDifficulty]
      case 'safety':
        const safetyOrder = { high: 0, medium: 1, low: 2 }
        return safetyOrder[a.safetyLevel] - safetyOrder[b.safetyLevel]
      default: return 0
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 border-4 border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('rec.results.badge')}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {t('rec.results.title')}
              </h1>
              
              <p className="text-emerald-100 text-lg mb-6">
                {t('rec.results.subtitle')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="text-sm opacity-90">{t('rec.results.stats.conditions')}</div>
                  <div className="font-bold">{userData?.conditions?.length || 0}</div>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="text-sm opacity-90">{t('rec.results.stats.herbs')}</div>
                  <div className="font-bold">{recommendations.length}</div>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="text-sm opacity-90">{t('rec.results.stats.score')}</div>
                  <div className="font-bold">92%</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadPlan}
                variant="secondary"
                className="!bg-white !text-emerald-700"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('rec.results.save')}
              </Button>
              <Button variant="outline" className="!border-white !text-white">
                <Share2 className="h-5 w-5 mr-2" />
                {t('rec.results.share')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Effectiveness Indicators */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {herbEffectiveness.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-emerald-100 p-6">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-xl ${item.color.replace('text-', 'bg-')} bg-opacity-10 flex items-center justify-center mr-4`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-600">{t('rec.effective.based')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Sort */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-500" />
            <span className="font-medium text-gray-700">{t('rec.filter.title')}</span>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{t('rec.sort.title')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {sortedRecommendations.map((recommendation, index) => {
          const isSaved = savedRecommendations.includes(recommendation.id)
          
          return (
            <div
              key={recommendation.id}
              className="bg-white rounded-3xl border-2 border-emerald-100 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                      <span className="text-2xl font-bold text-emerald-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{recommendation.herbName}</h3>
                      <p className="text-emerald-600 font-medium">{recommendation.localName}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveRecommendation(recommendation.id)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-emerald-500 text-emerald-500' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={() => handleShareRecommendation(recommendation.id)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Effectiveness Score */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="font-bold text-gray-900">{recommendation.effectiveness}{t('rec.card.effective')}</span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                    {recommendation.preparationDifficulty === 'easy' ? t('rec.card.prep.easy') : t('rec.card.prep.traditional')}
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">{t('rec.card.best_for')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.bestFor.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* How It Works */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">{t('rec.card.how_it_works')}</h4>
                  <p className="text-gray-600">
                    {recommendation.description}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {recommendation.benefits.slice(0, 4).map((benefit, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/herbs/${recommendation.herbId}`}
                    className="flex-1"
                  >
                    <Button variant="primary" className="w-full group">
                      {t('rec.card.view_details')}
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button variant="outline">
                    {t('rec.card.prep_guide')}
                  </Button>
                </div>
              </div>

              {/* Traditional Wisdom */}
              <div className="border-t border-emerald-100 p-6 bg-emerald-50/50">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">{t('rec.card.traditional_wisdom')}</h5>
                    <p className="text-sm text-gray-600">
                      {t('rec.card.traditional_desc', { 
                        region: recommendation.region, 
                        years: recommendation.traditionalUse 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Treatment Plan Summary */}
      <div className="mt-12 bg-gradient-to-r from-emerald-50 to-white rounded-3xl border border-emerald-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('rec.plan.title')}</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">{t('rec.plan.weekly.title')}</h3>
            <div className="space-y-3">
              {[
                t('rec.plan.weekly.morning'),
                t('rec.plan.weekly.evening'),
                t('rec.plan.weekly.treatment')
              ].map((time, idx) => (
                <div key={idx} className="flex items-center p-3 bg-white rounded-xl border border-emerald-100">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                    <span className="text-emerald-700 font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{time}</div>
                    <div className="text-sm text-gray-600">{t('rec.plan.weekly.desc')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">{t('rec.plan.timeline.title')}</h3>
            <div className="space-y-4">
              {[
                { week: '1-2', result: t('rec.plan.timeline.result1') },
                { week: '3-4', result: t('rec.plan.timeline.result2') },
                { week: '5-8', result: t('rec.plan.timeline.result3') },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                    <span className="font-bold text-emerald-700">{item.week}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('rec.plan.timeline.week', { week: item.week })}</div>
                    <div className="text-sm text-gray-600">{item.result}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">{t('rec.plan.safety.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-amber-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-amber-800">{t('rec.plan.safety.patch.title')}</div>
                  <div className="text-sm text-amber-700">{t('rec.plan.safety.patch.desc')}</div>
                </div>
              </div>
              <div className="flex items-start p-3 bg-blue-50 rounded-xl">
                <Heart className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-blue-800">{t('rec.plan.safety.healer.title')}</div>
                  <div className="text-sm text-blue-700">{t('rec.plan.safety.healer.desc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-12 text-center">
        <div className="inline-flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-6">
            {t('rec.cta.text')}
          </p>
          <div className="flex gap-4">
            <Button variant="primary" size="lg">
              {t('rec.cta.start')}
            </Button>
            <Button variant="outline" size="lg">
              {t('rec.cta.consult')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationResults