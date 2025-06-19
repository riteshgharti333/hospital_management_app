import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { useGetDepartments } from "../../feature/hooks/useDepartments";
import Loader from "../../components/Loader/Loader";

const DepartmentTable = () => {
  const { data, error, isLoading, isError } = useGetDepartments();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Department",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "head",
        header: "Head",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "contactNumber",
        header: "Contact",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: (info) => info.getValue(),
      },
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

  if (isLoading) {
    return <Loader />;
  }

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

      <Table data={data || []} columns={columns} path="department" />
    </div>
  );
};

export default DepartmentTable;
