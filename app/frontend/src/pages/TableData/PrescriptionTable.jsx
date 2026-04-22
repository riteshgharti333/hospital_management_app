import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetPrescriptions,
  useFilterPrescriptions,
  useSearchPrescriptions,
} from "../../feature/hooks/usePrescription";

const filterLabels = {
  fromDate: "From Date",
  toDate: "To Date",
  status: "Status",
};

const PrescriptionTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal dataset
  const { data: prescriptionData, isLoading: loadingPrescriptions } =
    useGetPrescriptions(currentCursor, 50);

  // Search dataset
  const { data: searchData, isLoading: loadingSearch } =
    useSearchPrescriptions(searchTerm);

  // Filter dataset
  const { data: filterData, isLoading: loadingFilter } = useFilterPrescriptions(
    { ...filters, cursor: currentCursor, limit: 50 },
  );

  console.log(prescriptionData);

  // dataset selection
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return prescriptionData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingPrescriptions || loadingSearch || loadingFilter;

  // Mode switching
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
        accessorKey: "prescriptionNo",
        header: "Prescription No",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "admissionId",
        header: "Admission ID",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "prescriptionDate",
        header: "Prescription Date",
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
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const statusColors = {
            ACTIVE: "bg-green-100 text-green-800",
            COMPLETED: "bg-blue-100 text-blue-800",
            CANCELLED: "bg-red-100 text-red-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "admission.patient.fullName",
        header: "Patient Name",
        cell: (info) => {
          const patient = info.row.original?.admission?.patient;
          return patient?.fullName || "-";
        },
      },
    ],
    [],
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

 
  const statusMap = {
  "Active": "ACTIVE",
  "Completed": "COMPLETED",
  "Cancelled": "CANCELLED"
};
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>
        <Link className="btn-primary" to={"/new-prescription"}>
          <FaPlus /> New Prescription
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="prescription"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Prescription No or Patient Name...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        // Updated PrescriptionTable filtersConfig
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["ACTIVE", "COMPLETED", "CANCELLED"], // ← Changed to array of strings
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
        activeFilters={filters}
        filterLabels={filterLabels}
      />
    </div>
  );
};

export default PrescriptionTable;
