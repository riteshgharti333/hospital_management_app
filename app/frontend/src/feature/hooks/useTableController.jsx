// hooks/useTableController.js
import { useState, useEffect } from "react";

export const useTableController = ({
  normalDataHook,
  searchDataHook,
  filterDataHook,
}) => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");
  const [cursor, setCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);

  // Fetch data based on mode
  const normalData = normalDataHook(mode === "normal" ? cursor : null);
  const searchData = searchDataHook(
    mode === "search" ? searchTerm : null,
    mode === "search" ? cursor : null
  );
  const filterData = filterDataHook(
    mode === "filter" ? filters : null,
    mode === "filter" ? cursor : null
  );

  // Get current data
  const getCurrentData = () => {
    switch (mode) {
      case "search": return searchData;
      case "filter": return filterData;
      default: return normalData;
    }
  };

  const { data: response = { data: [], pagination: {} }, isLoading } = getCurrentData();
  const currentData = response?.data || [];
  const pagination = response?.pagination || {};

  // Mode switching
  useEffect(() => {
    if (searchTerm) {
      setMode("search");
      setCursor(null);
      setCursorHistory([]);
    } else if (Object.keys(filters).length > 0) {
      setMode("filter");
      setCursor(null);
      setCursorHistory([]);
    } else {
      setMode("normal");
      setCursor(null);
      setCursorHistory([]);
    }
  }, [searchTerm, filters]);

  // Actions
  const handleNextPage = () => {
    if (pagination?.nextCursor && pagination?.hasMore) {
      setCursorHistory([...cursorHistory, cursor]);
      setCursor(pagination.nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const previousCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory(cursorHistory.slice(0, -1));
      setCursor(previousCursor);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Return controller data and actions
  return {
    // Data
    data: currentData,
    pagination,
    isLoading,
    mode,
    
    // Pagination state
    hasPrevious: cursorHistory.length > 0,
    hasNext: pagination?.hasMore === true && pagination?.nextCursor !== null,
    currentPage: cursorHistory.length,
    
    // Actions
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onApplyFilters: handleApplyFilters,
    onClearFilters: handleClearFilters,
    onSearchChange: handleSearchChange,
    
    // Form states
    searchTerm,
    filters,
  };
};