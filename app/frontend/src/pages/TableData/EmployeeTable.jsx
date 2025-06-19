import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import Loader from "../../components/Loader/Loader";
import { useGetEmployees } from "../../feature/transectionHooks/useEmployee";

const EmployeeTable = () => {
  const { data, isLoading } = useGetEmployees();

  const columns = useMemo(
    () => [
      {
        accessorKey: "employeeName",
        header: "Employee Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "fathersName",
        header: "Father's Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "contactNo",
        header: "Contact No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "dateOfBirth",
        header: "DOB",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "maritalStatus",
        header: "Marital Status",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "aadharNo",
        header: "Aadhar No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "voterId",
        header: "Voter ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "bloodGroup",
        header: "Blood Group",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "dateOfRegistration",
        header: "Registration Date",
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
          Employees
        </h2>
        <Link className="btn-primary" to={"/new-employee"}>
          <FaPlus /> New Employee
        </Link>
      </div>

      <Table data={data} columns={columns} path="employee" />
    </div>
  );
};

export default EmployeeTable;
