import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetPrescriptions,
  useFilterPrescriptions,
  useSearchPrescriptions,
} from "../../feature/hooks/usePrescription";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const PrescriptionTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetPrescriptions,
    searchDataHook: useSearchPrescriptions,
    filterDataHook: useFilterPrescriptions,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "prescriptionNo",
        header: "Prescription No",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "admissionId",
        header: "Admission ID",
        cell: (info) => info.getValue() || "-",
      },
      {
        accessorKey: "prescriptionDate",
        header: "Prescription Date",
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
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const statusColors = {
            ACTIVE: "bg-green-100 text-green-800",
            COMPLETED: "bg-blue-100 text-blue-800",
            CANCELLED: "bg-red-100 text-red-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                statusColors[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "admission.patient.fullName",
        header: "Patient Name",
        cell: (info) => {
          const patient = info.row.original?.admission?.patient;
          return patient?.fullName || "-";
        },
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>
        <Link className="btn-primary" to={"/new-prescription"}>
          <FaPlus /> New Prescription
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="prescription"
        searchConfig={{
          placeholder: "Search by Prescription No or Patient Name...",
        }}
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["ACTIVE", "COMPLETED", "CANCELLED"],
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

export default PrescriptionTable;