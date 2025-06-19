import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  dischargeData,
  nurseData,
  paymentViewData,
} from "../../assets/tableData";

const DischargeTable = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "dischargeId",
        header: "Discharge ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "patientName",
        header: "Patient Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "registrationNo",
        header: "Registration No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "doctorName",
        header: "Doctor",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "diagnosis",
        header: "Diagnosis",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "admissionDate",
        header: "Admission Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: "dischargeDate",
        header: "Discharge Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: "totalBill",
        header: "Total Bill",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "totalPaid",
        header: "Total Paid",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "dueAmount",
        header: "Due Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Discharge Lists
        </h2>
        <Link className="btn-primary" to={"/new-money-receipt-entry"}>
          <FaPlus /> Add Money Receipt
        </Link>
      </div>

      <Table data={dischargeData} columns={columns} />
    </div>
  );
};

export default DischargeTable;
