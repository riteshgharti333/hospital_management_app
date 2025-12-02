import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { useGetPatients, useFilterPatients } from "../../feature/hooks/usePatient";

const filterLabels = {
  gender: "Gender",
  fromDate: "From Date",
  toDate: "To Date",
};

const PatientsEntriesTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");

  // Normal data
  const { data: patientData, isLoading: loadingPatients } =
    useGetPatients(currentCursor, 50);

  // Filter data
  const { data: filterData, isLoading: loadingFilter } =
    useFilterPatients({ ...filters, cursor: currentCursor, limit: 50 });

  // Decide which dataset to show
  const getCurrentData = () => {
    switch (mode) {
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return patientData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingPatients || loadingFilter;

  // Mode management
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setMode("filter");
      setCurrentCursor(null);
      setCursorHistory([]);
    } else {
      setMode("normal");
    }
  }, [filters]);

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
    if (data?.pagination?.nextCursor) {
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
        searchConfig={null} // search later
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
          hasPrevious: cursorHistory.length > 0,
          hasNext: !!data?.pagination?.nextCursor,
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
