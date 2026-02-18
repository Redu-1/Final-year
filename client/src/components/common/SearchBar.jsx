// src/components/common/SearchBar.jsx
import { useState, useRef, useEffect } from 'react'
import { Search, X, Filter } from 'lucide-react'
import Button from './Button'

const SearchBar = ({
  placeholder = "Search herbs or skin conditions...",
  onSearch,
  showFilters = false,
  filters = [],
  onFilterChange,
  className = '',
  autoFocus = false,
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      if (onSearch && query.trim()) {
        onSearch(query, selectedFilters)
      }
    }, debounceDelay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [query, selectedFilters])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch && query.trim()) {
      onSearch(query, selectedFilters)
    }
  }

  const handleClear = () => {
    setQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleFilterToggle = (filterId) => {
    const updatedFilters = {
      ...selectedFilters,
      [filterId]: !selectedFilters[filterId],
    }
    setSelectedFilters(updatedFilters)
    if (onFilterChange) {
      onFilterChange(updatedFilters)
    }
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div
          className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-300 ${
            isFocused
              ? 'border-emerald-500 shadow-lg shadow-emerald-100/50'
              : 'border-emerald-200 hover:border-emerald-300 hover:shadow-md'
          }`}
        >
          {/* Search Icon */}
          <div className="absolute left-4 pointer-events-none">
            <Search className={`h-5 w-5 transition-colors ${
              isFocused ? 'text-emerald-500' : 'text-emerald-400'
            }`} />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-4 bg-transparent focus:outline-none text-gray-900 placeholder-emerald-400"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 p-1 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-emerald-400 hover:text-emerald-600" />
            </button>
          )}

          {/* Filter Button */}
          {showFilters && filters.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`absolute right-20 p-2 rounded-lg transition-colors ${
                Object.values(selectedFilters).some(Boolean)
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'hover:bg-emerald-50 text-emerald-400'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow"
          >
            Search
          </button>
        </div>

        {/* Filter Menu */}
        {showFilters && showFilterMenu && filters.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-emerald-200 shadow-2xl z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Filters</h4>
              {Object.values(selectedFilters).some(Boolean) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterToggle(filter.id)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    selectedFilters[filter.id]
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                      : 'bg-white border-emerald-200 text-gray-700 hover:border-emerald-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Selected Filters Display */}
      {showFilters && Object.values(selectedFilters).some(Boolean) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters
            .filter((filter) => selectedFilters[filter.id])
            .map((filter) => (
              <div
                key={filter.id}
                className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
              >
                {filter.label}
                <button
                  onClick={() => handleFilterToggle(filter.id)}
                  className="ml-2 hover:text-emerald-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar