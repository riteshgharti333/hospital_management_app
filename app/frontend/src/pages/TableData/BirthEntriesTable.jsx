import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { birthData, dummyPatients } from "../../assets/tableData";
import { useGetBirthRecords } from "../../feature/hooks/useBirth";
import Loader from "../../components/Loader/Loader";

const BirthEntriesTable = () => {
  const { data, error, isLoading, isError } = useGetBirthRecords();


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
      {
        accessorKey: "birthTime",
        header: "Birth Time",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "babySex",
        header: "Sex",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "babyWeightKg",
        header: "Weight",
        cell: (info) => `${info.getValue()} kg`,
      },
      {
        accessorKey: "fathersName",
        header: "Father's Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "mothersName",
        header: "Mother's Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "mobileNumber",
        header: "Mobile No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "deliveryType",
        header: "Delivery Type",
        cell: (info) => info.getValue(),
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
          Birth Entries
        </h2>
        <Link className="btn-primary" to={"/new-birth-register"}>
          <FaPlus /> Enter Birth Register
        </Link>
      </div>

      <Table data={data} columns={columns} path="birth" />
    </div>
  );
};

export default BirthEntriesTable;
