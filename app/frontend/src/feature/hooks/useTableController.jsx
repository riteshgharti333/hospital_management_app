import { useState, useEffect, useCallback } from "react";

export const useTableController = ({
  normalDataHook,
  searchDataHook,
  filterDataHook,
  entityType = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");
  const [cursor, setCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);

  // =========================
  // Determine mode safely
  // =========================
  useEffect(() => {
    let newMode = "normal";

    if (searchTerm) {
      newMode = "search";
    } else if (Object.keys(filters).length > 0) {
      newMode = "filter";
    }

    if (newMode !== mode) {
      setMode(newMode);
      setCursor(null);
      setCursorHistory([]);
    }
  }, [searchTerm, filters, mode]);

  // =========================
  // Fetch data - ONLY call active hook, not all three
  // =========================
  const getHookArgs = (baseArgs) => {
    return entityType ? [entityType, ...baseArgs] : baseArgs;
  };

  // Only call the active hook to prevent unnecessary API calls
  const normalData = normalDataHook(
    ...getHookArgs(mode === "normal" ? [cursor] : [undefined])
  );
  
  const searchData = searchDataHook(
    ...getHookArgs(
      mode === "search" ? [searchTerm, cursor] : [undefined, undefined]
    )
  );
  
  const filterData = filterDataHook(
    ...getHookArgs(
      mode === "filter" ? [filters, cursor] : [undefined, undefined]
    )
  );

  // =========================
  // Select active dataset - extract data properly
  // =========================
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return searchData?.data; // ⬅️ Extract .data from query result
      case "filter":
        return filterData?.data; // ⬅️ Extract .data from query result
      default:
        return normalData?.data; // ⬅️ Extract .data from query result
    }
  };

  const response = getCurrentData() || { data: [], pagination: {} };
  const isLoading = 
    (mode === "normal" && normalData?.isLoading) ||
    (mode === "search" && searchData?.isLoading) ||
    (mode === "filter" && filterData?.isLoading);

  // Handle both regular structure and ledger-specific structure
  const currentData = response?.transactions || response?.data || [];
  const pagination = response?.pagination || {};
  const currentBalance = response?.currentBalance;

  // =========================
  // Pagination handlers
  // =========================
  const handleNextPage = useCallback(() => {
    if (pagination?.nextCursor && pagination?.hasMore) {
      setCursorHistory((prev) => [...prev, cursor]);
      setCursor(pagination.nextCursor);
    }
  }, [pagination, cursor]);

  const handlePrevPage = useCallback(() => {
    setCursorHistory((prev) => {
      if (prev.length === 0) return prev;
      const previousCursor = prev[prev.length - 1];
      setCursor(previousCursor);
      return prev.slice(0, -1);
    });
  }, []);

  // =========================
  // Filters
  // =========================
  const handleApplyFilters = useCallback((newFilters) => {
    setFilters((prev) => {
      const isSame = JSON.stringify(prev) === JSON.stringify(newFilters);
      return isSame ? prev : newFilters;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
  }, []);

  // =========================
  // Search
  // =========================
  const handleSearchChange = useCallback((term) => {
    setSearchTerm((prev) => (prev === term ? prev : term));
  }, []);

  // =========================
  // Return
  // =========================
  return {
    data: currentData,
    pagination,
    isLoading,
    mode,
    currentBalance,

    hasPrevious: cursorHistory.length > 0,
    hasNext: pagination?.hasMore === true && pagination?.nextCursor !== null,
    currentPage: cursorHistory.length,

    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onApplyFilters: handleApplyFilters,
    onClearFilters: handleClearFilters,
    onSearchChange: handleSearchChange,

    searchTerm,
    filters,
  };
};