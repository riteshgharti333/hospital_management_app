import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  doctorLedgerData,
  generalLedgerData,
  insuranceLedgerData,
  patientLedgerData,
} from "../../assets/ledgerData";
import { useGetInsuranceLedgerEntries } from "../../feature/ledgerHook/useInsuranceLedger";
import Loader from "../../components/Loader/Loader";

const InsuranceTPALedger = () => {

   const { data, error, isLoading, isError } = useGetInsuranceLedgerEntries();
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "patientName",
        header: "Patient Name",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "tpaCompany",
        header: "TPA Company",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "claimAmount",
        header: "Claim Amount",
        cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "approvedAmount",
        header: "Approved Amount",
        cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "settledAmount",
        header: "Settled Amount",
        cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          let badgeClass = "";
          switch (value) {
            case "Pending":
              badgeClass = "bg-yellow-100 text-yellow-800";
              break;
            case "Approved":
              badgeClass = "bg-green-100 text-green-800";
              break;
            case "Rejected":
              badgeClass = "bg-red-100 text-red-800";
              break;
            default:
              badgeClass = "bg-gray-100 text-gray-800";
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
          Insurance/TPA Ledger
        </h2>
        <Link className="btn-primary" to={"/new-ledger"}>
          <FaPlus /> New Ledger
        </Link>
      </div>

      <Table
        data={data}
        columns={columns}
        path="insurance-ledger"
      />
    </div>
  );
};

export default InsuranceTPALedger;
