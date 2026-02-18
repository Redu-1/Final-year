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
  FunnelIcon, 
  ArrowPathIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Initial herbs data with categories and skin conditions
const initialHerbs = [
  {
    id: 1,
    commonName: 'Aloe vera',
    scientificName: 'Aloe barbadensis miller',
    partsUsed: 'LEAVES',
    indigenousRegion: 'Various',
    status: 'published',
    description: 'Soothing gel for burns and skin conditions',
    medicinalUses: 'Treats burns, wounds, and skin irritations. Provides deep hydration and soothes sunburns.',
    contraindications: 'Oral use may cause abdominal cramps. Not recommended during pregnancy.',
    dosage: 'Apply gel topically 2-3 times daily',
    preparation: 'Extract gel from fresh leaves or use cold-pressed gel',
    storageInstructions: 'Store fresh gel in refrigerator for up to 1 week',
    imageUrl: '',
    skinConditions: ['dry-skin', 'itching', 'cuts', 'irritations'],
    categories: ['succulents', 'healing', 'medicinal'],
    lastUpdated: '2 days ago',
    createdAt: new Date('2024-01-01').toISOString(),
    addedBy: 'Admin'
  },
  {
    id: 2,
    commonName: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    partsUsed: 'ROOTS',
    indigenousRegion: 'India, Middle East',
    status: 'published',
    description: 'Adaptogen for stress and vitality',
    medicinalUses: 'Reduces stress and anxiety, improves energy levels, enhances cognitive function',
    contraindications: 'Avoid during pregnancy. May interact with thyroid medications.',
    dosage: '300-500mg extract daily',
    preparation: 'Root powder mixed with warm milk or water',
    storageInstructions: 'Store in cool, dry place away from sunlight',
    imageUrl: '',
    skinConditions: [],
    categories: ['medicinal', 'healing'],
    lastUpdated: '1 week ago',
    createdAt: new Date('2024-01-02').toISOString(),
    addedBy: 'Admin'
  },
  {
    id: 3,
    commonName: 'Kava Kava',
    scientificName: 'Piper methysticum',
    partsUsed: 'ROOTS',
    indigenousRegion: 'Pacific Islands',
    status: 'draft',
    description: 'Anxiolytic and relaxant',
    medicinalUses: 'Reduces anxiety, promotes relaxation, improves sleep quality',
    contraindications: 'Potential liver toxicity. Avoid with alcohol. Not for long-term use.',
    dosage: '150-300mg extract',
    preparation: 'Traditional beverage or standardized extract',
    storageInstructions: 'Store in sealed container away from light',
    imageUrl: '',
    skinConditions: ['pain'],
    categories: ['medicinal', 'healing'],
    lastUpdated: '3 days ago',
    createdAt: new Date('2024-01-03').toISOString(),
    addedBy: 'Admin'
  },
  {
    id: 4,
    commonName: 'Rooibos',
    scientificName: 'Aspalathus linearis',
    partsUsed: 'SHRUB/LEAVES',
    indigenousRegion: 'South Africa',
    status: 'published',
    description: 'Antioxidant-rich herbal tea',
    medicinalUses: 'Rich in antioxidants, supports digestion, may improve bone health',
    contraindications: 'Generally safe, minimal contraindications',
    dosage: '1-2 cups tea daily',
    preparation: 'Steep leaves in hot water for 5-7 minutes',
    storageInstructions: 'Store in airtight container in cool, dry place',
    imageUrl: '',
    skinConditions: ['inflammation', 'aging'],
    categories: ['spices', 'aromatic'],
    lastUpdated: '1 month ago',
    createdAt: new Date('2024-01-04').toISOString(),
    addedBy: 'Admin'
  }
];

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
  
  // Load herbs from localStorage on initial render
  const [herbs, setHerbs] = useState(() => {
    const savedHerbs = localStorage.getItem('herbiSense_herbs');
    if (savedHerbs) {
      return JSON.parse(savedHerbs);
    }
    return initialHerbs;
  });

  // Save herbs to localStorage whenever herbs change
  useEffect(() => {
    localStorage.setItem('herbiSense_herbs', JSON.stringify(herbs));
  }, [herbs]);

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

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Review' }
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
      // Status filter
      if (statusFilter !== 'all' && herb.status !== statusFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          herb.commonName.toLowerCase().includes(query) ||
          herb.scientificName.toLowerCase().includes(query) ||
          herb.indigenousRegion.toLowerCase().includes(query) ||
          herb.categories?.some(cat => cat.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.commonName.localeCompare(b.commonName);
        case 'name-desc':
          return b.commonName.localeCompare(a.commonName);
        case 'status':
          return a.status.localeCompare(b.status);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleAddHerb = (newHerbData) => {
    const newId = herbs.length > 0 ? Math.max(...herbs.map(h => h.id)) + 1 : 1;
    const now = new Date();
    
    const newHerb = {
      id: newId,
      ...newHerbData,
      lastUpdated: 'Just now',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      addedBy: 'Current User'
    };
    
    setHerbs(prev => [newHerb, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleEditHerb = (updatedHerb) => {
    setHerbs(prev => prev.map(herb => 
      herb.id === updatedHerb.id 
        ? { 
            ...herb, 
            ...updatedHerb, 
            updatedAt: new Date().toISOString(),
            lastUpdated: 'Just now'
          }
        : herb
    ));
    setIsEditModalOpen(false);
    setSelectedHerb(null);
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
    setSelectedHerb(herb);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedHerb) {
      setHerbs(prev => prev.filter(herb => herb.id !== selectedHerb.id));
      setIsDeleteModalOpen(false);
      setSelectedHerb(null);
    }
  };

  const handleDuplicateHerb = (herb) => {
    const newId = herbs.length > 0 ? Math.max(...herbs.map(h => h.id)) + 1 : 1;
    const now = new Date();
    
    const duplicatedHerb = {
      ...herb,
      id: newId,
      commonName: `${herb.commonName} (Copy)`,
      status: 'draft',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      lastUpdated: 'Just now',
      addedBy: 'Current User'
    };
    
    setHerbs(prev => [duplicatedHerb, ...prev]);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all herbs to initial data? This will remove any custom herbs you added.')) {
      localStorage.removeItem('herbiSense_herbs');
      setHerbs(initialHerbs);
    }
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

  const handleExportPDF = (exportType = 'all') => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 0);
    doc.text('HerbiSense - Herbs Catalog', 14, 15);
    
    // Add subtitle with date
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generated on: ${dateStr}`, 14, 22);
    
    // Add filter information if applicable
    let yPosition = 30;
    if (statusFilter !== 'all' || searchQuery) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      let filterText = 'Filters: ';
      if (statusFilter !== 'all') filterText += `Status: ${statusFilter} `;
      if (searchQuery) filterText += `Search: "${searchQuery}" `;
      doc.text(filterText, 14, yPosition);
      yPosition += 7;
    }

    // Prepare data for the table
    let herbsToExport = exportType === 'filtered' ? filteredHerbs : herbs;
    
    // Create table headers
    const headers = [
      [
        'ID',
        'Common Name',
        'Scientific Name',
        'Parts Used',
        'Region',
        'Status',
        'Categories',
        'Skin Conditions',
        'Dosage',
        'Last Updated'
      ]
    ];

    // Create table data
    const data = herbsToExport.map(herb => [
      herb.id.toString(),
      herb.commonName,
      herb.scientificName,
      herb.partsUsed.replace('_', ' '),
      herb.indigenousRegion,
      herb.status.charAt(0).toUpperCase() + herb.status.slice(1),
      herb.categories?.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') || 'N/A',
      herb.skinConditions?.map(c => c.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')).join(', ') || 'None',
      herb.dosage || 'N/A',
      herb.lastUpdated || new Date(herb.updatedAt || herb.createdAt).toLocaleDateString()
    ]);

    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: yPosition,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [240, 253, 244]
      },
      columnStyles: {
        0: { cellWidth: 10 }, // ID
        1: { cellWidth: 30 }, // Common Name
        2: { cellWidth: 35 }, // Scientific Name
        3: { cellWidth: 20 }, // Parts Used
        4: { cellWidth: 25 }, // Region
        5: { cellWidth: 15 }, // Status
        6: { cellWidth: 35 }, // Categories
        7: { cellWidth: 40 }, // Skin Conditions
        8: { cellWidth: 25 }, // Dosage
        9: { cellWidth: 20 }, // Last Updated
      },
      didDrawPage: (data) => {
        // Add footer with page number
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
        
        // Add total count
        doc.text(
          `Total Herbs: ${herbsToExport.length}`,
          14,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // Save PDF
    const fileName = `herbisense_herbs_${exportType}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    setIsExportMenuOpen(false);
  };

  const handleExportDetailedPDF = (herb) => {
    if (!herb) return;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add header
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(herb.commonName, 20, 18);
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(herb.scientificName, 20, 25);

    // Add content
    let yPosition = 45;
    const lineHeight = 8;
    const leftMargin = 20;
    const rightColumn = 110;

    // Helper function to add section
    const addSection = (title, content, x, y, isBold = true) => {
      doc.setFontSize(11);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
      }
      doc.text(title, x, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      const lines = doc.splitTextToSize(content || 'N/A', 80);
      doc.text(lines, x, y + 5);
      
      return y + 15 + (lines.length * 4);
    };

    // Basic Information
    yPosition = addSection('Basic Information', '', leftMargin, yPosition);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    doc.text(`Parts Used: ${herb.partsUsed?.replace('_', ' ') || 'N/A'}`, leftMargin + 5, yPosition);
    doc.text(`Region: ${herb.indigenousRegion || 'N/A'}`, leftMargin + 5, yPosition + 5);
    doc.text(`Status: ${herb.status?.charAt(0).toUpperCase() + herb.status?.slice(1) || 'N/A'}`, leftMargin + 5, yPosition + 10);
    doc.text(`Added By: ${herb.addedBy || 'System'}`, leftMargin + 5, yPosition + 15);
    yPosition += 25;

    // Description
    yPosition = addSection('Description', herb.description || 'No description provided', leftMargin, yPosition);
    yPosition += 10;

    // Medicinal Uses
    if (herb.medicinalUses) {
      yPosition = addSection('Medicinal Uses', herb.medicinalUses, leftMargin, yPosition);
      yPosition += 10;
    }

    // Contraindications
    if (herb.contraindications) {
      yPosition = addSection('Contraindications', herb.contraindications, leftMargin, yPosition);
      yPosition += 10;
    }

    // Right Column - Categories and Skin Conditions
    let rightY = 45;
    
    // Categories
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Categories', rightColumn, rightY);
    rightY += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    if (herb.categories?.length > 0) {
      herb.categories.forEach((cat, index) => {
        doc.text(`• ${cat.charAt(0).toUpperCase() + cat.slice(1)}`, rightColumn + 5, rightY + (index * 5));
      });
      rightY += herb.categories.length * 5 + 10;
    } else {
      doc.text('No categories', rightColumn + 5, rightY);
      rightY += 15;
    }

    // Skin Conditions
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Skin Conditions Treated', rightColumn, rightY);
    rightY += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    if (herb.skinConditions?.length > 0) {
      herb.skinConditions.forEach((condition, index) => {
        const formattedCondition = condition.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        doc.text(`• ${formattedCondition}`, rightColumn + 5, rightY + (index * 5));
      });
      rightY += herb.skinConditions.length * 5 + 10;
    } else {
      doc.text('No skin conditions', rightColumn + 5, rightY);
      rightY += 15;
    }

    // Dosage
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Dosage', rightColumn, rightY);
    rightY += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(herb.dosage || 'No dosage information', rightColumn + 5, rightY);
    rightY += 15;

    // Preparation
    if (herb.preparation) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('Preparation', rightColumn, rightY);
      rightY += 5;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const prepLines = doc.splitTextToSize(herb.preparation, 80);
      doc.text(prepLines, rightColumn + 5, rightY);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footerText = `Generated from HerbiSense on ${dateStr} • Herb ID: ${herb.id}`;
    doc.text(footerText, leftMargin, doc.internal.pageSize.height - 10);

    // Save PDF
    const fileName = `herbisense_${herb.commonName.toLowerCase().replace(/\s+/g, '_')}_details.pdf`;
    doc.save(fileName);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Common Name',
      'Scientific Name',
      'Parts Used',
      'Indigenous Region',
      'Status',
      'Description',
      'Medicinal Uses',
      'Contraindications',
      'Dosage',
      'Preparation',
      'Storage Instructions',
      'Categories',
      'Skin Conditions',
      'Created At',
      'Added By'
    ].join(',');

    const rows = herbs.map(herb => [
      herb.id,
      `"${herb.commonName}"`,
      `"${herb.scientificName}"`,
      herb.partsUsed,
      `"${herb.indigenousRegion}"`,
      herb.status,
      `"${herb.description?.replace(/"/g, '""') || ''}"`,
      `"${herb.medicinalUses?.replace(/"/g, '""') || ''}"`,
      `"${herb.contraindications?.replace(/"/g, '""') || ''}"`,
      `"${herb.dosage?.replace(/"/g, '""') || ''}"`,
      `"${herb.preparation?.replace(/"/g, '""') || ''}"`,
      `"${herb.storageInstructions?.replace(/"/g, '""') || ''}"`,
      `"${herb.categories?.join('; ') || ''}"`,
      `"${herb.skinConditions?.join('; ') || ''}"`,
      new Date(herb.createdAt).toLocaleDateString(),
      herb.addedBy || 'System'
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

  return (
    <div className="dashboard-container space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Herbs Management</h1>
          <p className="mt-1 text-gray-600">
            {filteredHerbs.length} {filteredHerbs.length === 1 ? 'herb' : 'herbs'} found • {herbs.length} total
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/*  */}
          <Button 
            variant="outline" 
            icon={ArrowPathIcon}
            onClick={handleResetData}
            title="Reset to initial data"
          >
            Reset
          </Button>
          
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
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {/* <button
                    onClick={() => handleExportPDF('all')}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    <div className="text-left">
                      <span className="font-medium"></span>
                      <p className="text-xs text-gray-500"></p>
                    </div>
                  </button> */}
                  
                  {/* <button
                    onClick={() => handleExportPDF('filtered')}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    <div className="text-left">
                      <span className="font-medium"></span>
                      <p className="text-xs text-gray-500">Only currently filtered herbs</p>
                    </div>
                  </button> */}
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
            placeholder="Search herbs by name, scientific name, region, or category..."
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
      {filteredHerbs.length === 0 && (
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

      {/* Herbs Grid/List */}
      {filteredHerbs.length > 0 && (
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
                onExportPDF={handleExportDetailedPDF}
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
                onExportPDF={handleExportDetailedPDF}
              />
            ))}
          </div>
        )
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
        itemName={selectedHerb?.commonName || 'this herb'}
        itemType="herb"
      />

      {/* Global styles for blur effect */}
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