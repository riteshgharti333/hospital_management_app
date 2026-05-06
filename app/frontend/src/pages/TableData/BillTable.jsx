import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetBills,
  useSearchBills,
  useFilterBills,
} from "../../feature/transectionHooks/useBill";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  billType: "Bill Type",
  patientSex: "Gender",
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const BillTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetBills,
    searchDataHook: useSearchBills,
    filterDataHook: useFilterBills,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "billDate",
        header: "Bill Date",
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
      { accessorKey: "billType", header: "Type" },
      { accessorKey: "admission.hospitalAdmissionId", header: "Admission No" },
      { accessorKey: "patient.hospitalPatientId", header: "Patient ID" },
      { accessorKey: "patient.fullName", header: "Patient Name" },
      { accessorKey: "patient.mobileNumber", header: "Mobile" },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const colorMap = {
            Pending: "bg-yellow-100 text-yellow-700",
            PartiallyPaid: "bg-blue-100 text-blue-700",
            Paid: "bg-green-100 text-green-700",
            Cancelled: "bg-red-100 text-red-700",
            Refunded: "bg-purple-100 text-purple-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${colorMap[value] || ""}`}
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
        <h2 className="text-2xl font-bold text-gray-800">Bills</h2>
        <Link className="btn-primary" to="/new-bill-entry">
          <FaPlus /> New Bill
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="bill"
        searchConfig={{
          placeholder: "Search by Patient ID, Name or Mobile",
        }}
        filtersConfig={[
          {
            key: "billType",
            label: "Bill Type",
            type: "select",
            options: ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              "Pending",
              "PartiallyPaid",
              "Paid",
              "Cancelled",
              "Refunded",
            ],
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

export default BillTable;
