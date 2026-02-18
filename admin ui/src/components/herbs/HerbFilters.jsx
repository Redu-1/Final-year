// src/components/herbs/HerbFilters.jsx
import { useState } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon,
  TagIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Badge from '../common/Badge';

const HerbFilters = ({ 
  onFilterChange,
  onClearFilters,
  activeFilters = {},
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    region: [],
    partsUsed: [],
    safetyLevel: [],
    dateRange: null,
    properties: []
  });

  const filterOptions = {
    status: [
      { value: 'published', label: 'Published', color: 'emerald' },
      { value: 'draft', label: 'Draft', color: 'blue' },
      { value: 'pending', label: 'Pending', color: 'amber' },
      { value: 'archived', label: 'Archived', color: 'gray' }
    ],
    region: [
      { value: 'india', label: 'India', count: 45 },
      { value: 'middle-east', label: 'Middle East', count: 32 },
      { value: 'pacific-islands', label: 'Pacific Islands', count: 28 },
      { value: 'south-africa', label: 'South Africa', count: 24 },
      { value: 'south-america', label: 'South America', count: 36 },
      { value: 'east-asia', label: 'East Asia', count: 41 }
    ],
    partsUsed: [
      { value: 'leaves', label: 'Leaves', icon: '🍃' },
      { value: 'roots', label: 'Roots', icon: '🌱' },
      { value: 'flowers', label: 'Flowers', icon: '🌸' },
      { value: 'bark', label: 'Bark', icon: '🪵' },
      { value: 'seeds', label: 'Seeds', icon: '🌰' },
      { value: 'whole-plant', label: 'Whole Plant', icon: '🌿' }
    ],
    safetyLevel: [
      { value: 'a', label: 'A - Very Safe', color: 'emerald' },
      { value: 'b', label: 'B - Generally Safe', color: 'green' },
      { value: 'c', label: 'C - Use Caution', color: 'amber' },
      { value: 'd', label: 'D - Unsafe', color: 'red' }
    ],
    properties: [
      { value: 'anti-inflammatory', label: 'Anti-inflammatory' },
      { value: 'antioxidant', label: 'Antioxidant' },
      { value: 'analgesic', label: 'Analgesic' },
      { value: 'antimicrobial', label: 'Antimicrobial' },
      { value: 'adaptogen', label: 'Adaptogen' },
      { value: 'sedative', label: 'Sedative' },
      { value: 'digestive', label: 'Digestive Aid' },
      { value: 'immune-booster', label: 'Immune Booster' }
    ]
  };

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(v => v !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      return newFilters;
    });
  };

  const handleDateRangeChange = (value) => {
    setFilters(prev => ({ ...prev, dateRange: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange?.(filters);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      status: [],
      region: [],
      partsUsed: [],
      safetyLevel: [],
      dateRange: null,
      properties: []
    };
    setFilters(clearedFilters);
    onClearFilters?.();
  };

  const activeFilterCount = Object.values(filters).reduce((count, filterArray) => {
    return count + (Array.isArray(filterArray) ? filterArray.length : (filterArray ? 1 : 0));
  }, 0);

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-200 ${
          isOpen || activeFilterCount > 0
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="primary" size="sm" className="ml-2">
            {activeFilterCount}
          </Badge>
        )}
      </button>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && !isOpen && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(filters).map(([category, values]) => {
            if (!values || (Array.isArray(values) && values.length === 0)) return null;
            
            if (Array.isArray(values)) {
              return values.map(value => {
                const option = filterOptions[category]?.find(opt => opt.value === value);
                if (!option) return null;
                
                return (
                  <Badge
                    key={`${category}-${value}`}
                    variant="primary"
                    removable
                    onRemove={() => handleFilterChange(category, value)}
                  >
                    {option.icon && <span className="mr-1">{option.icon}</span>}
                    {option.label}
                  </Badge>
                );
              });
            }
            
            if (values) {
              const option = dateRanges.find(opt => opt.value === values);
              if (!option) return null;
              
              return (
                <Badge
                  key={`date-${values}`}
                  variant="primary"
                  removable
                  onRemove={() => handleDateRangeChange(null)}
                >
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {option.label}
                </Badge>
              );
            }
            
            return null;
          })}
          
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <FunnelIcon className="w-5 h-5 text-gray-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Filter Herbs</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Status Filter */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900">Status</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.status.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('status', option.value)}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                          filters.status.includes(option.value)
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                        <div className={`w-3 h-3 rounded-full ${option.color === 'emerald' ? 'bg-emerald-500' : option.color === 'blue' ? 'bg-blue-500' : option.color === 'amber' ? 'bg-amber-500' : 'bg-gray-500'}`}></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region Filter */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900">Region</h4>
                  </div>
                  <div className="space-y-2">
                    {filterOptions.region.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('region', option.value)}
                        className={`flex items-center justify-between w-full p-3 border rounded-lg transition-colors ${
                          filters.region.includes(option.value)
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{option.count} herbs</span>
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                            filters.region.includes(option.value)
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-gray-300'
                          }`}>
                            {filters.region.includes(option.value) && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parts Used Filter */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <TagIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900">Parts Used</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.partsUsed.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('partsUsed', option.value)}
                        className={`inline-flex items-center px-3 py-2 border rounded-lg transition-colors ${
                          filters.partsUsed.includes(option.value)
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safety Level Filter */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900">Safety Level</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.safetyLevel.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('safetyLevel', option.value)}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                          filters.safetyLevel.includes(option.value)
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                        <div className={`w-3 h-3 rounded-full ${
                          option.color === 'emerald' ? 'bg-emerald-500' :
                          option.color === 'green' ? 'bg-green-500' :
                          option.color === 'amber' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900">Last Updated</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {dateRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => handleDateRangeChange(range.value)}
                        className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                          filters.dateRange === range.value
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Properties Filter */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <ChartBarIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900">Properties</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.properties.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('properties', option.value)}
                        className={`p-3 border rounded-lg text-sm text-left transition-colors ${
                          filters.properties.includes(option.value)
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Clear all filters
                  </button>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleApplyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HerbFilters;