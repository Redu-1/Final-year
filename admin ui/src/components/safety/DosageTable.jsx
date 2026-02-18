// src/components/safety/DosageTable.jsx
import { useState, useMemo } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import {
  ChevronUpDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const DosageTable = ({ 
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onExport,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('herb');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const defaultData = [
    {
      id: 1,
      herb: "Ashwagandha Root",
      scientificName: "Withania somnifera",
      targetGroup: "Adults (18-65)",
      amount: "300mg - 500mg",
      frequency: "2x Daily",
      source: "Pharmacopoeia",
      status: "approved",
      lastUpdated: "2 days ago",
      evidenceLevel: "A",
      notes: "Standardized to 2.5% withanolides"
    },
    {
      id: 2,
      herb: "Moringa Oleifera",
      scientificName: "Moringa oleifera",
      targetGroup: "Child (6-12y)",
      amount: "1g - 2g (Powder)",
      frequency: "1x Daily",
      source: "Clinical Study",
      status: "approved",
      lastUpdated: "1 week ago",
      evidenceLevel: "B",
      notes: "Best taken with meals"
    },
    {
      id: 3,
      herb: "Curcuma Longa",
      scientificName: "Curcuma longa",
      targetGroup: "General Adult",
      amount: "500mg (95% Curc.)",
      frequency: "3x Daily",
      source: "Trad. Ayurveda",
      status: "pending",
      lastUpdated: "3 days ago",
      evidenceLevel: "A",
      notes: "Enhanced absorption with piperine"
    },
    {
      id: 4,
      herb: "Bacopa Monnieri",
      scientificName: "Bacopa monnieri",
      targetGroup: "Senior (65y+)",
      amount: "150mg - 300mg",
      frequency: "Daily (AM)",
      source: "Clinical Study",
      status: "approved",
      lastUpdated: "2 weeks ago",
      evidenceLevel: "B",
      notes: "Standardized to 20% bacosides"
    },
    {
      id: 5,
      herb: "Ginkgo Biloba",
      scientificName: "Ginkgo biloba",
      targetGroup: "Adults (40-75)",
      amount: "120mg - 240mg",
      frequency: "2x Daily",
      source: "Pharmacopoeia",
      status: "approved",
      lastUpdated: "1 month ago",
      evidenceLevel: "A",
      notes: "Standardized to 24% flavon glycosides"
    },
    {
      id: 6,
      herb: "Valerian Root",
      scientificName: "Valeriana officinalis",
      targetGroup: "Adults (18+)",
      amount: "400mg - 900mg",
      frequency: "30min before bed",
      source: "Clinical Study",
      status: "draft",
      lastUpdated: "5 days ago",
      evidenceLevel: "B",
      notes: "For sleep onset insomnia"
    }
  ];

  const dosageData = data.length > 0 ? data : defaultData;

  const sourceOptions = useMemo(() => {
    const sources = [...new Set(dosageData.map(item => item.source))];
    return [
      { value: 'all', label: 'All Sources' },
      ...sources.map(source => ({
        value: source,
        label: source
      }))
    ];
  }, [dosageData]);

  const ageGroupOptions = useMemo(() => {
    const groups = [...new Set(dosageData.map(item => item.targetGroup))];
    return [
      { value: 'all', label: 'All Age Groups' },
      ...groups.map(group => ({
        value: group,
        label: group
      }))
    ];
  }, [dosageData]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...dosageData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.herb.toLowerCase().includes(query) ||
        item.scientificName.toLowerCase().includes(query) ||
        item.targetGroup.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
      );
    }

    // Apply age group filter
    if (ageGroupFilter !== 'all') {
      result = result.filter(item => item.targetGroup === ageGroupFilter);
    }

    // Apply source filter
    if (sourceFilter !== 'all') {
      result = result.filter(item => item.source === sourceFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (sortColumn === 'herb') {
        aValue = a.herb.toLowerCase();
        bValue = b.herb.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [dosageData, searchQuery, ageGroupFilter, sourceFilter, sortColumn, sortDirection]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(filteredAndSortedData.map(item => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const getEvidenceLevelBadge = (level) => {
    const config = {
      A: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Level A' },
      B: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Level B' },
      C: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Level C' },
      D: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Level D' }
    };

    const levelConfig = config[level] || config.D;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${levelConfig.bg} ${levelConfig.text}`}>
        {levelConfig.label}
      </span>
    );
  };

  const handleAction = (action, item, e) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit?.(item);
        break;
      case 'delete':
        onDelete?.(item);
        break;
      case 'view':
        onView?.(item);
        break;
      case 'duplicate':
        onDuplicate?.(item);
        break;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dosage Guidelines</h3>
          <p className="text-gray-600 mt-1">Clinically validated dosage recommendations for different population groups</p>
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
            icon={DocumentArrowUpIcon}
            onClick={onExport}
          >
            Export Guidelines
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbs, target groups, or sources..."
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              className="block w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500"
            >
              {ageGroupOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="block w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500"
            >
              {sourceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence Level
                </label>
                <select className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  <option>All Levels</option>
                  <option>Level A (Strong Evidence)</option>
                  <option>Level B (Moderate Evidence)</option>
                  <option>Level C (Limited Evidence)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Draft</option>
                  <option>Archived</option>
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
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    checked={selectedRows.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('herb')}
                >
                  <div className="flex items-center">
                    <span>HERB</span>
                    <ChevronUpDownIcon className="w-4 h-4 ml-1 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TARGET GROUP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AMOUNT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FREQUENCY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SOURCE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EVIDENCE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.map((item) => (
                <tr 
                  key={item.id}
                  className={`hover:bg-gray-50 transition-colors ${selectedRows.has(item.id) ? 'bg-emerald-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      checked={selectedRows.has(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-emerald-600">
                          {item.herb.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.herb}</div>
                        <div className="text-xs text-gray-500 italic">{item.scientificName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <InformationCircleIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.targetGroup}</div>
                        <div className="text-xs text-gray-500">{item.notes?.split(' ').slice(0, 3).join(' ')}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{item.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.frequency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEvidenceLevelBadge(item.evidenceLevel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleAction('view', item, e)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="View details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleAction('edit', item, e)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit dosage"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleAction('duplicate', item, e)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleAction('delete', item, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete dosage"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedData.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <InformationCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No dosage guidelines found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery || ageGroupFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'No dosage guidelines have been added yet.'}
            </p>
          </div>
        )}

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredAndSortedData.length}</span> of{' '}
              <span className="font-medium">{dosageData.length}</span> dosage guidelines
            </div>
            
            {selectedRows.size > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{selectedRows.size}</span> selected
                </span>
                <Button size="sm" variant="outline">
                  Publish Selected
                </Button>
                <Button size="sm" variant="danger">
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg font-bold text-emerald-600">A</span>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-700">
                {filteredAndSortedData.filter(item => item.evidenceLevel === 'A').length}
              </div>
              <div className="text-sm text-emerald-800">Level A Evidence</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-sm font-bold text-blue-600">CL</span>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-700">
                {filteredAndSortedData.filter(item => item.source.includes('Clinical')).length}
              </div>
              <div className="text-sm text-blue-800">Clinical Studies</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg font-bold text-amber-600">✓</span>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-700">
                {filteredAndSortedData.filter(item => item.status === 'approved').length}
              </div>
              <div className="text-sm text-amber-800">Approved Guidelines</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg font-bold text-purple-600">↻</span>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-700">
                {filteredAndSortedData.filter(item => item.lastUpdated?.includes('day')).length}
              </div>
              <div className="text-sm text-purple-800">Updated This Week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosageTable;