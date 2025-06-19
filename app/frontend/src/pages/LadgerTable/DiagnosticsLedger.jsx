import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { diagnosticLedgerData, doctorLedgerData, patientLedgerData } from "../../assets/ledgerData";
import { useGetDiagnosticsLedgerEntries } from "../../feature/ledgerHook/useDiagnosticsLedger";
import Loader from "../../components/Loader/Loader";

const DiagnosticsLedger = () => {

  const { data, error, isLoading, isError } = useGetDiagnosticsLedgerEntries();
  
  
  const columns = useMemo(() => [
  {
    accessorKey: "patientName",
    header: "Patient Name",
    cell: info => info.getValue() || "-",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: info => info.getValue(),
  },
  {
    accessorKey: "testName",
    header: "Test Name",
    cell: info => info.getValue() || "-",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: info => info.getValue() || "-",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: info => `$${info.getValue()}`,
  },
  {
    accessorKey: "paymentMode",
    header: "Payment Mode",
    cell: info => {
      const value = info.getValue();
      let badgeClass = "";
      switch (value) {
        case "Cash":
          badgeClass = "bg-gray-100 text-gray-800";
          break;
        case "Card":
          badgeClass = "bg-blue-100 text-blue-800";
          break;
        case "UPI":
          badgeClass = "bg-yellow-100 text-yellow-800";
          break;
        case "Insurance":
          badgeClass = "bg-green-100 text-green-800";
          break;
      }
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: info => info.getValue() || "-",
  },
], []);


  if (isLoading) {
    return <Loader />;
  }


  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Lab/Diagnostics Ledger
        </h2>
        <Link className="btn-primary" to={"/new-ledger"}>
          <FaPlus /> New Ledger
        </Link>
      </div>

      <Table data={data} columns={columns} path="diagnostics-ledger"/>
    </div>
  );
};

export default DiagnosticsLedger;
