import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { billingData, provisionalData } from "../../assets/tableData";
import { FaTrash, FaEdit, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ProvisionalTable = () => {
  const [doctor, setDoctor] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  const handleEdit = (rowData) => {
  const invoiceId = rowData.id || rowData._id;
  navigate(`/invoice/1`);
};


  const columns = useMemo(
    () => [
      {
        accessorKey: "billNo",
        header: "Bill No",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "billDate",
        header: "Bill Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: "patientName",
        header: "Patient Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "phoneNo",
        header: "Phone No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: (info) => `₹${parseFloat(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "gstInvoice",
        header: "GST Invoice",
        cell: () => <button className="!px-2  btn-primary">Print</button>,
      },
      {
        accessorKey: "nonGstInvoice",
        header: "Non-GST Invoice",
        cell: () => <button className="!px-2  btn-primary">Print</button>,
      },
      {
        accessorKey: "laserInvoice",
        header: "Laser Invoice",
        cell: () => <button className="!px-2  btn-primary">Print</button>,
      },
      {
        accessorKey: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(row.original)}
              className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="text-red-600 cursor-pointer hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
      {
        accessorKey: "operation",
        header: "Operation",
        cell: () => (
          <button onClick={handleEdit} className="btn-primary !px-2">
            View Details
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
          Provisional Register Report
        </h2>
        {/* <Link className="btn-primary" to={"/xray/new-xray"}>
          <FaPlus /> New X-Ray
        </Link> */}
      </div>

      {/* Filters UI */}
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

      <Table
        data={provisionalData}
        columns={columns}
        path="invoice"
        filters={{ doctor, fromDate, toDate }}
      />
    </div>
  );
};

export default ProvisionalTable;
