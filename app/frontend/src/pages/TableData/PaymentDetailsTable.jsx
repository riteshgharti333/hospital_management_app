import React, { useMemo } from "react";
import Table from "../../components/Table/Table";
import { paymentDetailsData } from "../../assets/tableData";
import BackButton from "../../components/BackButton/BackButton";

const PaymentDetailsTable = () => {
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
      {
        accessorKey: "invoiceNo",
        header: "Invoice No.",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "amount",
        header: "Payment Amount",
        cell: (info) => `₹${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: "mode",
        header: "Payment Mode",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const totalAmount = paymentDetailsData.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BackButton />
          Payment Details of Mr./Mrs test(8240692404)
        </h2>
      </div>

      <Table data={paymentDetailsData} columns={columns} />

      <div className="mt-4 border-t pt-4 text-sm text-gray-700">
        <h3 className="font-semibold text-base mb-4">Summary</h3>
        <p>
          <strong>Total Payment Amount:</strong> ₹{totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default PaymentDetailsTable;
