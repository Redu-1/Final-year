// src/components/herbs/HerbList.jsx
import { useState, useMemo } from 'react';
import HerbCard from './HerbCard';
import { 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';
import FilterBar from '../common/FilterBar';

const HerbList = ({ 
  herbs = [], 
  loading = false,
  onHerbClick,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onAddHerb,
  viewMode = 'grid',
  onViewModeChange,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status', count: herbs.length },
    { value: 'published', label: 'Published', count: herbs.filter(h => h.status === 'published').length },
    { value: 'draft', label: 'Draft', count: herbs.filter(h => h.status === 'draft').length },
    { value: 'pending', label: 'Pending Review', count: herbs.filter(h => h.status === 'pending').length },
    { value: 'archived', label: 'Archived', count: herbs.filter(h => h.status === 'archived').length }
  ];

  const regionOptions = useMemo(() => {
    const regions = [...new Set(herbs.map(h => h.indigenousRegion))];
    return [
      { value: 'all', label: 'All Regions', count: herbs.length },
      ...regions.map(region => ({
        value: region,
        label: region,
        count: herbs.filter(h => h.indigenousRegion === region).length
      }))
    ];
  }, [herbs]);

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'date', label: 'Recently Added' },
    { value: 'date-old', label: 'Oldest First' },
    { value: 'status', label: 'Status' }
  ];

  // Filter and sort herbs
  const filteredHerbs = useMemo(() => {
    let result = [...herbs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(herb => 
        herb.commonName.toLowerCase().includes(query) ||
        herb.scientificName.toLowerCase().includes(query) ||
        herb.description?.toLowerCase().includes(query) ||
        herb.indigenousRegion.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(herb => herb.status === statusFilter);
    }

    // Apply region filter
    if (regionFilter !== 'all') {
      result = result.filter(herb => herb.indigenousRegion === regionFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return sortOrder === 'asc' 
            ? a.commonName.localeCompare(b.commonName)
            : b.commonName.localeCompare(a.commonName);
        case 'name-desc':
          return b.commonName.localeCompare(a.commonName);
        case 'date':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'date-old':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'status':
          const statusOrder = { published: 1, pending: 2, draft: 3, archived: 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return result;
  }, [herbs, searchQuery, statusFilter, regionFilter, sortBy, sortOrder]);

  const handleSortChange = (value) => {
    if (value === 'name-desc') {
      setSortBy('name');
      setSortOrder('desc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="flex items-center space-x-2">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Herbs Management</h2>
          <p className="text-gray-600 mt-1">Search herbs by name or scientific name...</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={FunnelIcon}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="primary"
            icon={PlusIcon}
            onClick={onAddHerb}
          >
            Add New Herb
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              placeholder="Search herbs by name or scientific name..."
              value={searchQuery}
              onChange={setSearchQuery}
              showFilter={false}
              size="lg"
            />
          </div>
          <div>
            <FilterBar
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              label="Status"
            />
          </div>
          <div>
            <FilterBar
              options={regionOptions}
              value={regionFilter}
              onChange={setRegionFilter}
              label="Region"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parts Used
                </label>
                <select className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  <option>All Parts</option>
                  <option>Leaves</option>
                  <option>Roots</option>
                  <option>Flowers</option>
                  <option>Bark</option>
                  <option>Seeds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Safety Level
                </label>
                <select className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  <option>All Levels</option>
                  <option>A - Very Safe</option>
                  <option>B - Generally Safe</option>
                  <option>C - Use Caution</option>
                  <option>D - Unsafe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Updated
                </label>
                <select className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Any Time</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange?.('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid View"
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange?.('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List View"
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy === 'name' && sortOrder === 'desc' ? 'name-desc' : sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-2.5 text-gray-400">
              <ChevronUpDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredHerbs.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{herbs.length}</span> herbs
        </div>
      </div>

      {/* Empty State */}
      {filteredHerbs.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpenIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No herbs found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchQuery || statusFilter !== 'all' || regionFilter !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'No herbs have been added yet. Start by adding your first herb.'}
          </p>
          {(!searchQuery && statusFilter === 'all' && regionFilter === 'all') && (
            <Button
              variant="primary"
              icon={PlusIcon}
              onClick={onAddHerb}
            >
              Add Your First Herb
            </Button>
          )}
        </div>
      )}

      {/* Herb Cards/List */}
      {filteredHerbs.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHerbs.map((herb) => (
                <HerbCard
                  key={herb.id}
                  herb={herb}
                  viewMode={viewMode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onDuplicate={onDuplicate}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHerbs.map((herb) => (
                <HerbCard
                  key={herb.id}
                  herb={herb}
                  viewMode={viewMode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onDuplicate={onDuplicate}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{Math.min(filteredHerbs.length, 20)}</span> of{' '}
              <span className="font-medium">{filteredHerbs.length}</span> results
            </div>
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={true}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                size="sm"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                3
              </Button>
              <span className="px-2 text-gray-500">...</span>
              <Button
                variant="outline"
                size="sm"
              >
                10
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </nav>
          </div>
        </>
      )}

      {/* Batch Actions */}
      {filteredHerbs.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="select-all"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                  Select all herbs
                </label>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">0</span> herbs selected
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                disabled={true}
              >
                Publish Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={true}
              >
                Archive Selected
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={true}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper PlusIcon component
const PlusIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default HerbList;