// src/components/home/FeaturedHerbs.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Leaf, Zap, Droplets, Flame, Shield, Bookmark, ExternalLink } from 'lucide-react'
import Button from '../common/Button'

const FeaturedHerbs = () => {
  const navigate = useNavigate()
  const [bookmarkedHerbs, setBookmarkedHerbs] = useState([])
  const [hoveredHerb, setHoveredHerb] = useState(null)

  const featuredHerbs = [
    {
      id: 1,
      name: "Aloe Vera",
      localName: "Eret, Herbo",
      scientificName: "Aloe barbadensis miller",
      uses: ["Burns", "Inflammation", "Moisturizing", "Sunburn"],
      description: "A succulent plant known globally for its soothing, healing, and moisturizing properties, ideal for various skin conditions.",
      image: "https://images.unsplash.com/photo-1599302592159-3b4d19b355d8",
      benefits: [
        { icon: Flame, label: "Soothes burns", color: "text-red-500" },
        { icon: Droplets, label: "Deep hydration", color: "text-blue-500" },
        { icon: Shield, label: "Protects skin", color: "text-emerald-500" },
      ],
      category: "Succulent",
      popularity: 95,
    },
    {
      id: 2,
      name: "Kosso",
      localName: "Koso",
      scientificName: "Hagenia abyssinica",
      uses: ["Skin purification", "Anti-parasitic", "Cleansing"],
      description: "Known for its anthelmintic properties and traditional use in skin purification and detoxification.",
      image: "https://images.unsplash.com/photo-1589923186741-db6e5d06b6ef",
      benefits: [
        { icon: Zap, label: "Purifies skin", color: "text-purple-500" },
        { icon: Shield, label: "Antimicrobial", color: "text-emerald-500" },
      ],
      category: "Tree Bark",
      popularity: 88,
    },
    {
      id: 3,
      name: "Gesho",
      localName: "Gesho",
      scientificName: "Rhamnus prinoides",
      uses: ["Cleansing", "Detoxifying", "Anti-inflammatory"],
      description: "Used in traditional remedies for its cleansing and detoxifying effects on the skin and body.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
      benefits: [
        { icon: Droplets, label: "Detoxifies", color: "text-blue-500" },
        { icon: Flame, label: "Reduces inflammation", color: "text-orange-500" },
      ],
      category: "Shrub",
      popularity: 82,
    },
    {
      id: 4,
      name: "Turmeric",
      localName: "Erd",
      scientificName: "Curcuma longa",
      uses: ["Anti-inflammatory", "Brightening", "Acne"],
      description: "Powerful antioxidant and anti-inflammatory properties for skin brightening and acne treatment.",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
      benefits: [
        { icon: Flame, label: "Reduces inflammation", color: "text-orange-500" },
        { icon: Zap, label: "Fights acne", color: "text-purple-500" },
        { icon: Shield, label: "Antioxidant", color: "text-amber-500" },
      ],
      category: "Rhizome",
      popularity: 92,
    },
    {
      id: 5,
      name: "Neem",
      localName: "Kinini",
      scientificName: "Azadirachta indica",
      uses: ["Antibacterial", "Acne", "Skin infections"],
      description: "Powerful antibacterial and antifungal properties effective against various skin infections.",
      image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d",
      benefits: [
        { icon: Shield, label: "Antibacterial", color: "text-emerald-500" },
        { icon: Zap, label: "Fights infections", color: "text-red-500" },
      ],
      category: "Tree",
      popularity: 85,
    },
    {
      id: 6,
      name: "Frankincense",
      localName: "Etan",
      scientificName: "Boswellia carterii",
      uses: ["Scar healing", "Anti-aging", "Regeneration"],
      description: "Valued for its rejuvenating and healing effects, used to reduce scars and promote regeneration.",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
      benefits: [
        { icon: Shield, label: "Heals scars", color: "text-emerald-500" },
        { icon: Zap, label: "Anti-aging", color: "text-purple-500" },
      ],
      category: "Resin",
      popularity: 78,
    },
  ]

  const toggleBookmark = (herbId) => {
    setBookmarkedHerbs(prev =>
      prev.includes(herbId)
        ? prev.filter(id => id !== herbId)
        : [...prev, herbId]
    )
  }

  const handleHerbClick = (herbId) => {
    navigate(`/herbs/${herbId}`)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
              <Leaf className="h-4 w-4 mr-2" />
              Featured Collection
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Discover{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Powerful Ethiopian Herbs
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Explore our curated collection of traditional Ethiopian herbs for skin wellness and healing.
            </p>
          </div>

          <div className="mt-6 lg:mt-0">
            <Button
              onClick={() => navigate('/herbs')}
              variant="outline"
              className="group"
            >
              View All Herbs
              <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Herbs', value: '100+', color: 'text-emerald-600' },
            { label: 'Skin Conditions', value: '50+', color: 'text-blue-600' },
            { label: 'Traditional Uses', value: '200+', color: 'text-amber-600' },
            { label: 'Verified Sources', value: '98%', color: 'text-emerald-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-emerald-100 p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Herb Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHerbs.map((herb) => {
            const isBookmarked = bookmarkedHerbs.includes(herb.id)
            const isHovered = hoveredHerb === herb.id

            return (
              <div
                key={herb.id}
                className="group relative"
                onMouseEnter={() => setHoveredHerb(herb.id)}
                onMouseLeave={() => setHoveredHerb(null)}
              >
                {/* Card Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500 ${
                  isHovered ? 'opacity-20' : ''
                }`}></div>

                {/* Main Card */}
                <div className={`relative bg-white rounded-2xl border-2 overflow-hidden h-full transition-all duration-300 ${
                  isHovered ? 'border-emerald-200 shadow-2xl scale-[1.02]' : 'border-emerald-100 shadow-lg hover:shadow-xl'
                }`}>
                  {/* Herb Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={herb.image}
                      alt={herb.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold rounded-full">
                        {herb.category}
                      </span>
                      <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                        {herb.popularity}% Effective
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(herb.id)
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Bookmark className={`h-5 w-5 ${
                          isBookmarked ? 'fill-emerald-500 text-emerald-500' : 'text-gray-400'
                        }`} />
                      </button>
                      <button
                        onClick={() => handleHerbClick(herb.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <ExternalLink className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Herb Name & Local Name */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {herb.name}
                        </h3>
                        <Leaf className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-emerald-600 font-medium mr-2">{herb.localName}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 ml-2">{herb.scientificName}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {herb.description}
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {herb.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <benefit.icon className={`h-4 w-4 mr-2 ${benefit.color}`} />
                          <span className="text-xs text-gray-700">{benefit.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Uses Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {herb.uses.slice(0, 3).map((use, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          {use}
                        </span>
                      ))}
                      {herb.uses.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{herb.uses.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleHerbClick(herb.id)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 font-semibold rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 group-hover:shadow-inner flex items-center justify-center"
                    >
                      View Full Details
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Hover Preview */}
                {isHovered && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full z-10 w-64 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900 mb-2">Quick Preview</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Click to view detailed information including preparation methods and safety guidelines.
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Heart className="h-4 w-4 text-rose-400" />
                        <span className="text-xs text-gray-500">{herb.popularity}% user satisfaction</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-lg text-gray-600 mb-6">
              Discover 100+ more herbs in our comprehensive database
            </p>
            <Button
              onClick={() => navigate('/herbs')}
              variant="primary"
              size="lg"
              className="group"
            >
              Explore Complete Herb Directory
              <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedHerbs