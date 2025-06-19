import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { doctorLedgerData, patientLedgerData } from "../../assets/ledgerData";
import { useGetDoctorLedgerEntries } from "../../feature/ledgerHook/useDoctorLedger";
import Loader from "../../components/Loader/Loader";

const DoctorLedger = () => {

   const { data, error, isLoading, isError } = useGetDoctorLedgerEntries();

  const columns = useMemo(
    () => [
      {
        accessorKey: "doctorName",
        header: "Doctor Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "amountType",
        header: "Amount Type",
        cell: (info) => {
          const value = info.getValue();
          const badgeClass =
            value === "Debit"
              ? "bg-red-100 text-red-700"
              : value === "Credit"
              ? "bg-green-100 text-green-700"
              : "";
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
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => `$${info.getValue()}`,
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => {
          const value = info.getValue();
          let badgeClass = "";
          switch (value) {
            case "Bank":
              badgeClass = "bg-blue-100 text-blue-800";
              break;
            case "UPI":
              badgeClass = "bg-yellow-100 text-yellow-800";
              break;
            case "Cash":
              badgeClass = "bg-gray-100 text-gray-800";
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
        accessorKey: "transactionId",
        header: "Transaction ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: (info) => info.getValue() || "-",
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
          Doctor Ledger
        </h2>
        <Link className="btn-primary" to={"/new-ledger"}>
          <FaPlus /> New Ledger
        </Link>
      </div>

      <Table data={data} columns={columns} path="doctor-ledger"/>
    </div>
  );
};

export default DoctorLedger;
