import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetCashAccounts,
  useFilterCashAccounts,
  useSearchCashAccounts,
} from "../../feature/hooks/useCash";

const filterLabels = {
  isActive: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const CashTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal dataset
  const { data: cashData, isLoading: loadingCash } = useGetCashAccounts(
    currentCursor,
    50
  );

  console.log(cashData);

  // Search dataset
  const { data: searchData, isLoading: loadingSearch } =
    useSearchCashAccounts(searchTerm);

  // Filter dataset
  const { data: filterData, isLoading: loadingFilter } = useFilterCashAccounts({
    ...filters,
    cursor: currentCursor,
    limit: 50,
  });

  // Select dataset based on mode
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return cashData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingCash || loadingSearch || loadingFilter;

  // Mode switching logic
  useEffect(() => {
    if (searchTerm) {
      setMode("search");
      setCurrentCursor(null);
      setCursorHistory([]);
    } else if (Object.keys(filters).length > 0) {
      setMode("filter");
    } else {
      setMode("normal");
    }
  }, [searchTerm, filters]);

  const columns = useMemo(
    () => [
      { accessorKey: "code", header: "Cash Account Code" },
      { accessorKey: "cashName", header: "Cash Account Name" },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                value
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {value ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => {
          const value = info.getValue();
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
    ],
    []
  );

  const handleNextPage = () => {
    if (data?.pagination?.nextCursor && mode !== "search") {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(data.pagination.nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const previousCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory((prev) => prev.slice(0, -1));
      setCurrentCursor(previousCursor);
    }
  };

  const handleApplyFilters = (newFilters) => {
    // ✅ Convert string "Active"/"Inactive" to boolean
    const processedFilters = { ...newFilters };
    
    if (processedFilters.isActive !== undefined && processedFilters.isActive !== "") {
      processedFilters.isActive = processedFilters.isActive === "Active";
    }
    
    setFilters(processedFilters);
    setCurrentCursor(null);
    setCursorHistory([]);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setMode("normal");
    setCurrentCursor(null);
    setCursorHistory([]);
  };

  // ✅ Convert boolean filters back to string for display in active filter badges
  const displayFilters = useMemo(() => {
    const display = { ...filters };
    if (display.isActive !== undefined) {
      display.isActive = display.isActive ? "Active" : "Inactive";
    }
    return display;
  }, [filters]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Cash Accounts</h2>
        <Link className="btn-primary" to={"/new-cash"}>
          <FaPlus /> New Cash Account
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="cash"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Cash Account Name or Code...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "isActive",
            label: "Status",
            type: "select",
            options: ["Active", "Inactive"],
          },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0 && mode !== "search",
          hasNext: !!data?.pagination?.nextCursor && mode !== "search",
          currentPage: cursorHistory.length,
          total: data?.pagination?.total,
          mode,
        }}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeFilters={displayFilters} // ✅ Use displayFilters for badges
        filterLabels={filterLabels}
      />
    </div>
  );
};

export default CashTable;