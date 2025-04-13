import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for pagination
 * @param {Array} data - The data to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} - Pagination state and functions
 */
const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize]);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Go to next page
  const nextPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  }, [totalPages]);

  // Go to previous page
  const prevPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  // Go to specific page
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  // Change page size
  const changePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  return {
    currentPage,
    pageSize,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
  };
};

export default usePagination;