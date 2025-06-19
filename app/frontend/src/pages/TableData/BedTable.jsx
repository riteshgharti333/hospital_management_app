import { useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Table from "../../components/Table/Table";
import {bedData} from "../../assets/tableData"
import { useGetBeds } from "../../feature/hooks/useBed";
import Loader from "../../components/Loader/Loader";

const BedTable = () => {

   const { data, isLoading } = useGetBeds();
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "bedNumber",
        header: "Bed Number",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "wardNumber",
        header: "Ward Number",
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

  const getRowProps = (row) => ({
    className:
      row.original.status === "Inactive" ? "bg-red-300" : "", 
  });

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Bed Master
        </h2>
        <Link className="btn-primary" to={"/new-bed"}>
          <FaPlus /> Add Bed
        </Link>
      </div>

      <Table data={data} columns={columns} getRowProps={getRowProps} path="bed"/>
    </div>
  );
};

export default BedTable;
