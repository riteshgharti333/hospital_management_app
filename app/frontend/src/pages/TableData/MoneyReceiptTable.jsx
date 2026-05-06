import { useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Table from "../../components/Table/Table";
import {
  useGetMoneyReceipts,
  useSearchMoneyReceipts,
  useFilterMoneyReceipts,
} from "../../feature/transectionHooks/useMoneyReceipt";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  paymentMode: "Payment Mode",
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const MoneyReceiptTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetMoneyReceipts,
    searchDataHook: useSearchMoneyReceipts,
    filterDataHook: useFilterMoneyReceipts,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
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
      { accessorKey: "patient.fullName", header: "Patient Name" },
      { accessorKey: "patient.hospitalPatientId", header: "Patient ID" },
      { accessorKey: "patient.mobileNumber", header: "Mobile" },
      {
        accessorKey: "amount",
        header: "Amount (₹)",
        cell: (info) => {
          const amount = parseFloat(info.getValue()).toFixed(2);
          return <span className="font-medium">₹ {amount}</span>;
        },
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            Cash: "bg-yellow-100 text-yellow-800",
            Card: "bg-blue-100 text-blue-800",
            "Online Transfer": "bg-purple-100 text-purple-800",
            Cheque: "bg-green-100 text-green-800",
            Other: "bg-gray-100 text-gray-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            Active: "bg-green-100 text-green-700",
            Cancelled: "bg-red-100 text-red-700",
            Refunded: "bg-purple-100 text-purple-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Money Receipts</h2>
        <Link className="btn-primary" to="/new-money-receipt-entry">
          <FaPlus /> Add Money Receipt
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="money-receipt"
        path="money-receipt"
        searchConfig={{
          placeholder: "Search by Patient ID, Name or Mobile",
        }}
        filtersConfig={[
          {
            key: "paymentMode",
            label: "Payment Mode",
            type: "select",
            options: ["Cash", "Cheque", "Card", "Online Transfer", "Other"],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Cancelled", "Refunded"],
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

export default MoneyReceiptTable;
