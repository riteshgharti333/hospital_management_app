import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetNurseRecords,
  useFilterNurseRecords,
  useSearchNurseRecords,
} from "../../feature/hooks/useNurse";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  shift: "Shift",
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const NurseTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetNurseRecords,
    searchDataHook: useSearchNurseRecords,
    filterDataHook: useFilterNurseRecords,
  });

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

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Nurses</h2>
        <Link className="btn-primary" to={"/new-nurse"}>
          <FaPlus /> New Nurse
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="nurse"
        searchConfig={{
          placeholder: "Search by Name, Mobile or Registration No...",
        }}
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
        filterLabels={filterLabels}
      />
    </div>
  );
};

export default NurseTable;