import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetDepartments,
  useFilterDepartments,
  useSearchDepartments,
} from "../../feature/hooks/useDepartments";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const DepartmentTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetDepartments,
    searchDataHook: useSearchDepartments,
    filterDataHook: useFilterDepartments,
  });

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Department Name" },
      { accessorKey: "head.fullName", header: "Department Head" },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            Active: "bg-green-100 text-green-700",
            Inactive: "bg-red-100 text-red-700",
            ACTIVE: "bg-green-100 text-green-700",
            INACTIVE: "bg-red-100 text-red-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value === "ACTIVE"
                ? "Active"
                : value === "INACTIVE"
                  ? "Inactive"
                  : value}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
        <Link className="btn-primary" to={"/new-department"}>
          <FaPlus /> New Department
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="department"
        searchConfig={{
          placeholder: "Search by Department Name or Doctor Name",
        }}
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["ACTIVE", "INACTIVE"],
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

export default DepartmentTable;
