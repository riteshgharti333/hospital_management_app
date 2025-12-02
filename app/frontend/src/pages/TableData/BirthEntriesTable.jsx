import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { useGetBirthRecords, useFilterBirth } from "../../feature/hooks/useBirth";

const filterLabels = {
  babySex: "Baby Sex",
  deliveryType: "Delivery Type",
  fromDate: "From Date",
  toDate: "To Date",
};

const BirthEntriesTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal"); // normal | search | filter

  // Normal data
  
  const { data: birthData, isLoading: loadingBirth } =
    useGetBirthRecords(currentCursor, 50);


  // Filter data
  const { data: filterData, isLoading: loadingFilter } = useFilterBirth({
    ...filters,
    cursor: currentCursor,
    limit: 50,
  });

  // Determine active dataset
  const getCurrentData = () => {
    switch (mode) {
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return birthData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingBirth || loadingFilter;

  // Mode logic
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
        accessorKey: "birthDate",
        header: "Birth Date",
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
      { accessorKey: "birthTime", header: "Birth Time" },
      { accessorKey: "babySex", header: "Sex" },
      {
        accessorKey: "babyWeightKg",
        header: "Weight",
        cell: (info) => `${info.getValue()} kg`,
      },
      { accessorKey: "fathersName", header: "Father's Name" },
      { accessorKey: "mothersName", header: "Mother's Name" },
      { accessorKey: "mobileNumber", header: "Mobile No." },
      { accessorKey: "deliveryType", header: "Delivery Type" },
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
        <h2 className="text-2xl font-bold text-gray-800">Birth Entries</h2>
        <Link className="btn-primary" to={"/new-birth-register"}>
          <FaPlus /> Enter Birth Register
        </Link>
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        path="birth"
        loading={isLoading}
        searchConfig={null} // Birth does NOT have search
        filtersConfig={[
          {
            key: "babySex",
            label: "Baby Sex",
            type: "select",
            options: ["Male", "Female", "Other"],
          },
          {
            key: "deliveryType",
            label: "Delivery Type",
            type: "select",
            options: ["Normal", "Cesarean", "Forceps", "Vacuum"],
          },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        pagination={{
          hasPrevious: cursorHistory.length > 0,
          hasNext: !!data?.pagination?.nextCursor,
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

export default BirthEntriesTable;
