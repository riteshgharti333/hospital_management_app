import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetPatients,
  useFilterPatients,
  useSearchPatients,
} from "../../feature/hooks/usePatient";

const filterLabels = {
  gender: "Gender",
  fromDate: "From Date",
  toDate: "To Date",
};

const PatientsEntriesTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal dataset
  const { data: patientData, isLoading: loadingPatients } =
    useGetPatients(currentCursor, 50);

  // Search dataset
  const { data: searchData, isLoading: loadingSearch } =
    useSearchPatients(searchTerm);

  // Filter dataset
  const { data: filterData, isLoading: loadingFilter } =
    useFilterPatients({ ...filters, cursor: currentCursor, limit: 50 });

  // Select active dataset
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return patientData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingPatients || loadingSearch || loadingFilter;

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
      { accessorKey: "fullName", header: "Name" },
      {
        accessorKey: "age",
        header: "Age",
        cell: (info) => `${info.getValue()} yrs`,
      },
      { accessorKey: "mobileNumber", header: "Mobile" },
      { accessorKey: "bedNumber", header: "Bed" },
      { accessorKey: "gender", header: "Gender" },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "aadhaarNumber", header: "Aadhaar" },
      { accessorKey: "medicalHistory", header: "Medical History" },
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
          Patients Entries
        </h2>
        <Link className="btn-primary" to="/new-patient-register">
          <FaPlus /> Enter Patient Register
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="patient"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Name, Mobile or Aadhaar...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "gender",
            label: "Gender",
            type: "select",
            options: ["Male", "Female", "Other"],
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

export default PatientsEntriesTable;
