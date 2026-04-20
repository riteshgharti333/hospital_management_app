import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetBanks,
  useFilterBanks,
  useSearchBanks,
} from "../../feature/hooks/useBank";

const filterLabels = {
  isActive: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const BankTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal dataset
  const { data: bankData, isLoading: loadingBanks } = useGetBanks(
    currentCursor,
    50
  );

  console.log(bankData);

  // Search dataset
  const { data: searchData, isLoading: loadingSearch } =
    useSearchBanks(searchTerm);

  // Filter dataset
  const { data: filterData, isLoading: loadingFilter } = useFilterBanks({
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
        return bankData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingBanks || loadingSearch || loadingFilter;

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
      { accessorKey: "code", header: "Bank Code" },
      { accessorKey: "bankName", header: "Bank Name" },
      { accessorKey: "accountNo", header: "Account Number" },
      { accessorKey: "ifscCode", header: "IFSC Code" },
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
        <h2 className="text-2xl font-bold text-gray-800">Bank Accounts</h2>
        <Link className="btn-primary" to={"/new-bank"}>
          <FaPlus /> New Bank Account
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="bank"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Bank Name, Code or Account Number...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "isActive",
            label: "Status",
            type: "select",
            options: ["Active", "Inactive"], // ✅ Use strings instead of objects
          },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0 && mode !== "search",
          hasNext: !!data?.pagination?.nextCursor && mode !== "search", // ✅ Use nextCursor
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

export default BankTable;