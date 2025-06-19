import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { nurseData } from "../../assets/tableData";
import { useGetNurses } from "../../feature/hooks/useNurse";
import Loader from "../../components/Loader/Loader";

const NurseTable = () => {
  const { data, error, isLoading, isError } = useGetNurses();

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Nurse Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "mobileNumber",
        header: "Mobile No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "registrationNo",
        header: "Registration No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "shift",
        header: "Shift",
        cell: (info) => {
          const value = info.getValue();
          let badgeClass = "";
          switch (value) {
            case "Day":
              badgeClass = "bg-yellow-100 text-yellow-800";
              break;
            case "Night":
              badgeClass = "bg-blue-100 text-blue-800";
              break;
            case "Rotating":
              badgeClass = "bg-purple-100 text-purple-800";
              break;
          }
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}
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
          let badgeClass = "";
          switch (value) {
            case "Active":
              badgeClass = "bg-green-100 text-green-700";
              break;
            case "Inactive":
              badgeClass = "bg-red-100 text-red-700";
              break;
            case "On Leave":
              badgeClass = "bg-orange-100 text-orange-700";
              break;
          }
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}
            >
              {value}
            </span>
          );
        },
      },
    ],
    []
  );

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Nurses
        </h2>
        <Link className="btn-primary" to={"/new-nurse"}>
          <FaPlus /> New Nurse
        </Link>
      </div>

      <Table data={data} columns={columns} path="nurse" />
    </div>
  );
};

export default NurseTable;
