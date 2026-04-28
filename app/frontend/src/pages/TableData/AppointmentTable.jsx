import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetAppointments,
  useFilterAppointments,
  useSearchAppointments,
} from "../../feature/hooks/useAppointment";

const filterLabels = {
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const AppointmentTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal dataset
  const { data: appointmentData, isLoading: loadingAppointments } =
    useGetAppointments(currentCursor, 50);

  console.log(appointmentData);

  // Search dataset
  const { data: searchData, isLoading: loadingSearch } =
    useSearchAppointments(searchTerm);

  // Filter dataset
  const { data: filterData, isLoading: loadingFilter } = useFilterAppointments({
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
        return appointmentData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingAppointments || loadingSearch || loadingFilter;

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
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "appointmentDate",
        header: "Appointment Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString();
        },
      },
      { accessorKey: "appointmentTime", header: "Appointment Time" },
      {
        accessorKey: "doctor.fullName",
        header: "Doctor Name",
        accessorFn: (row) => row.doctor?.fullName || "N/A",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            BOOKED: "bg-blue-100 text-blue-700",
            CANCELLED: "bg-red-100 text-red-700",
            EXPIRED: "bg-gray-100 text-gray-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value === "BOOKED"
                ? "Booked"
                : value === "CANCELLED"
                  ? "Cancelled"
                  : value === "EXPIRED"
                    ? "Expired"
                    : value}
            </span>
          );
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

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <Link className="btn-primary" to={"/new-appointment"}>
          <FaPlus /> New Appointment
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="appointment"
        loading={isLoading}
        searchConfig={{
          placeholder: "Search by Doctor Name",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["BOOKED", "CANCELLED", "EXPIRED"],
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

export default AppointmentTable;
