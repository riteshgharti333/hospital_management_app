import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  doctorLedgerData,
  generalLedgerData,
  patientLedgerData,
} from "../../assets/ledgerData";
import Loader from "../../components/Loader/Loader";
import { useGetExpenseEntries } from "../../feature/ledgerHook/useExpenseLedger";

const GeneralExpenseLedger = () => {

   const { data, error, isLoading, isError } = useGetExpenseEntries();

  const columns = useMemo(
    () => [
      {
        accessorKey: "expenseCategory",
        header: "Expense Category",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => {
          const value = info.getValue();
          let badgeClass = "";
          switch (value) {
            case "Cash":
              badgeClass = "bg-green-100 text-green-800";
              break;
            case "Bank":
              badgeClass = "bg-blue-100 text-blue-800";
              break;
            case "UPI":
              badgeClass = "bg-purple-100 text-purple-800";
              break;
            case "Cheque":
              badgeClass = "bg-yellow-100 text-yellow-800";
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
        accessorKey: "transactionId",
        header: "Transaction ID",
        cell: (info) => info.getValue() || "-",
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
          General Expense Ledger
        </h2>
        <Link className="btn-primary" to={"/new-ledger"}>
          <FaPlus /> New Ledger
        </Link>
      </div>

      <Table data={data} columns={columns} path="general-ledger" />
    </div>
  );
};

export default GeneralExpenseLedger;
