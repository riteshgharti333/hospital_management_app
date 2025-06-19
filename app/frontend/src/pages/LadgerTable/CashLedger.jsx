import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { cashLedgerData, doctorLedgerData, patientLedgerData } from "../../assets/ledgerData";
import { useGetCashLedgerEntries } from "../../feature/ledgerHook/useCashLedger";
import Loader from "../../components/Loader/Loader";

const CashLedger = () => {

    const { data, error, isLoading, isError } = useGetCashLedgerEntries();

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "purpose",
        header: "Purpose",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "amountType",
        header: "Amount Type",
        cell: (info) => {
          const value = info.getValue();
          const badgeClass =
            value === "Debit"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700";
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
          Cash Ledger
        </h2>
        <Link className="btn-primary" to={"/new-ledger"}>
          <FaPlus /> New Ledger
        </Link>
      </div>

      <Table data={data} columns={columns} path="cash-ledger" />
    </div>
  );
};

export default CashLedger;
