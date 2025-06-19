import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { useGetPatients } from "../../feature/hooks/usePatient";
import Loader from "../../components/Loader/Loader";

const PatientsEntriesTable = () => {
  const { data, isLoading } = useGetPatients();


  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: (info) => `${info.getValue()} yrs`,
      },
      {
        accessorKey: "mobileNumber",
        header: "Mobile",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "bedNumber",
        header: "Bed",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "aadhaarNumber",
        header: "Aadhaar",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "medicalHistory",
        header: "Medical History",
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
          Patients Entries
        </h2>
        <Link className="btn-primary" to={"/new-patient-register"}>
          <FaPlus /> Enter Patient Register
        </Link>
      </div>

      <Table data={data} columns={columns} path="patient" />
    </div>
  );
};

export default PatientsEntriesTable;
