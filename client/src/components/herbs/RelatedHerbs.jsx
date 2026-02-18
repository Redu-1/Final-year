// src/components/herbs/RelatedHerbs.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingUp, Zap, Star, ExternalLink } from 'lucide-react'
import Button from '../common/Button'

const RelatedHerbs = ({ currentHerbId, herbs }) => {
  const [activeTab, setActiveTab] = useState('similar')

  const relatedHerbs = herbs.filter(herb => herb.id !== currentHerbId)

  // Group herbs by relationship
  const similarUses = relatedHerbs.slice(0, 4)
  const traditionalCombinations = relatedHerbs.slice(4, 8)
  const popularAlternatives = relatedHerbs.slice(8, 12)

  const tabs = [
    { id: 'similar', label: 'Similar Uses', herbs: similarUses },
    { id: 'combinations', label: 'Traditional Combinations', herbs: traditionalCombinations },
    { id: 'alternatives', label: 'Popular Alternatives', herbs: popularAlternatives },
  ]

  return (
    <section className="py-12 bg-gradient-to-b from-white to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
              <Zap className="h-4 w-4 mr-2" />
              Explore More Herbs
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Related{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Herbs & Remedies
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Discover other traditional Ethiopian herbs that work well together or serve similar purposes.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/herbs">
              <Button variant="outline" className="group">
                View All Herbs
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 border-b border-emerald-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="mb-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tabs
              .find(tab => tab.id === activeTab)
              ?.herbs.map(herb => (
                <div
                  key={herb.id}
                  className="group bg-white rounded-2xl border border-emerald-100 hover:border-emerald-200 hover:shadow-xl transition-all overflow-hidden cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={herb.image}
                      alt={herb.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Popular Badge */}
                    {herb.popularity > 90 && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 mb-2">
                      {herb.name}
                    </h4>
                    <p className="text-sm text-emerald-600 font-medium mb-3">
                      {herb.localName}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {herb.uses.slice(0, 2).map((use, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                        >
                          {use}
                        </span>
                      ))}
                    </div>

                    {/* Effectiveness */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {herb.effectiveness}% effective
                        </span>
                      </div>
                      <Link
                        to={`/herbs/${herb.id}`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
                      >
                        Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Traditional Knowledge */}
        <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100 p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Traditional Ethiopian{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Herbal Combinations
                </span>
              </h3>
              <p className="text-gray-600 mb-6">
                Traditional healers often combine multiple herbs for enhanced effects. 
                These combinations have been used for generations and represent the wisdom 
                of Ethiopian herbal medicine.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mr-4">
                    <span className="text-emerald-700 font-bold">+</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Enhanced Healing</h4>
                    <p className="text-sm text-gray-600">Combining herbs increases effectiveness</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mr-4">
                    <span className="text-emerald-700 font-bold">⚖️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Balanced Properties</h4>
                    <p className="text-sm text-gray-600">Different herbs balance each other</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Combination Examples */}
            <div className="space-y-4">
              {[
                { herbs: ['Aloe Vera', 'Turmeric'], effect: 'Enhanced anti-inflammatory' },
                { herbs: ['Neem', 'Kosso'], effect: 'Powerful antibacterial' },
                { herbs: ['Gesho', 'Frankincense'], effect: 'Skin regeneration' },
              ].map((combo, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-xl border border-emerald-100"
                >
                  <div className="flex items-center mb-3">
                    {combo.herbs.map((herb, i) => (
                      <>
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-medium rounded-lg">
                          {herb}
                        </span>
                        {i < combo.herbs.length - 1 && (
                          <span className="mx-2 text-emerald-400">+</span>
                        )}
                      </>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{combo.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RelatedHerbs