import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { brandData, nurseData } from "../../assets/tableData";
import { useGetBrands } from "../../feature/itemHooks/useBrand";
import Loader from "../../components/Loader/Loader";

const CreationTable = () => {

   const { data, error, isLoading, isError } = useGetBrands();


  const columns = useMemo(
    () => [
      {
        accessorKey: "brandName",
        header: "Brand Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
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
            case "Under Maintenance":
              badgeClass = "bg-yellow-100 text-yellow-700";
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
          Companies
        </h2>
        <Link className="btn-primary" to={"/new-company-creation"}>
          <FaPlus /> Add Brand
        </Link>
      </div>

      <Table data={data} columns={columns} path="brand" />
    </div>
  );
};

export default CreationTable;
