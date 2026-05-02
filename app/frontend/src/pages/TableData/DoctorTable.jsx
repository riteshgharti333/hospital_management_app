import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetDoctors,
  useFilterDoctors,
  useSearchDoctors,
} from "../../feature/hooks/useDoctor";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const DoctorTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetDoctors,
    searchDataHook: useSearchDoctors,
    filterDataHook: useFilterDoctors,
  });

  const columns = useMemo(
    () => [
      { accessorKey: "fullName", header: "Doctor Name" },
      { accessorKey: "mobileNumber", header: "Mobile No." },
      { accessorKey: "registrationNo", header: "Registration No." },
      { accessorKey: "qualification", header: "Qualification" },
      { accessorKey: "specialization", header: "Specialization" },
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
            <span className={`px-2 py-1 rounded text-xs font-medium ${map[value] || ""}`}>
              {value}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Doctors</h2>
        <Link className="btn-primary" to="/new-doctor">
          <FaPlus /> New Doctor
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="doctor"
        searchConfig={{
          placeholder: "Search by Name, Mobile or Registration No...",
        }}
        filtersConfig={[
          { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "On Leave"] },
          { key: "fromDate", label: "From Date", type: "date" },
          { key: "toDate", label: "To Date", type: "date" },
        ]}
        filterLabels={filterLabels}
      />
    </div>
  );
};

export default DoctorTable;