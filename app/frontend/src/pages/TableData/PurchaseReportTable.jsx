import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { billingData, invoiceData } from "../../assets/tableData";

const PurchaseReportTable = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

 const columns = useMemo(
  () => [
    {
      accessorKey: "manufacturer",
      header: "Manufacturer",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "invoiceDate",
      header: "Invoice Date",
      cell: (info) => {
        const rawDate = info.getValue();
        const formatted = new Date(rawDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return <span>{formatted}</span>;
      },
    },
    {
      accessorKey: "invoiceNo",
      header: "Invoice No",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "partNo",
      header: "Part No",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "invoiceQty",
      header: "Invoice Qty",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "taxableAmount",
      header: "Taxable Amount",
      cell: (info) => {
        const value = parseFloat(info.getValue() || 0);
        return (
          <span className="text-gray-700 font-medium">
            ₹ {value.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: "Operation",
      id: "actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original)}
          className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 px-3 py-1 rounded text-sm transition duration-300"
        >
          Delete
        </button>
      ),
    },
  ],
  []
);


  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Purchase Report
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

      <div className="">
        <h3 className="flex items-center gap-1"> <span className="text-blue-700 font-bold">Total : </span> <span className="font-bold text-2xl">30,000</span></h3>
      </div>
      </div>
    

      <Table
        data={invoiceData}
        columns={columns}
        filters={{ fromDate, toDate }}
      />
    </div>
  );
};

export default PurchaseReportTable;
