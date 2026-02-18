// src/hooks/useTable.js
import { useState, useMemo, useCallback } from 'react';

export const useTable = (initialData = [], options = {}) => {
  const {
    initialSortBy = null,
    initialSortDirection = 'asc',
    initialPageSize = 10,
    initialPage = 1
  } = options;

  const [data, setData] = useState(initialData);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortBy) return data;
    
    return [...data].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle nested properties
      if (sortBy.includes('.')) {
        const keys = sortBy.split('.');
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      }
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortBy, sortDirection]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = sortedData;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        // Search in all string fields
        return Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          return false;
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          const itemValue = item[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    return result;
  }, [sortedData, searchQuery, filters]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / pageSize);
  }, [filteredData.length, pageSize]);

  // Handle sort
  const handleSort = useCallback((column) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  }, [sortBy]);

  // Handle row selection
  const handleSelectRow = useCallback((id) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      const ids = paginatedData.map(item => item.id).filter(Boolean);
      setSelectedRows(new Set(ids));
    }
  }, [paginatedData, selectedRows.size]);

  // Handle pagination
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  // Update data
  const updateData = useCallback((newData) => {
    setData(newData);
    setCurrentPage(1);
    setSelectedRows(new Set());
  }, []);

  // Add row
  const addRow = useCallback((row) => {
    setData(prev => [row, ...prev]);
  }, []);

  // Update row
  const updateRow = useCallback((id, updates) => {
    setData(prev => 
      prev.map(row => 
        row.id === id ? { ...row, ...updates } : row
      )
    );
  }, []);

  // Delete row
  const deleteRow = useCallback((id) => {
    setData(prev => prev.filter(row => row.id !== id));
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  }, []);

  // Delete selected rows
  const deleteSelectedRows = useCallback(() => {
    setData(prev => prev.filter(row => !selectedRows.has(row.id)));
    setSelectedRows(new Set());
  }, [selectedRows]);

  return {
    // State
    data,
    sortedData,
    filteredData,
    paginatedData,
    sortBy,
    sortDirection,
    selectedRows,
    currentPage,
    pageSize,
    totalPages,
    searchQuery,
    filters,
    allSelected: selectedRows.size === paginatedData.length && paginatedData.length > 0,
    
    // Actions
    setData,
    setSortBy,
    setSortDirection,
    setSelectedRows,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    setFilters,
    
    // Handlers
    handleSort,
    handleSelectRow,
    handleSelectAll,
    goToPage,
    goToNextPage,
    goToPrevPage,
    handleFilterChange,
    
    // Utilities
    clearFilters,
    clearSelection,
    updateData,
    addRow,
    updateRow,
    deleteRow,
    deleteSelectedRows,
    
    // Helper functions
    getRowCounts: () => ({
      total: data.length,
      filtered: filteredData.length,
      showing: paginatedData.length,
      selected: selectedRows.size
    }),
    
    getPaginationInfo: () => ({
      start: (currentPage - 1) * pageSize + 1,
      end: Math.min(currentPage * pageSize, filteredData.length),
      total: filteredData.length
    })
  };
};