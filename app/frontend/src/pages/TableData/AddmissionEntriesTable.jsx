import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import Loader from "../../components/Loader/Loader";
import {
  useGetAdmissions,
  useSearchAdmissions,
  useFilterAdmissions,
} from "../../feature/hooks/useAdmisson";

const filterLabels = {
  patientSex: "Patient Sex",
  bloodGroup: "Blood Group",
  fromDate: "From Date",
  toDate: "To Date",
};


const AdmissionEntriesTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // 'normal', 'search', 'filter'

  // Normal admissions data with pagination
  const { data: admissionsData, isLoading: admissionsLoading } =
    useGetAdmissions(currentCursor, 50);

  // Search admissions data
  const { data: searchData, isLoading: searchLoading } =
    useSearchAdmissions(searchTerm);

  // Filter admissions data
  const { data: filterData, isLoading: filterLoading } = useFilterAdmissions({
    ...filters,
    cursor: currentCursor,
    limit: 50,
  });

  // Determine which data to use based on mode
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return admissionsData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = admissionsLoading || searchLoading || filterLoading;

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
      { accessorKey: "patientName", header: "Name" },
      {
        accessorKey: "patientAge",
        header: "Age",
        cell: (info) => `${info.getValue()} yrs`,
      },
      { accessorKey: "patientSex", header: "Sex" },
      { accessorKey: "bloodGroup", header: "Blood" },
      { accessorKey: "gsRsRegNo", header: "Registration No." },
      { accessorKey: "phoneNo", header: "Phone No." },

      { accessorKey: "wardNo", header: "Ward" },
      { accessorKey: "bedNo", header: "Bed" },
      { accessorKey: "doctorName", header: "Doctor" },
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
      { accessorKey: "admissionTime", header: "Time" },
      {
        accessorKey: "dischargeDate",
        header: "Discharge",
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
    setSearchTerm("");
    setMode("normal");
    setCurrentCursor(null);
    setCursorHistory([]);
  };

  // if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Admission Entries</h2>
        <Link
          className="btn-primary flex items-center gap-2"
          to="/new-admission-entry"
        >
          <FaPlus /> Enter Patient Admission
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="admission"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Name, Reg. No or Phone no...",
          searchTerm: searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "patientSex",
            label: "Gender",
            type: "select",
            options: ["Male", "Female", "Other"],
          },
          {
            key: "bloodGroup",
            label: "Blood Group",
            type: "select",
            options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
          },
          {
            key: "fromDate",
            label: "From Date",
            type: "date",
          },
          {
            key: "toDate",
            label: "To Date",
            type: "date",
          },
        
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0 && mode !== "search",
          hasNext: !!data?.pagination?.nextCursor && mode !== "search",
          currentPage: cursorHistory.length,
          total: data?.pagination?.total,
          mode: mode,
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

export default AdmissionEntriesTable;
