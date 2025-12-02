import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { useGetDepartments, useFilterDepartments } from "../../feature/hooks/useDepartments";

const filterLabels = {
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const DepartmentTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");

  // Normal data
  const { data: departmentData, isLoading: loadingDepartments } =
    useGetDepartments(currentCursor, 50);

  // Filter data
  const { data: filterData, isLoading: loadingFilter } =
    useFilterDepartments({ ...filters, cursor: currentCursor, limit: 50 });

  // Decide which data to show
  const getCurrentData = () => {
    if (mode === "filter") {
      return filterData || { data: [], pagination: {} };
    }
    return departmentData || { data: [], pagination: {} };
  };

  const data = getCurrentData();
  const isLoading = loadingDepartments || loadingFilter;

  // Mode switching
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
      { accessorKey: "name", header: "Department" },
      { accessorKey: "head", header: "Head" },
      { accessorKey: "contactNumber", header: "Contact" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "location", header: "Location" },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              info.getValue() === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {info.getValue()}
          </span>
        ),
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
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Departments
        </h2>
        <Link className="btn-primary" to={"/new-department"}>
          <FaPlus /> New Department
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="department"
        loading={isLoading}
        searchConfig={null} // later if needed
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Inactive"],
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

export default DepartmentTable;
