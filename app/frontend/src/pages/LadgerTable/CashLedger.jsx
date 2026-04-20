import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";

import {
  useGetCashLedgerEntries,
  useSearchCashLedger,
  useFilterCashLedger,
} from "../../feature/ledgerHook/useCashLedger";

const filterLabels = {
  amountType: "Transaction Type",
  fromDate: "From Date",
  toDate: "To Date",
  paymentMode: "Payment Mode",
};

const CashLedger = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal paginated ledger
  const { data: ledgerData, isLoading: ledgerLoading } =
    useGetCashLedgerEntries(currentCursor, 50);

    console.log("Cash Ledger Data:", ledgerData);

  // Search results
  const { data: searchData, isLoading: searchLoading } =
    useSearchCashLedger(searchTerm);

  // Filter results
  const { data: filterData, isLoading: filterLoading } = useFilterCashLedger({
    ...filters,
    cursor: currentCursor,
    limit: 50,
  });

  // Select active dataset
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { 
          data: searchData?.transactions || [], 
          pagination: null,
          currentBalance: searchData?.currentBalance 
        };
      case "filter":
        return { 
          data: filterData?.transactions || [], 
          pagination: filterData?.pagination || {},
          currentBalance: filterData?.currentBalance 
        };
      default:
        return { 
          data: ledgerData?.transactions || [], 
          pagination: ledgerData?.pagination || {},
          currentBalance: ledgerData?.currentBalance 
        };
    }
  };

  const { data, pagination, currentBalance } = getCurrentData();
  const isLoading = ledgerLoading || searchLoading || filterLoading;

  // Auto-switch modes
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
        accessorKey: "code",
        header: "Transaction Code",
        cell: (info) => {
          const value = info.getValue();
          return <span className="font-mono text-sm">{value}</span>;
        },
      },
      {
        accessorKey: "transactionDate",
        header: "Transaction Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return isNaN(date)
            ? info.getValue()
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
        },
      },
      { 
        accessorKey: "description", 
        header: "Description",
        cell: (info) => info.getValue() || "-"
      },
      {
        accessorKey: "amountType",
        header: "Type",
        cell: (info) => {
          const value = info.getValue();
          const classes =
            value === "DEBIT"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700";

          return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${classes}`}>
              {value === "CREDIT" ? "Credit" : "Debit"}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => {
          const row = info.row.original;
          const amount = parseFloat(row.amount).toFixed(2);
          return (
            <span className={row.amountType === "CREDIT" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              ₹ {amount}
            </span>
          );
        },
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: (info) => {
          const value = parseFloat(info.getValue()).toFixed(2);
          return <span className="font-medium">₹ {value}</span>;
        },
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "referenceType",
        header: "Reference",
        cell: (info) => {
          const value = info.getValue();
          return value ? (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {value}
            </span>
          ) : "-";
        },
      },
      { 
        accessorKey: "remarks", 
        header: "Remarks",
        cell: (info) => info.getValue() || "-"
      },
    ],
    []
  );

  // Pagination
  const handleNextPage = () => {
    if (pagination?.nextCursor && mode !== "search") {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(pagination.nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory((prev) => prev.slice(0, -1));
      setCurrentCursor(prevCursor);
    }
  };

  // Filters
  const handleApplyFilters = (newFilters) => {
    const processedFilters = { ...newFilters };
    
    // Remove empty values
    Object.keys(processedFilters).forEach(key => {
      if (processedFilters[key] === "" || processedFilters[key] === undefined) {
        delete processedFilters[key];
      }
    });
    
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            Cash Ledger
          </h2>
          {mode === "normal" && currentBalance && (
            <p className="text-sm text-gray-600 mt-1">
              Current Balance:{" "}
              <span className="font-semibold text-green-600">
                ₹ {parseFloat(currentBalance).toFixed(2)}
              </span>
            </p>
          )}
        </div>
        <Link className="btn-primary" to="/new-ledger">
          <FaPlus /> New Transaction
        </Link>
      </div>

      <Table
        data={data || []}
        columns={columns}
        path="cash-ledger"
        ledger={true}
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by transaction code or description...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "amountType",
            label: "Transaction Type",
            type: "select",
            options: ["CREDIT", "DEBIT"],
          },
          {
            key: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: ["CASH", "BANK", "UPI", "CARD"],
          },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0 && mode !== "search",
          hasNext: !!pagination?.nextCursor && mode !== "search",
          currentPage: cursorHistory.length,
          total: pagination?.total,
          mode,
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

export default CashLedger;