import { useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Table from "../../components/Table/Table";
import { bedData, billData } from "../../assets/tableData";
import { useGetBills } from "../../feature/transectionHooks/useBill";
import Loader from "../../components/Loader/Loader";

const BillTable = () => {

    const { data, error, isLoading, isError } = useGetBills();
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "billDate",
        header: "Bill Date",
      },
      {
        accessorKey: "billType",
        header: "Bill Type",
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
      },
      {
        accessorKey: "admissionNo",
        header: "Admission No",
      },
      {
        accessorKey: "admissionDate",
        header: "Admission Date",
      },
      {
        accessorKey: "dob",
        header: "Date of Birth",
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      {
        accessorKey: "dischargeDate",
        header: "Discharge Date",
      },
      {
        accessorKey: "doctorName",
        header: "Doctor Name",
      },
      {
        accessorKey: "wardNo",
        header: "Ward No",
      },
      {
        accessorKey: "bedNo",
        header: "Bed No",
      },
      {
        accessorKey: "address",
        header: "Address",
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
          Bills
        </h2>
        <Link className="btn-primary" to={"/new-bill-entry"}>
          <FaPlus /> New Bill
        </Link>
      </div>

      <Table data={data} columns={columns} path="bill"/>
    </div>
  );
};

export default BillTable;
