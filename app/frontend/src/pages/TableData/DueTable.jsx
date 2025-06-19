import React, { useMemo } from "react";
import Table from "../../components/Table/Table";
import BackButton from "../../components/BackButton/BackButton";
import { dueData } from "../../assets/tableData";
import { calculateDueTotals } from "../../utils/totalFunc";
import { useNavigate } from "react-router-dom";

const DueTable = () => {
  const navigate = useNavigate();

  const handleShow = (rowData) => {
    const invoiceId = rowData.id || rowData._id;
    navigate(`/payment-detail/1`);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "registrationNo",
        header: "Registered No",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "totalBill",
        header: "Total Bill Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "totalPaid",
        header: "Total Payments",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "totalDue",
        header: "Total Due Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        header: "Payment Details",
        id: "view",
        cell: ({ row }) => (
          <button onClick={handleShow} className="btn-primary">
            View Details
          </button>
        ),
      },
    ],
    []
  );

  const totals = calculateDueTotals(dueData);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Due Lists
        </h2>
      </div>

      <Table data={dueData} columns={columns} />

      {/* Totals Summary */}
      <div className="mt-4 border-t pt-4 text-sm text-gray-700">
        <h3 className="font-semibold text-base mb-4">Summary Totals</h3>
        <div className="grid grid-cols-3 gap-4">
          <p>
            <strong>Total Bill Amount:</strong> ₹{totals.totalBill.toFixed(2)}
          </p>
          <p>
            <strong>Total Payments:</strong> ₹{totals.totalPaid.toFixed(2)}
          </p>
          <p>
            <strong>Total Due:</strong> ₹{totals.totalDue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DueTable;
