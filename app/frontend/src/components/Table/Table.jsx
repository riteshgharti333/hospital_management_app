import React, { useState } from "react";
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

const Table = ({
  data,
  columns,
  loading,
  path,
  searchConfig,
  filtersConfig = [],
  pagination,
  onNextPage,
  onPrevPage,
  onApplyFilters,
  onClearFilters,
  activeFilters = {},
  filterLabels = {},
}) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [localFilters, setLocalFilters] = useState(activeFilters);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleRowClick = (id) => {
    if (path) navigate(`/${path}/${id}`);
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters?.(localFilters);
    setShowFilter(false);
  };

  const handleClearAllFilters = () => {
    setLocalFilters({});
    onClearFilters?.();
    setShowFilter(false);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="mt-5 max-w-[1050px] m-auto flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 bg-white gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder={searchConfig?.placeholder || "Search records..."}
            value={searchConfig?.searchTerm || ""}
            onChange={(e) => searchConfig?.onSearchChange?.(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-[12px]"
          />
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-2">
          {/* Active Filters Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(activeFilters).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {filterLabels[key] || key}:{" "}
                  {(key === "fromDate" || key === "toDate") && value
                    ? new Date(value).toLocaleDateString("en-GB")
                    : value}
                  <button
                    onClick={() => {
                      const newFilters = { ...activeFilters };
                      delete newFilters[key];
                      onApplyFilters?.(newFilters);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Filter Button */}
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
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </button>

              {/* Filter Popup */}
              {showFilter && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Filter Options
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearAllFilters}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {filtersConfig.map((filter) => (
                    <div key={filter.key} className="mb-3">
                      <label className="block text-xs text-gray-500 mb-1">
                        {filter.label}
                      </label>

                      {filter.type === "select" ? (
                        <select
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                          value={localFilters[filter.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                          }
                        >
                          <option value="">All</option>
                          {filter.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : filter.type === "date" ? (
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                          value={localFilters[filter.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={filter.placeholder || ""}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                          value={localFilters[filter.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowFilter(false)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="px-4 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-500">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="h-[50vh]">
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Only show for non-search mode */}
          {pagination && pagination.mode !== "search" && data.length > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{data.length}</span> of{" "}
                  <span className="font-medium">
                    {pagination.total || "many"}
                  </span>{" "}
                  results
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onPrevPage}
                  disabled={!pagination.hasPrevious}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronsLeft size={16} />
                </button>
                <button
                  onClick={onPrevPage}
                  disabled={!pagination.hasPrevious}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700 px-2">
                  Page {pagination.currentPage + 1}
                </span>
                <button
                  onClick={onNextPage}
                  disabled={!pagination.hasNext}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={16} />
                </button>
                <button
                  onClick={onNextPage}
                  disabled={!pagination.hasNext}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Mode Indicator */}
          {(pagination?.mode === "search" || pagination?.mode === "filter") &&
            data.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-blue-50">
                <p className="text-sm text-blue-700">
                  {pagination.mode === "search" ? "Search" : "Filter"} results:{" "}
                  <span className="font-medium">{data.length}</span> records
                  found
                  {searchConfig?.searchTerm && (
                    <span>
                      {" "}
                      for "
                      <span className="font-medium">
                        {searchConfig.searchTerm}
                      </span>
                      "
                    </span>
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
