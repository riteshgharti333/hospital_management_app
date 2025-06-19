import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { nurseData, pharmacistData } from "../../assets/tableData";
import { useGetPharmacists } from "../../feature/hooks/usePharmacist";
import Loader from "../../components/Loader/Loader";

const PharmacistTable = () => {

    const { data, error, isLoading, isError } = useGetPharmacists();

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
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
              badgeClass = "bg-yellow-100 text-yellow-800";
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
          Pharmacists
        </h2>
        <Link className="btn-primary" to={"/new-pharmacist"}>
          <FaPlus /> New Pharmacist
        </Link>
      </div>

      <Table data={data} columns={columns} path="pharmacist" />
    </div>
  );
};

export default PharmacistTable;
