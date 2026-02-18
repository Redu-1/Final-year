// src/components/common/FilterBar.jsx
import { useState } from 'react';
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const FilterBar = ({
  options = [],
  value,
  onChange,
  label = 'Filter',
  multiple = false,
  clearable = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(multiple ? (value || []) : []);

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newSelected = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newSelected);
      onChange?.(newSelected);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    if (multiple) {
      setSelectedValues([]);
      onChange?.([]);
    } else {
      onChange?.('');
    }
  };

  const selectedCount = multiple ? selectedValues.length : (value ? 1 : 0);
  const displayValue = multiple 
    ? selectedCount > 0 
      ? `${selectedCount} selected`
      : label
    : options.find(opt => opt.value === value)?.label || label;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-between w-full
          px-4 py-2.5
          border border-gray-300 rounded-xl
          bg-white hover:bg-gray-50
          text-sm font-medium text-gray-700
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
        `}
      >
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-4 w-4 text-gray-400" />
          <span>{displayValue}</span>
          {selectedCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Filters</span>
              {clearable && (selectedCount > 0 || value) && (
                <button
                  onClick={handleClear}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => {
              const isSelected = multiple 
                ? selectedValues.includes(option.value)
                : value === option.value;
              
              return (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                    isSelected ? 'bg-emerald-50' : ''
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="flex items-center">
                    {multiple && (
                      <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    )}
                    <span className={`text-sm ${isSelected ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {option.count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          {multiple && (
            <div className="px-3 py-2 border-t border-gray-100">
              <button
                onClick={() => {
                  onChange?.(selectedValues);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterBar;