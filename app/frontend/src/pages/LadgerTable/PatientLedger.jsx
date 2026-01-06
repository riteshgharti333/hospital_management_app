import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";

import {
  useGetPatientLedgerEntries,
  useSearchPatientLedger,
  useFilterPatientLedger,
} from "../../feature/ledgerHook/usePatientLedger";

const filterLabels = {
  amountType: "Amount Type",
  paymentMode: "Payment Mode",
  fromDate: "From Date",
  toDate: "To Date",
};

const PatientLedger = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal paginated ledger
  const { data: ledgerData, isLoading: ledgerLoading } =
    useGetPatientLedgerEntries(currentCursor, 50);

  // Search ledger
  const { data: searchData, isLoading: searchLoading } =
    useSearchPatientLedger(searchTerm);

  // Filter ledger
  const { data: filterData, isLoading: filterLoading } = useFilterPatientLedger(
    {
      ...filters,
      cursor: currentCursor,
      limit: 50,
    }
  );

  // Decide which dataset to show
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return ledgerData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = ledgerLoading || searchLoading || filterLoading;

  // Change mode automatically
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
      { accessorKey: "patientName", header: "Patient Name" },
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
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "amountType",
        header: "Amount Type",
        cell: (info) => {
          const value = info.getValue();
          const classes =
            value === "Debit"
              ? "bg-red-100 text-red-800"
              : value === "Credit"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800";

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${classes}`}
            >
              {value}
            </span>
          );
        },
      },
      { accessorKey: "amount", header: "Amount" },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => {
          const value = info.getValue();
          const classes =
            value === "Cash"
              ? "bg-yellow-100 text-yellow-800"
              : value === "UPI"
              ? "bg-purple-100 text-purple-800"
              : value === "Card"
              ? "bg-blue-100 text-blue-800"
              : value === "Insurance"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800";

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${classes}`}
            >
              {value}
            </span>
          );
        },
      },
      { accessorKey: "transactionId", header: "Transaction ID" },
      { accessorKey: "remarks", header: "Remarks" },
    ],
    []
  );

  // Pagination
  const handleNextPage = () => {
    if (data?.pagination?.nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(data.pagination.nextCursor);
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
    setFilters(newFilters);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Patient Ledger
        </h2>
        <Link className="btn-primary" to={"/new-ledger"}>
          <FaPlus /> New Ledger
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="patient-ledger"
        loading={isLoading}
        ledger={true}
        searchConfig={{
          placeholder: "Search by patient name...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "amountType",
            label: "Amount Type",
            type: "select",
            options: ["Credit", "Debit"],
          },
          {
            key: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: ["Cash", "UPI", "Card", "Insurance"],
          },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0 && mode !== "search",
          hasNext: !!data?.pagination?.nextCursor && mode !== "search",
          currentPage: cursorHistory.length,
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

export default PatientLedger;
