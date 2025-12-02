import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetNurses,
  useFilterNurses,
} from "../../feature/hooks/useNurse";

const filterLabels = {
  shift: "Shift",
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const NurseTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");

  // Normal nurse data
  const { data: nurseData, isLoading: loadingNurses } =
    useGetNurses(currentCursor, 50);

  // Filter nurse data
  const { data: filterData, isLoading: loadingFilter } =
    useFilterNurses({ ...filters, cursor: currentCursor, limit: 50 });

  const getCurrentData = () => {
    if (mode === "filter") {
      return filterData || { data: [], pagination: {} };
    }
    return nurseData || { data: [], pagination: {} };
  };

  const data = getCurrentData();
  const isLoading = loadingNurses || loadingFilter;

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
      { accessorKey: "fullName", header: "Nurse Name" },
      { accessorKey: "mobileNumber", header: "Mobile No." },
      { accessorKey: "registrationNo", header: "Registration No." },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "department", header: "Department" },

      {
        accessorKey: "shift",
        header: "Shift",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            Day: "bg-yellow-100 text-yellow-800",
            Night: "bg-blue-100 text-blue-800",
            Rotating: "bg-purple-100 text-purple-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value}
            </span>
          );
        },
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            Active: "bg-green-100 text-green-700",
            Inactive: "bg-red-100 text-red-700",
            "On Leave": "bg-orange-100 text-orange-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value}
            </span>
          );
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
    setMode("normal");
    setCurrentCursor(null);
    setCursorHistory([]);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Nurses</h2>
        <Link className="btn-primary" to={"/new-nurse"}>
          <FaPlus /> New Nurse
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="nurse"
        loading={isLoading}
        searchConfig={null}
        filtersConfig={[
          {
            key: "shift",
            label: "Shift",
            type: "select",
            options: ["Day", "Night", "Rotating"],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Inactive", "On Leave"],
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

export default NurseTable;
