// src/pages/HerbsManagement/HerbsManagement.jsx
import { useState, useEffect } from 'react';
import HerbCard from '../../components/herbs/HerbCard';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import Button from '../../components/common/Button';
import AddHerbModal from '../../components/herbs/AddHerbModal';
import EditHerbModal from '../../components/herbs/EditHerbModal';
import ViewHerbModal from '../../components/herbs/ViewHerbModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import { 
  PlusIcon, 
  ArrowPathIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { herbApi } from '../../services/herbApi';
import { useAuth } from '../../contexts/AuthContext';

const HerbsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const { userType } = useAuth();
  const isAdmin = userType === 'admin';

  // Fetch herbs from API on component mount
  useEffect(() => {
    fetchHerbs();
  }, []);

  const fetchHerbs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await herbApi.getAllHerbs();
      console.log('📦 Fetched herbs:', data);
      
      if (data && Array.isArray(data)) {
        data.forEach(herb => {
          console.log(`  - ${herb.name}: status="${herb.status}", imageUrl=${herb.imageUrl || 'No image'}`);
        });
        
        console.log('📊 Status breakdown:', {
          total: data.length,
          published: data.filter(h => h.status === 'published').length,
          pending: data.filter(h => h.status === 'pending').length
        });
        
        setHerbs(data);
      } else {
        console.warn('Expected array but got:', data);
        setHerbs([]);
      }
    } catch (err) {
      console.error('Error fetching herbs:', err);
      setError('Failed to load herbs. Please try again.');
      setHerbs([]);
    } finally {
      setLoading(false);
    }
  };

  // Add blur effect to dashboard when any modal is open
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen || isViewModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
      const dashboardContent = document.querySelector('.dashboard-container, .app-content, main, #root > div:not(.modal-portal)');
      if (dashboardContent) {
        dashboardContent.classList.add('dashboard-blur');
      }
    } else {
      document.body.style.overflow = 'unset';
      const dashboardContent = document.querySelector('.dashboard-container, .app-content, main, #root > div:not(.modal-portal)');
      if (dashboardContent) {
        dashboardContent.classList.remove('dashboard-blur');
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      const dashboardContent = document.querySelector('.dashboard-container, .app-content, main, #root > div:not(.modal-portal)');
      if (dashboardContent) {
        dashboardContent.classList.remove('dashboard-blur');
      }
    };
  }, [isAddModalOpen, isEditModalOpen, isViewModalOpen, isDeleteModalOpen]);

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status', icon: null },
    { value: 'published', label: 'Published', icon: CheckCircleIcon },
    { value: 'pending', label: 'Pending', icon: ClockIcon }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'status', label: 'Status' }
  ];

  // Filter and sort herbs
  const filteredHerbs = herbs
    .filter(herb => {
      // Only show pending and published herbs
      if (herb.status !== 'pending' && herb.status !== 'published') {
        return false;
      }
      
      // Filter by status
      if (statusFilter !== 'all' && herb.status !== statusFilter) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (herb.name?.toLowerCase() || '').includes(query) ||
          (herb.scientificName?.toLowerCase() || '').includes(query) ||
          (herb.description?.toLowerCase() || '').includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      
      switch (sortBy) {
        case 'oldest':
          return dateA - dateB;
        case 'name-asc':
          return nameA.localeCompare(nameB);
        case 'name-desc':
          return nameB.localeCompare(nameA);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'newest':
        default:
          return dateB - dateA;
      }
    });

  const pendingHerbs = filteredHerbs.filter(herb => herb.status === 'pending');
  const publishedHerbs = filteredHerbs.filter(herb => herb.status === 'published');

  const handleAddHerb = async (newHerbData) => {
    try {
      setActionError(null);
      console.log('🆕 New herb added from modal:', newHerbData);
      
      // Close modal first
      setIsAddModalOpen(false);
      
      // Show success message
      alert('✅ Herb added successfully!');
      
      // Refresh to get the latest data including the new herb
      await fetchHerbs();
      
      console.log('🔄 Herbs list refreshed after adding new herb');
    } catch (err) {
      console.error('❌ Error in handleAddHerb:', err);
      setActionError(err.message || 'Failed to add herb. Please try again.');
      alert(`Failed to add herb: ${err.message}`);
    }
  };

  const handleEditHerb = async (updatedHerb) => {
    try {
      setActionError(null);
      setUpdateSuccess(false);
      
      console.log('========== EDIT HERB DEBUG ==========');
      console.log('1. Received updatedHerb from modal:', updatedHerb);
      console.log('2. New status from modal:', updatedHerb.status);
      console.log('3. Herb ID:', updatedHerb.id);
      
      const { id, ...herbData } = updatedHerb;
      const oldHerb = herbs.find(h => h.id === id);
      console.log('6. Status change:', oldHerb?.status, '→', updatedHerb.status);
      
      // ✅ Use the correct endpoint based on what changed
      if (updatedHerb.status !== oldHerb?.status) {
        // Only status changed - use PATCH endpoint
        console.log('📝 Only status changed, using PATCH endpoint');
        await herbApi.updateHerbStatus(id, updatedHerb.status);
      } else {
        // Multiple fields changed - use PUT endpoint
        console.log('📝 Multiple fields changed, using PUT endpoint');
        await herbApi.updateHerb(id, herbData);
      }
      
      // ✅ CRITICAL: ALWAYS refetch after update to ensure consistency
      await fetchHerbs();
      
      setUpdateSuccess(true);
      setIsEditModalOpen(false);
      setSelectedHerb(null);
      
      if (updatedHerb.status === 'published' && oldHerb?.status === 'pending') {
        alert('✅ Herb published successfully! It is now visible to all users.');
      } else {
        alert('✅ Herb updated successfully!');
      }
      
      console.log('========== END DEBUG ==========');
      
    } catch (err) {
      console.error('❌ Error updating herb:', err);
      setActionError(err.message || 'Failed to update herb. Please try again.');
      alert(`Failed to update herb: ${err.message}`);
    }
  };

  const handleViewHerb = (herb) => {
    setSelectedHerb(herb);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (herb) => {
    setSelectedHerb(herb);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (herb) => {
    // Only allow delete if user is admin
    if (!isAdmin) {
      alert('⚠️ Only administrators can delete herbs. Please contact your system administrator.');
      return;
    }
    setSelectedHerb(herb);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedHerb) {
      try {
        setActionError(null);
        console.log('Deleting herb:', selectedHerb.id);
        
        await herbApi.deleteHerb(selectedHerb.id);
        
        // Remove from local state
        setHerbs(prevHerbs => prevHerbs.filter(herb => herb.id !== selectedHerb.id));
        
        setIsDeleteModalOpen(false);
        setSelectedHerb(null);
        alert('✅ Herb deleted successfully!');
      } catch (err) {
        console.error('❌ Error deleting herb:', err);
        alert(`Failed to delete herb: ${err.message}`);
      }
    }
  };

  const handleDuplicateHerb = async (herb) => {
    try {
      setActionError(null);
      // Remove id and timestamps for duplication
      const { id, createdAt, updatedAt, ...herbData } = herb;
      
      const duplicatedHerb = {
        ...herbData,
        name: `${herb.name} (Copy)`,
        status: 'pending'  // Always pending when duplicated
      };
      
      console.log('Duplicating herb:', duplicatedHerb);
      await herbApi.createHerb(duplicatedHerb);
      await fetchHerbs(); // Refresh the list
      alert('✅ Herb duplicated successfully!');
    } catch (err) {
      console.error('Error duplicating herb:', err);
      alert(`Failed to duplicate herb: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    fetchHerbs();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(herbs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `herbisense_herbs_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setIsExportMenuOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID', 'Name', 'Scientific Name', 'Description', 'Preparation',
      'Safety Warning', 'Status', 'Image URL', 'Created At', 'Updated At'
    ].join(',');

    const rows = herbs.map(herb => [
      herb.id || '',
      `"${(herb.name || '').replace(/"/g, '""')}"`,
      `"${(herb.scientificName || '').replace(/"/g, '""')}"`,
      `"${(herb.description || '').replace(/"/g, '""')}"`,
      `"${(herb.preparation || '').replace(/"/g, '""')}"`,
      `"${(herb.safetyWarning || '').replace(/"/g, '""')}"`,
      herb.status || '',
      herb.imageUrl || '',
      herb.createdAt ? new Date(herb.createdAt).toLocaleDateString() : '',
      herb.updatedAt ? new Date(herb.updatedAt).toLocaleDateString() : ''
    ].join(','));

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `herbisense_herbs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  useEffect(() => {
    if (herbs.length > 0) {
      console.log('🌿 Current herbs state:', {
        total: herbs.length,
        published: herbs.filter(h => h.status === 'published').length,
        pending: herbs.filter(h => h.status === 'pending').length,
        withImages: herbs.filter(h => h.imageUrl).length
      });
    }
  }, [herbs]);

  if (loading && herbs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading herbs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Herbs</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="primary" onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Herbs Management</h1>
          <p className="mt-1 text-gray-600">
            {filteredHerbs.length} {filteredHerbs.length === 1 ? 'herb' : 'herbs'} found • {herbs.length} total
            <span className="ml-2 text-sm">
              <span className="text-emerald-600 font-medium">{herbs.filter(h => h.status === 'published').length} published</span>
              {' · '}
              <span className="text-amber-600 font-medium">{herbs.filter(h => h.status === 'pending').length} pending</span>
              {'  '}
              {/* <span className="text-blue-600 font-medium">{herbs.filter(h => h.imageUrl).length} with images</span> */}
            </span>
            {!isAdmin && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                Creator Mode
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* <Button 
            variant="outline" 
            icon={ArrowPathIcon}
            onClick={handleRefresh}
            title="Refresh herbs"
          >
            Refresh
          </Button> */}
          
          {/* Export Dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              icon={DocumentArrowDownIcon}
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              title="Export data"
            >
              Export
            </Button>
            
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Export Options
                  </div>
                  
                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    <div className="text-left">
                      <span className="font-medium">JSON Format</span>
                      <p className="text-xs text-gray-500">Export all herb data as JSON</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <TableCellsIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    <div className="text-left">
                      <span className="font-medium">CSV Format</span>
                      <p className="text-xs text-gray-500">Export as spreadsheet format</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button 
            variant="primary" 
            icon={PlusIcon}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Herb
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search herbs by local name or scientific name..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="flex items-center space-x-3">
          <FilterBar
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="min-w-[150px]"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-emerald-50 text-emerald-600 border-r border-gray-300'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              title="Grid view"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              title="List view"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredHerbs.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 5V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No herbs found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by adding your first herb'}
            </p>
            <Button variant="primary" icon={PlusIcon} onClick={() => setIsAddModalOpen(true)}>
              Add New Herb
            </Button>
          </div>
        </div>
      )}

      {/* Herbs Display */}
      {filteredHerbs.length > 0 && (
        <>
          {statusFilter === 'all' ? (
            <div className="space-y-8">
              {pendingHerbs.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-amber-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Pending Review ({pendingHerbs.length})</h2>
                  </div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {pendingHerbs.map((herb) => (
                        <HerbCard 
                          key={herb.id} 
                          herb={herb} 
                          viewMode={viewMode}
                          onEdit={handleEditClick}
                          onView={handleViewHerb}
                          onDelete={handleDeleteClick}
                          onDuplicate={handleDuplicateHerb}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingHerbs.map((herb) => (
                        <HerbCard 
                          key={herb.id} 
                          herb={herb} 
                          viewMode={viewMode}
                          onEdit={handleEditClick}
                          onView={handleViewHerb}
                          onDelete={handleDeleteClick}
                          onDuplicate={handleDuplicateHerb}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {publishedHerbs.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Published ({publishedHerbs.length})</h2>
                  </div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {publishedHerbs.map((herb) => (
                        <HerbCard 
                          key={herb.id} 
                          herb={herb} 
                          viewMode={viewMode}
                          onEdit={handleEditClick}
                          onView={handleViewHerb}
                          onDelete={handleDeleteClick}
                          onDuplicate={handleDuplicateHerb}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {publishedHerbs.map((herb) => (
                        <HerbCard 
                          key={herb.id} 
                          herb={herb} 
                          viewMode={viewMode}
                          onEdit={handleEditClick}
                          onView={handleViewHerb}
                          onDelete={handleDeleteClick}
                          onDuplicate={handleDuplicateHerb}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredHerbs.map((herb) => (
                  <HerbCard 
                    key={herb.id} 
                    herb={herb} 
                    viewMode={viewMode}
                    onEdit={handleEditClick}
                    onView={handleViewHerb}
                    onDelete={handleDeleteClick}
                    onDuplicate={handleDuplicateHerb}
                    isAdmin={isAdmin}
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
                    onEdit={handleEditClick}
                    onView={handleViewHerb}
                    onDelete={handleDeleteClick}
                    onDuplicate={handleDuplicateHerb}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* Modals */}
      <AddHerbModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddHerb}
      />

      <EditHerbModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHerb(null);
        }}
        onSave={handleEditHerb}
        herb={selectedHerb}
      />

      <ViewHerbModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedHerb(null);
        }}
        herb={selectedHerb}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedHerb(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedHerb?.name || 'this herb'}
        itemType="herb"
      />

      <style jsx global>{`
        .dashboard-blur {
          filter: blur(8px);
          pointer-events: none;
          transition: filter 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HerbsManagement;