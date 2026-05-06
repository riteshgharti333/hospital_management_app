import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetLedgersByEntity,
  useFilterLedgers,
  useSearchLedgersByEntity,
} from "../../feature/hooks/useLedger";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  amountType: "Transaction Type",
  paymentMode: "Payment Mode",
  fromDate: "From Date",
  toDate: "To Date",
};

const DoctorLedger = () => {
  // Controller handles ALL logic with entity type
  const controller = useTableController({
    normalDataHook: useGetLedgersByEntity,
    searchDataHook: useSearchLedgersByEntity,
    filterDataHook: useFilterLedgers,
    entityType: "DOCTOR",
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Transaction Code",
        cell: (info) => {
          const value = info.getValue();
          return <span className="font-mono text-sm">{value}</span>;
        },
      },
      {
        accessorKey: "transactionDate",
        header: "Transaction Date",
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
        accessorKey: "amountType",
        header: "Type",
        cell: (info) => {
          const value = info.getValue();
          const classes =
            value === "DEBIT"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700";

          const displayText = value === "CREDIT" ? "Credit" : "Debit";

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${classes}`}
            >
              {displayText}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => {
          const row = info.row.original;
          const amount = parseFloat(row.amount).toFixed(2);
          return (
            <span
              className={
                row.amountType === "CREDIT"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              ₹ {amount}
            </span>
          );
        },
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: (info) => {
          const value = parseFloat(info.getValue()).toFixed(2);
          return <span className="font-medium">₹ {value}</span>;
        },
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => {
          const mode = info.getValue();
          if (!mode) return "-";

          const colorMap = {
            CASH: "bg-green-100 text-green-700",
            CARD: "bg-blue-100 text-blue-700",
            UPI: "bg-purple-100 text-purple-700",
            BANK_TRANSFER: "bg-orange-100 text-orange-700",
            CHEQUE: "bg-yellow-100 text-yellow-700",
          };

          const displayText = mode
            .split("_")
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ");

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${colorMap[mode] || "bg-gray-100 text-gray-700"}`}
            >
              {displayText}
            </span>
          );
        },
      },
      {
        accessorKey: "referenceType",
        header: "Reference",
        cell: (info) => {
          const value = info.getValue();
          return value ? (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {value}
            </span>
          ) : (
            "-"
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Doctor Ledger</h2>
          {controller.currentBalance !== null &&
            controller.currentBalance !== undefined && (
              <p className="text-sm text-gray-600 mt-1">
                Current Balance:{" "}
                <span className="font-semibold text-green-600">
                  ₹ {parseFloat(controller.currentBalance).toFixed(2)}
                </span>
              </p>
            )}
        </div>
        <Link className="btn-primary" to="/new-ledger">
          <FaPlus /> New Transaction
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="doctor-ledger"
        ledger={true}
        searchConfig={{
          placeholder: "Search by transaction code...",
        }}
        filtersConfig={[
          {
            key: "amountType",
            label: "Transaction Type",
            type: "select",
            options: ["CREDIT", "DEBIT"],
          },
          {
            key: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: ["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"],
          },
          {
            key: "fromDate",
            label: "From Date",
            type: "date",
          },
          {
            key: "toDate",
            label: "To Date",
            type: "date",
          },
        ]}
        filterLabels={filterLabels}
      />
    </div>
  );
};

export default DoctorLedger;
