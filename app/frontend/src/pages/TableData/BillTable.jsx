import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import Table from "../../components/Table/Table";

import {
  useGetBills,
  useSearchBills,
  useFilterBills,
} from "../../feature/transectionHooks/useBill";

const filterLabels = {
  billType: "Bill Type",
  patientSex: "Gender",
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const BillTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // ⬇ NORMAL BILL FETCHING
  const { data: billsData, isLoading: billsLoading } = useGetBills(
    currentCursor,
    50
  );

  // ⬇ SEARCH BILL
  const { data: searchData, isLoading: searchLoading } =
    useSearchBills(searchTerm);

  // ⬇ FILTER BILL
  const { data: filterData, isLoading: filterLoading } = useFilterBills({
    ...filters,
    cursor: currentCursor,
    limit: 50,
  });

  // ⬇ SELECT ACTIVE DATA SOURCE
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return billsData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = billsLoading || searchLoading || filterLoading;

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

  // Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "billDate",
        header: "Bill Date",
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
      { accessorKey: "billType", header: "Type" },
      { accessorKey: "admissionNo", header: "Admission No" },
      { accessorKey: "patientName", header: "Patient Name" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "patientSex", header: "Gender" },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();

          const colorMap = {
            Pending: "bg-yellow-100 text-yellow-700",
            PartiallyPaid: "bg-blue-100 text-blue-700",
            Paid: "bg-green-100 text-green-700",
            Cancelled: "bg-red-100 text-red-700",
            Refunded: "bg-purple-100 text-purple-700",
          };

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${colorMap[value]}`}
            >
              {value}
            </span>
          );
        },
      },

      {
        accessorKey: "admissionDate",
        header: "Admission Date",
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
    ],
    []
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (data?.pagination?.nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(data.pagination.nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const previousCursor = cursorHistory.pop();
      setCursorHistory([...cursorHistory]);
      setCurrentCursor(previousCursor);
    }
  };

  // Filter handlers
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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Bills</h2>

        <Link
          className="btn-primary flex items-center gap-2"
          to="/new-bill-entry"
        >
          <FaPlus /> New Bill
        </Link>
      </div>

      {/* FULL FEATURED TABLE */}
      <Table
        data={data?.data || []}
        columns={columns}
        path="bill"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Admission No, Name, Mobile...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "billType",
            label: "Bill Type",
            type: "select",
            options: ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"],
          },
          {
            key: "patientSex",
            label: "Gender",
            type: "select",
            options: ["Male", "Female", "Other"],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              "Pending",
              "PartiallyPaid",
              "Paid",
              "Cancelled",
              "Refunded",
            ],
          },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0 && mode !== "search",
          hasNext: !!data?.pagination?.nextCursor && mode !== "search",
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

export default BillTable;
