import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for sorting data
 * @param {Array} data - The data to sort
 * @param {string} defaultSortKey - Default key to sort by
 * @param {string} defaultSortOrder - Default sort order ('asc' or 'desc')
 * @returns {Object} - Sort state and functions
 */
const useSort = (data = [], defaultSortKey = null, defaultSortOrder = 'asc') => {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  // Toggle sort order for the same key or set new key with 'asc' order
  const toggleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }, [sortKey]);

  // Reset sorting to default
  const resetSort = useCallback(() => {
    setSortKey(defaultSortKey);
    setSortOrder(defaultSortOrder);
  }, [defaultSortKey, defaultSortOrder]);

  // Sort data based on current sort key and order
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      // Handle null or undefined values
      if (valueA === null || valueA === undefined) return sortOrder === 'asc' ? -1 : 1;
      if (valueB === null || valueB === undefined) return sortOrder === 'asc' ? 1 : -1;

      // Handle different data types
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        return sortOrder === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      // Convert to string for other types
      const strA = String(valueA);
      const strB = String(valueB);

      return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [data, sortKey, sortOrder]);

  return {
    sortKey,
    sortOrder,
    sortedData,
    toggleSort,
    resetSort,
  };
};

export default useSort;