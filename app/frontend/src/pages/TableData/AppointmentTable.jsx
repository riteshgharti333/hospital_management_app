import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetAppointments,
  useFilterAppointments,
} from "../../feature/hooks/useAppointment";

const filterLabels = {
  department: "Department",
  fromDate: "From Date",
  toDate: "To Date",
};

const AppointmentTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");

  // Normal data
  const { data: appointmentData, isLoading: loadingAppointments } =
    useGetAppointments(currentCursor, 50);

  // Filter data
  const { data: filterData, isLoading: loadingFilter } =
    useFilterAppointments({ ...filters, cursor: currentCursor, limit: 50 });

  const getCurrentData = () => {
    if (mode === "filter") {
      return filterData || { data: [], pagination: {} };
    }
    return appointmentData || { data: [], pagination: {} };
  };

  const data = getCurrentData();
  const isLoading = loadingAppointments || loadingFilter;

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
      {
        accessorKey: "appointmentDate",
        header: "Appointment Date",
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
      { accessorKey: "appointmentTime", header: "Time" },
      { accessorKey: "doctorName", header: "Doctor" },
      { accessorKey: "department", header: "Department" },
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
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <Link className="btn-primary" to="/new-appointment">
          <FaPlus /> New Appointment
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="appointment"
        loading={isLoading}
        searchConfig={null} // you will add search later
        filtersConfig={[
          {
            key: "department",
            label: "Department",
            type: "select",
            options: ["Cardiology", "Neurology", "Pediatrics", "Orthopedics"],
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

export default AppointmentTable;
