import { useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Table from "../../components/Table/Table";
import { receiptData } from "../../assets/tableData";
import { useGetMoneyReceipts } from "../../feature/transectionHooks/useMoneyReceipt";
import Loader from "../../components/Loader/Loader";

const MoneyReceiptTable = () => {

  
      const { data, error, isLoading, isError } = useGetMoneyReceipts();
    
  

const columns = useMemo(
  () => [
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "patientName",
      header: "Patient Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "mobile",
      header: "Mobile No.",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "amount",
      header: "Amount (₹)",
      cell: (info) => `₹${info.getValue()}`,
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
      cell: (info) => {
        const value = info.getValue();
        let badgeClass = "";
        switch (value) {
          case "Cash":
            badgeClass = "bg-yellow-100 text-yellow-800";
            break;
          case "Card":
            badgeClass = "bg-blue-100 text-blue-800";
            break;
          case "UPI":
            badgeClass = "bg-green-100 text-green-800";
            break;
          case "Bank Transfer":
            badgeClass = "bg-purple-100 text-purple-800";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
        }
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}>
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: (info) => info.getValue(),
    },
  ],
  []
);


    if (isLoading) {
    return <Loader />;
  }


  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Money Receipts
        </h2>
        <Link className="btn-primary" to={"/new-money-receipt-entry"}>
          <FaPlus /> Add Money Receipt
        </Link>
      </div>

      <Table data={data} columns={columns} path="money-receipt"/>
    </div>
  );
};

export default MoneyReceiptTable;
