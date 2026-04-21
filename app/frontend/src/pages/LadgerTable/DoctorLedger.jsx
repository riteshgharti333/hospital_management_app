import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetLedgersByEntity,
  useFilterLedgers,
  useSearchLedgersByEntity,
} from "../../feature/hooks/useLedger";

const filterLabels = {
  amountType: "Transaction Type",
  fromDate: "From Date",
  toDate: "To Date",
  paymentMode: "Payment Mode",
};

const DoctorLedger = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal dataset
  const { data: ledgerData, isLoading: ledgerLoading } =
    useGetLedgersByEntity("DOCTOR");

  // Search dataset
  const { data: searchData, isLoading: searchLoading } =
    useSearchLedgersByEntity("DOCTOR", searchTerm);

  // Filter dataset
  const { data: filterData, isLoading: filterLoading } = useFilterLedgers(
    "DOCTOR",
    {
      ...filters,
      cursor: currentCursor,
      limit: 50,
    },
  );

  console.log(filterData);

  // Select dataset based on mode
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return ledgerData || { transactions: [], pagination: {} };
    }
  };

  const currentData = getCurrentData();
  const data =
    mode === "normal" || mode === "filter"
      ? currentData?.transactions || []
      : currentData?.data || [];
  const pagination = currentData?.pagination || {};
  const currentBalance =
    mode === "normal" || mode === "filter"
      ? currentData?.currentBalance || 0
      : null;
  const isLoading = ledgerLoading || searchLoading || filterLoading;

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
        cell: (info) => info.getValue() || "-",
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

          const displayText = value === "CREDIT" ? "Credit" : "Debit";

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${classes}`}
            >
              {displayText}
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
            <span
              className={
                row.amountType === "CREDIT"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
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
        cell: (info) => {
          const mode = info.getValue();
          if (!mode) return "-";

          const colorMap = {
            CASH: "bg-green-100 text-green-700",
            CARD: "bg-blue-100 text-blue-700",
            UPI: "bg-purple-100 text-purple-700",
            BANK_TRANSFER: "bg-orange-100 text-orange-700",
            CHEQUE: "bg-yellow-100 text-yellow-700",
          };

          const displayText = mode
            .split("_")
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ");

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${colorMap[mode] || "bg-gray-100 text-gray-700"}`}
            >
              {displayText}
            </span>
          );
        },
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
          ) : (
            "-"
          );
        },
      },
     
    ],
    [],
  );

  const handleNextPage = () => {
    if (pagination?.nextCursor && mode !== "search") {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(pagination.nextCursor);
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
    const processedFilters = { ...newFilters };

    // Convert display values back to API enum values
    if (processedFilters.amountType === "Credit") {
      processedFilters.amountType = "CREDIT";
    } else if (processedFilters.amountType === "Debit") {
      processedFilters.amountType = "DEBIT";
    }

    // Payment mode mapping
    const paymentModeMap = {
      Cash: "CASH",
      Card: "CARD",
      UPI: "UPI",
      "Bank Transfer": "BANK_TRANSFER",
      Cheque: "CHEQUE",
    };

    if (
      processedFilters.paymentMode &&
      paymentModeMap[processedFilters.paymentMode]
    ) {
      processedFilters.paymentMode =
        paymentModeMap[processedFilters.paymentMode];
    }

    // Remove empty values
    Object.keys(processedFilters).forEach((key) => {
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
            Doctor Ledger
          </h2>
          {mode !== "search" && currentBalance !== null && (
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
        path="doctor-ledger"
        ledger={true}
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by transaction code...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "amountType",
            label: "Transaction Type",
            type: "select",
            options: ["Credit", "Debit"],
          },
          {
            key: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: ["Cash", "Card", "UPI", "Bank Transfer", "Cheque"],
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

export default DoctorLedger;