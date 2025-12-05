import { useMemo, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Table from "../../components/Table/Table";

import {
  useGetMoneyReceipts,
  useSearchMoneyReceipts,
  useFilterMoneyReceipts,
} from "../../feature/transectionHooks/useMoneyReceipt";

const filterLabels = {
  paymentMode: "Payment Mode",
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const MoneyReceiptTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);

  // NORMAL GET
  const {
    data: receiptsData,
    isLoading: loadingReceipts,
  } = useGetMoneyReceipts(currentCursor, 50);

  // SEARCH GET
  const {
    data: searchData,
    isLoading: loadingSearch,
  } = useSearchMoneyReceipts(searchTerm);

  // FILTER GET
  const {
    data: filterData,
    isLoading: loadingFilter,
  } = useFilterMoneyReceipts({
    ...filters,
    cursor: currentCursor,
    limit: 50,
  });

  // Determine which dataset to use
  const finalData = (() => {
    if (mode === "search") return { data: searchData || [], pagination: null };
    if (mode === "filter")
      return filterData || { data: [], pagination: {} };
    return receiptsData || { data: [], pagination: {} };
  })();

  const isLoading = loadingReceipts || loadingSearch || loadingFilter;

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
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => {
          const value = new Date(info.getValue());
          return value.toLocaleDateString("en-GB");
        },
      },
      { accessorKey: "patientName", header: "Patient" },
      { accessorKey: "mobile", header: "Mobile" },
      {
        accessorKey: "amount",
        header: "Amount (₹)",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            Cash: "bg-yellow-100 text-yellow-800",
            Card: "bg-blue-100 text-blue-800",
            "Online Transfer": "bg-purple-100 text-purple-800",
            Cheque: "bg-green-100 text-green-800",
            Other: "bg-gray-100 text-gray-800",
          };

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            Active: "bg-green-100 text-green-700",
            Cancelled: "bg-red-100 text-red-700",
            Refunded: "bg-purple-100 text-purple-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value}
            </span>
          );
        },
      },
      { accessorKey: "remarks", header: "Remarks" },
    ],
    []
  );

  const handleNextPage = () => {
    if (finalData?.pagination?.nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(finalData.pagination.nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory((prev) => prev.slice(0, -1));
      setCurrentCursor(prevCursor);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentCursor(null);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setMode("normal");
    setCurrentCursor(null);
    setCursorHistory([]);
  };


  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Money Receipts</h2>
        <Link className="btn-primary" to="/new-money-receipt-entry">
          <FaPlus /> Add Money Receipt
        </Link>
      </div>

      {/* TABLE */}
      <Table
        data={finalData.data}
        columns={columns}
        path="money-receipt"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Name, Mobile or Admission No...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: [
              "Cash",
              "Cheque",
              "Card",
              "Online Transfer",
              "Other",
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Cancelled", "Refunded"],
          },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0 && mode !== "search",
          hasNext: !!finalData?.pagination?.nextCursor && mode !== "search",
          currentPage: cursorHistory.length,
        }}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeFilters={filters}
        filterLabels={filterLabels}
      />
    </div>
  );
};

export default MoneyReceiptTable;
