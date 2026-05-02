// components/Table.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiFilter,
  FiSearch,
  FiX,
} from "react-icons/fi";
import Loader from "../Loader/Loader";

const PAGE_SIZE = 10;

const Table = ({
  // Controller props
  data = [],
  pagination = {},
  isLoading = false,
  mode = "normal",
  hasPrevious = false,
  hasNext = false,
  currentPage = 0,
  searchTerm = "",
  filters = {},
  
  // Actions
  onNextPage,
  onPrevPage,
  onApplyFilters,
  onClearFilters,
  onSearchChange,
  
  // UI Config
  columns,
  path,
  searchConfig = {},
  filtersConfig = [],
  filterLabels = {},
  ledger,
}) => {
  const navigate = useNavigate();
  
  // Local UI state
  const [showFilter, setShowFilter] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedTerm.length >= 2 || debouncedTerm.length === 0) {
        onSearchChange?.(debouncedTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedTerm, onSearchChange]);

  useEffect(() => {
    setLocalFilters(filters);
    setFiltersChanged(false);
  }, [filters]);

  useEffect(() => {
    if (searchTerm !== debouncedTerm) {
      setDebouncedTerm(searchTerm);
    }
  }, [searchTerm]);

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      if (value === "" || value === "All") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
    setFiltersChanged(true);
  };

  const handleApplyLocalFilters = () => {
    const cleanedFilters = { ...localFilters };
    Object.keys(cleanedFilters).forEach((key) => {
      if (cleanedFilters[key] === "" || cleanedFilters[key] === "All") {
        delete cleanedFilters[key];
      }
    });
    onApplyFilters?.(cleanedFilters);
    setShowFilter(false);
    setFiltersChanged(false);
  };

  const handleClearAllFilters = () => {
    setLocalFilters({});
    setFiltersChanged(true);
  };

  const handleCancelFilters = () => {
    setLocalFilters(filters);
    setShowFilter(false);
    setFiltersChanged(false);
  };

  const cleanedActiveFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== "" && value !== "All" && value != null) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );

  const hasActiveFilters = Object.keys(cleanedActiveFilters).length > 0;

  const capitalize = (str = "") => {
    if (typeof str !== "string") return "";
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Table setup
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const getRecordRange = () => {
    if (!data?.length) return null;
    const start = currentPage * PAGE_SIZE + 1;
    const end = start + data.length - 1;
    return { start, end };
  };

  const range = getRecordRange();

  const handleRowClick = (id) => {
    navigate(ledger ? `/ledger/${path}/${id}` : `/${path}/${id}`);
  };

  return (
    <div className="mt-5 max-w-[1050px] m-auto flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-64 z-1">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder={searchConfig.placeholder || "Search records... (min. 2 characters)"}
            value={debouncedTerm}
            onChange={(e) => setDebouncedTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-[12px]"
          />
          {debouncedTerm.length === 1 && (
            <p className="text-xs text-amber-600 mt-1 absolute">
              Type at least 2 characters to search
            </p>
          )}
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(cleanedActiveFilters).map(([key, value]) => {
                let displayValue = value;
                if ((key === "fromDate" || key === "toDate") && value) {
                  displayValue = new Date(value).toLocaleDateString("en-GB");
                } else {
                  displayValue = value
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ");
                }
                return (
                  <span key={key} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {filterLabels[key] || key}: {displayValue}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key];
                        onApplyFilters?.(newFilters);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {filtersConfig.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 ${
                  hasActiveFilters
                    ? "text-blue-600 bg-blue-50 border-blue-200"
                    : "text-gray-700 bg-white"
                }`}
              >
                <FiFilter /> Filter
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {Object.keys(cleanedActiveFilters).length}
                  </span>
                )}
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Filter Options</h3>
                    {hasActiveFilters && (
                      <button onClick={handleClearAllFilters} className="text-xs text-red-600 hover:text-red-800">
                        Clear All
                      </button>
                    )}
                  </div>

                  {filtersConfig.map((filter) => (
                    <div key={filter.key} className="mb-3">
                      <label className="block text-xs text-gray-500 mb-1">{filter.label}</label>
                      {filter.type === "select" ? (
                        <select
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                          value={localFilters[filter.key] || ""}
                          onChange={(e) => handleLocalFilterChange(filter.key, e.target.value)}
                        >
                          <option value="">All</option>
                          {filter.options?.map((opt) => (
                            <option key={opt} value={opt}>{capitalize(opt)}</option>
                          ))}
                        </select>
                      ) : filter.type === "date" ? (
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                          value={localFilters[filter.key] || ""}
                          onChange={(e) => handleLocalFilterChange(filter.key, e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={filter.placeholder || ""}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                          value={localFilters[filter.key] || ""}
                          onChange={(e) => handleLocalFilterChange(filter.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end gap-2">
                    <button onClick={handleCancelFilters} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyLocalFilters}
                      disabled={!filtersChanged}
                      className={`px-4 py-1.5 text-sm text-white rounded-lg ${
                        filtersChanged ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-500">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row.original.id)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="h-[50vh]">
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.length > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing {range ? `${range.start}–${range.end}` : `0–${data.length}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={onPrevPage} disabled={!hasPrevious} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiChevronsLeft size={16} />
                </button>
                <button onClick={onPrevPage} disabled={!hasPrevious} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700 px-2">Page {currentPage + 1}</span>
                <button onClick={onNextPage} disabled={!hasNext} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiChevronRight size={16} />
                </button>
                <button onClick={onNextPage} disabled={!hasNext} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Mode Indicator */}
          {(mode === "search" || mode === "filter") && data.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-blue-50">
              <p className="text-sm text-blue-700">
                {mode === "search" ? "Search" : "Filter"} results:{" "}
                <span className="font-medium">{data.length}</span> records found
                {mode === "search" && searchTerm && searchTerm.length >= 2 && (
                  <span> for "<span className="font-medium">{searchTerm}</span>"</span>
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Table;