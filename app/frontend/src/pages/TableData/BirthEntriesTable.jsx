import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetBirthRecords,
  useFilterBirth,
  useSearchBirth,
} from "../../feature/hooks/useBirth";

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

  // Normal dataset
  const { data: birthData, isLoading: loadingBirth } =
    useGetBirthRecords(currentCursor, 50);

  // Search dataset
  const { data: searchData, isLoading: loadingSearch } =
    useSearchBirth(searchTerm);

  // Filter dataset
  const { data: filterData, isLoading: loadingFilter } = useFilterBirth({
    ...filters,
    cursor: currentCursor,
    limit: 50,
  });

  // dataset selection
  const getCurrentData = () => {
    switch (mode) {
      case "search":
        return { data: searchData || [], pagination: null };
      case "filter":
        return filterData || { data: [], pagination: {} };
      default:
        return birthData || { data: [], pagination: {} };
    }
  };

  const data = getCurrentData();
  const isLoading = loadingBirth || loadingFilter || loadingSearch;

  // Mode Switching
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
        searchConfig={{
          placeholder: "Search by Father, Mother or Mobile No...",
          searchTerm,
          onSearchChange: setSearchTerm,
        }}
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

export default BirthEntriesTable;
