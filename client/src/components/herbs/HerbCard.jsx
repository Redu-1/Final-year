// src/components/herbs/HerbCard.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Leaf, ExternalLink, Star, Eye, Share2, ChevronRight } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const HerbCard = ({ herb, variant = 'default' }) => {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(herb.isBookmarked || false)
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useTranslation()

  const handleBookmark = (e) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // API call to update bookmark status
  }

  const handleHerbClick = () => {
    navigate(`/herbs/${herb.id}`)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    // Show quick view modal
  }

  const variants = {
    default: 'border-emerald-100 hover:border-emerald-200',
    featured: 'border-emerald-200 shadow-lg',
    compact: 'border-emerald-50',
  }

  return (
    <div
      className={`group relative bg-white rounded-2xl border-2 ${variants[variant]} overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
        isHovered ? 'scale-[1.02] border-emerald-300' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleHerbClick}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={herb.image}
          alt={herb.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-emerald-700 text-xs font-bold rounded-full">
            {herb.category}
          </span>
          {herb.popularity > 90 && (
            <span className="px-3 py-1 bg-amber-500/95 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center">
              <Star className="h-3 w-3 mr-1" />
              {t('herbs.card.popular')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleBookmark}
            className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all hover:scale-110"
          >
            <Bookmark className={`h-5 w-5 ${
              isBookmarked ? 'fill-emerald-500 text-emerald-500' : 'text-gray-400'
            }`} />
          </button>
          <button
            onClick={handleQuickView}
            className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all hover:scale-110"
          >
            <Eye className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Local Name Overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-lg">
            <span className="text-white text-sm font-medium">{herb.localName}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Herb Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              {herb.name}
            </h3>
            <p className="text-sm text-emerald-600 font-medium mt-1">{herb.scientificName}</p>
          </div>
          <Leaf className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {herb.description}
        </p>

        {/* Uses Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {herb.uses.slice(0, 3).map((use, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-100 transition-colors"
            >
              {use}
            </span>
          ))}
          {herb.uses.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{herb.uses.length - 3} {t('herbs.card.more')}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-amber-500 mr-1" />
            <span>{herb.effectiveness}% {t('herbs.card.effective')}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 text-gray-400 mr-1" />
            <span>{herb.views} {t('herbs.card.views')}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleHerbClick}
            className="flex items-center text-emerald-600 font-semibold text-sm group/btn"
          >
            {t('herbs.card.view_details')}
            <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Share functionality
            }}
            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Share2 className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Hover Effect Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform transition-transform duration-300 ${
        isHovered ? 'scale-x-100' : 'scale-x-0'
      }`}></div>
    </div>
  )
}

// Compact Variant
export const CompactHerbCard = ({ herb }) => {
  const { t } = useTranslation()
  
  return (
    <div className="flex items-center p-4 bg-white rounded-xl border border-emerald-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mr-4">
        <Leaf className="h-6 w-6 text-emerald-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700">
          {herb.name}
        </h4>
        <p className="text-sm text-gray-600">{herb.localName}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
    </div>
  )
}

export default HerbCard