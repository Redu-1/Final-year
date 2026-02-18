// src/components/herbs/HerbFilters.jsx
import { useState } from 'react'
import { Filter, X, ChevronDown, Check, Search } from 'lucide-react'

const HerbFilters = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    uses: [],
    regions: [],
    preparation: [],
    safety: [],
  })

  const filterOptions = {
    categories: [
      { id: 'succulent', label: 'Succulent', count: 12 },
      { id: 'tree', label: 'Tree', count: 28 },
      { id: 'shrub', label: 'Shrub', count: 35 },
      { id: 'herb', label: 'Herb', count: 42 },
      { id: 'spice', label: 'Spice', count: 18 },
      { id: 'resin', label: 'Resin', count: 7 },
    ],
    uses: [
      { id: 'burns', label: 'Burns', count: 24 },
      { id: 'inflammation', label: 'Inflammation', count: 42 },
      { id: 'acne', label: 'Acne', count: 31 },
      { id: 'eczema', label: 'Eczema', count: 19 },
      { id: 'dryness', label: 'Dry Skin', count: 37 },
      { id: 'scars', label: 'Scars', count: 16 },
      { id: 'infection', label: 'Infection', count: 28 },
      { id: 'aging', label: 'Aging', count: 22 },
    ],
    regions: [
      { id: 'amhara', label: 'Amhara Region', count: 45 },
      { id: 'oromia', label: 'Oromia Region', count: 67 },
      { id: 'snnp', label: 'SNNP Region', count: 38 },
      { id: 'tigray', label: 'Tigray Region', count: 29 },
      { id: 'afar', label: 'Afar Region', count: 15 },
    ],
    preparation: [
      { id: 'topical', label: 'Topical Application', count: 82 },
      { id: 'poultice', label: 'Poultice', count: 34 },
      { id: 'infusion', label: 'Infusion', count: 27 },
      { id: 'decoction', label: 'Decoction', count: 19 },
      { id: 'oil', label: 'Infused Oil', count: 23 },
    ],
    safety: [
      { id: 'safe', label: 'Generally Safe', count: 89 },
      { id: 'caution', label: 'Use with Caution', count: 11 },
      { id: 'expert', label: 'Expert Guidance', count: 5 },
    ],
  }

  const handleFilterToggle = (category, filterId) => {
    const updatedFilters = {
      ...activeFilters,
      [category]: activeFilters[category].includes(filterId)
        ? activeFilters[category].filter(id => id !== filterId)
        : [...activeFilters[category], filterId]
    }
    
    setActiveFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      uses: [],
      regions: [],
      preparation: [],
      safety: [],
    }
    setActiveFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const clearCategory = (category) => {
    const updatedFilters = {
      ...activeFilters,
      [category]: []
    }
    setActiveFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const totalActiveFilters = Object.values(activeFilters).flat().length

  return (
    <div className="relative">
      {/* Filter Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
            totalActiveFilters > 0
              ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
              : 'bg-white text-gray-700 border-2 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
          {totalActiveFilters > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
              {totalActiveFilters}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Search within filters */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search within filtered results..."
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
          </div>
        </div>

        {totalActiveFilters > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center px-4 py-3 text-gray-600 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5 mr-2" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {totalActiveFilters > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(activeFilters).map(([category, filters]) =>
            filters.map(filterId => {
              const filter = filterOptions[category].find(f => f.id === filterId)
              return filter ? (
                <div
                  key={`${category}-${filterId}`}
                  className="inline-flex items-center px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium"
                >
                  {filter.label}
                  <button
                    onClick={() => handleFilterToggle(category, filterId)}
                    className="ml-2 hover:text-emerald-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null
            })
          )}
        </div>
      )}

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-2xl border-2 border-emerald-200 shadow-2xl p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 capitalize">
                    {category}
                  </h4>
                  {activeFilters[category].length > 0 && (
                    <button
                      onClick={() => clearCategory(category)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {options.map(option => {
                    const isActive = activeFilters[category].includes(option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleFilterToggle(category, option.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-emerald-50 border-2 border-emerald-300'
                            : 'bg-gray-50 hover:bg-emerald-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center mr-3 ${
                            isActive
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-gray-300'
                          }`}>
                            {isActive && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`font-medium ${
                            isActive ? 'text-emerald-700' : 'text-gray-700'
                          }`}>
                            {option.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {option.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Apply Filters Button */}
          <div className="mt-8 pt-6 border-t border-emerald-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {totalActiveFilters} filter{totalActiveFilters !== 1 ? 's' : ''} applied
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing <span className="font-semibold text-emerald-700">104</span> herbs
        {totalActiveFilters > 0 && (
          <>
            {' '}filtered from <span className="font-semibold">150</span> total
          </>
        )}
      </div>
    </div>
  )
}

export default HerbFilters