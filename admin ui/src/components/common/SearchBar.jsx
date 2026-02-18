// src/components/common/SearchBar.jsx
import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  onClear,
  showFilter = false,
  onFilterClick,
  filterActive = false,
  size = 'md',
  className = '',
  autoFocus = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizes = {
    sm: 'py-2 text-sm',
    md: 'py-2.5 text-sm',
    lg: 'py-3 text-base'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  const handleClear = () => {
    onChange?.('');
    onClear?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
          isFocused ? 'text-emerald-500' : 'text-gray-400'
        }`}>
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            block w-full pl-10 ${showFilter ? 'pr-24' : value ? 'pr-10' : 'pr-4'}
            ${sizes[size]}
            border border-gray-300 rounded-xl
            bg-white/50 backdrop-blur-sm
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            transition-all duration-200
            placeholder:text-gray-400
          `}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        
        {showFilter && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
            <div className="w-px h-6 bg-gray-300 mr-2"></div>
            <button
              type="button"
              onClick={onFilterClick}
              className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                filterActive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-1.5" />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;