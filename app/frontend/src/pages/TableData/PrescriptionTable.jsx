import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetPrescriptions,
  useFilterPrescriptions,
} from "../../feature/hooks/usePrescription";

const filterLabels = {
  fromDate: "From Date",
  toDate: "To Date",
};

const PrescriptionTable = () => {
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]);
  const [filters, setFilters] = useState({});
  const [mode, setMode] = useState("normal");

 

  // Normal data
  const { data: prescriptionData, isLoading: loadingPrescriptions } =
    useGetPrescriptions(currentCursor, 50);

    console.log("prescriptionData:", prescriptionData);

  // Filter data
  const { data: filterData, isLoading: loadingFilter } =
    useFilterPrescriptions({ ...filters, cursor: currentCursor, limit: 50 });

  const getCurrentData = () => {
    if (mode === "filter") {
      return filterData || { data: [], pagination: {} };
    }
    return prescriptionData || { data: [], pagination: {} };
  };

  const data = getCurrentData();
  const isLoading = loadingPrescriptions || loadingFilter;

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
      { accessorKey: "doctorName", header: "Doctor Name" },
      { accessorKey: "patientName", header: "Patient Name" },
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
      <div className="flex justify-between items-center">
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
        searchConfig={null}
        filtersConfig={[
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

export default PrescriptionTable;
