import { useState, useCallback } from 'react';

/**
 * Reusable hook to manage page states, limit counts, total pages, and navigation helpers.
 */
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((pageNumber) => {
    const target = Math.max(1, Math.min(pageNumber, totalPages));
    setPage(target);
  }, [totalPages]);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    limit,
    totalPages,
    totalItems,
    setPage,
    setLimit,
    setTotalPages,
    setTotalItems,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
  };
};

export default usePagination;
