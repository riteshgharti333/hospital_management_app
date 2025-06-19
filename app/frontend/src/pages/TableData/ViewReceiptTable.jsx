import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { nurseData, paymentViewData } from "../../assets/tableData";

const ViewReceiptTable = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "receiptNo",
        header: "Money Receipt No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "patientName",
        header: "Patient Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "paymentMode",
        header: "Payment Mode",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "transactionMode",
        header: "Transaction Mode",
        cell: (info) => info.getValue(),
      },
      {
        header: "Action",
        id: "actionButtons",
        cell: ({ row }) => (
          <div className="flex gap-2 !px-2">
            <button
              className="btn-secondary"
              onClick={() => console.log("Format1", row.original)}
            >
              Format1
            </button>
            <button
              className="btn-secondary !px-2"
              onClick={() => console.log("Format2", row.original)}
            >
              Format2
            </button>
            <button
              className="btn-primary !px-2"
              onClick={() => console.log("Edit", row.original)}
            >
              Edit
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          View Money Receipt
        </h2>
        <Link className="btn-primary" to={"/new-money-receipt-entry"}>
          <FaPlus /> Add Money Receipt
        </Link>
      </div>

      <Table data={paymentViewData} columns={columns} />
    </div>
  );
};

export default ViewReceiptTable;
