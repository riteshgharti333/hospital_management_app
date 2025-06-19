import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  billingData,
  invoiceData,
  viewInvoiceData,
} from "../../assets/tableData";
import BackButton from "../../components/BackButton/BackButton";
import { FaEdit } from "react-icons/fa";
import { calculateTotals } from "../../utils/totalFunc";

const ViewInvoiceTable = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const columns = useMemo(
    () => [
      {
        accessorKey: "product",
        header: "Product",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "hsnCode",
        header: "HSN Code",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "serialCode",
        header: "Serial Code",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "mrp",
        header: "MRP/Unit",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "discount",
        header: "Discount",
        cell: (info) => `${info.getValue()}%`,
      },
      {
        accessorKey: "rate",
        header: "Rate/Unit",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "taxableAmount",
        header: "Taxable Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "gstPercent",
        header: "GST%",
        cell: (info) => `${info.getValue()}%`,
      },
      {
        accessorKey: "totalGstAmount",
        header: "Total GST Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "cgstAmount",
        header: "CGST Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        header: "Operation",
        id: "edit",
        cell: ({ row }) => (
          <button
            onClick={() => {
              // Replace with actual handler
              console.log("Edit clicked for", row.original);
            }}
            className="btn-primary "
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  const totals = calculateTotals(viewInvoiceData);

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BackButton />
          Sale Invoice Details Of ANH/00005
        </h2>
        {/* <Link className="btn-primary" to={"/xray/new-xray"}>
          <FaPlus /> New X-Ray
        </Link> */}
      </div>

      {/* Filters UI */}

      <div className="flex items-center justify-between">
        <div className="my-4 flex items-center gap-4">
          <p>From</p>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <p>To</p>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />

          <button className="btn-primary w-fit">Submit</button>
        </div>
      </div>

      <Table
        data={viewInvoiceData}
        columns={columns}
        filters={{ fromDate, toDate }}
      />

      {/* Totals Summary */}
      <div className="mt-4 border-t pt-4 text-sm text-gray-700">
        <h3 className="font-semibold text-base mb-4">Summary Totals</h3>
        <div className="grid grid-cols-3 gap-4">
          <p>
            <strong>Total Quantity:</strong> {totals.quantity}
          </p>
          <p>
            <strong>Total MRP:</strong> ₹{totals.mrp.toFixed(2)}
          </p>
          <p>
            <strong>Total Rate:</strong> ₹{totals.rate.toFixed(2)}
          </p>
          <p>
            <strong>Taxable Amount:</strong> ₹{totals.taxableAmount.toFixed(2)}
          </p>
          <p>
            <strong>Total GST:</strong> ₹{totals.totalGstAmount.toFixed(2)}
          </p>
          <p>
            <strong>CGST Amount:</strong> ₹{totals.cgstAmount.toFixed(2)}
          </p>
          <p>
            <strong>Final Total Amount:</strong> ₹
            {totals.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceTable;
