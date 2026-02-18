// src/components/herbs/HerbDirectory.jsx
import { useState } from 'react'
import { Grid, List, Filter, Search, ChevronDown, TrendingUp, Star } from 'lucide-react'
import HerbCard from './HerbCard'
import HerbFilters from './HerbFilters'
import Button from '../common/Button'

const HerbDirectory = ({ herbs }) => {
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const sortOptions = [
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    { id: 'az', label: 'A to Z', icon: 'A' },
    { id: 'effectiveness', label: 'Effectiveness', icon: Star },
    { id: 'traditional', label: 'Traditional Use', icon: 'T' },
  ]

  const filteredHerbs = herbs.filter(herb =>
    herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.uses.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleFilterChange = (filters) => {
    console.log('Filters changed:', filters)
    // Implement filtering logic
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ethiopian Herb Directory
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Discover traditional Ethiopian herbs for skin wellness, verified by traditional healers and modern science.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbs by name, local name, or use..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-lg"
              />
              <Search className="absolute left-4 top-4 h-6 w-6 text-emerald-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex bg-emerald-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border-2 border-emerald-200 rounded-xl pl-4 pr-10 py-3 text-gray-700 focus:outline-none focus:border-emerald-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-emerald-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <HerbFilters onFilterChange={handleFilterChange} />

      {/* Herb Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg">
          <span className="font-bold text-emerald-700">{filteredHerbs.length}</span>
          <span className="text-gray-600"> herbs found</span>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Advanced Filters
        </Button>
      </div>

      {/* Herb Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHerbs.map(herb => (
            <HerbCard key={herb.id} herb={herb} variant="default" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHerbs.map(herb => (
            <div
              key={herb.id}
              className="bg-white rounded-2xl border border-emerald-100 p-6 hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={herb.image}
                    alt={herb.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700">
                        {herb.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-emerald-600 font-medium">{herb.localName}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{herb.scientificName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                        {herb.category}
                      </span>
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {herb.effectiveness}%
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 line-clamp-2">
                    {herb.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {herb.uses.slice(0, 4).map((use, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
                      >
                        {use}
                      </span>
                    ))}
                    {herb.uses.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{herb.uses.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredHerbs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
            <Search className="h-12 w-12 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No herbs found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setSearchQuery('')
              // Reset filters
            }}
          >
            Clear Search & Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {filteredHerbs.length > 0 && (
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">
              ← Previous
            </button>
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                className={`w-10 h-10 rounded-lg font-medium ${
                  num === 1
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                {num}
              </button>
            ))}
            <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HerbDirectory