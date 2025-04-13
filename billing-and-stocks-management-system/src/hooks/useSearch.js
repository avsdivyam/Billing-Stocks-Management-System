import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for searching and filtering data
 * @param {Array} data - The data to search
 * @param {Array} searchKeys - The keys to search in
 * @returns {Object} - Search state and functions
 */
const useSearch = (data = [], searchKeys = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Add or update a filter
  const addFilter = useCallback((key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  }, []);

  // Remove a filter
  const removeFilter = useCallback((key) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Clear search term
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Reset all search and filters
  const resetAll = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    // First apply filters
    let result = data;
    
    // Apply each filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter((item) => {
          // Handle array values (multi-select filters)
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          
          // Handle boolean values
          if (typeof value === 'boolean') {
            return item[key] === value;
          }
          
          // Handle date ranges
          if (value.start && value.end) {
            const itemDate = new Date(item[key]);
            return itemDate >= new Date(value.start) && itemDate <= new Date(value.end);
          }
          
          // Handle number ranges
          if (value.min !== undefined && value.max !== undefined) {
            return item[key] >= value.min && item[key] <= value.max;
          }
          
          // Handle string equality
          return String(item[key]) === String(value);
        });
      }
    });
    
    // Then apply search term if provided
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      
      result = result.filter((item) => {
        return searchKeys.some((key) => {
          const value = item[key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        });
      });
    }
    
    return result;
  }, [data, searchTerm, filters, searchKeys]);

  return {
    searchTerm,
    filters,
    filteredData,
    handleSearchChange,
    addFilter,
    removeFilter,
    clearFilters,
    clearSearch,
    resetAll,
  };
};

export default useSearch;