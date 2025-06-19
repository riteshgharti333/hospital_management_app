import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";

import { useGetVouchers } from "../../feature/transectionHooks/useVoucher";

const VoucherTable = () => {

   const { data, isLoading } = useGetVouchers();

const columns = useMemo(
  () => [
    {
      accessorKey: "voucherDate",
      header: "Voucher Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "paymentFor",
      header: "Payment For",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "voucherType",
      header: "Voucher Type",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "vendorName",
      header: "Vendor Name",
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "paymentDate",
      header: "Payment Date",
      cell: (info) =>
        info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => {
        const value = info.getValue();
        return value ? `₹ ${parseFloat(value).toFixed(2)}` : "-";
      },
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
          case "Bank Transfer":
            badgeClass = "bg-blue-100 text-blue-800";
            break;
          case "Cheque":
            badgeClass = "bg-purple-100 text-purple-800";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
        }

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}
          >
            {value || "N/A"}
          </span>
        );
      },
    },
  ],
  []
);


  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Vouchers
        </h2>
        <Link className="btn-primary" to={"/new-voucher"}>
          <FaPlus /> New Voucher
        </Link>
      </div>

      <Table data={data} columns={columns} path="voucher" />
    </div>
  );
};

export default VoucherTable;
