import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetAdmissions,
  useSearchAdmissions,
  useFilterAdmissions,
} from "../../feature/hooks/useAdmisson";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  gender: "Gender",
  fromDate: "From Date",
  toDate: "To Date",
};

const AdmissionTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetAdmissions,
    searchDataHook: useSearchAdmissions,
    filterDataHook: useFilterAdmissions,
  });

  const columns = useMemo(
    () => [
      { accessorKey: "patient.fullName", header: "Name" },
      { accessorKey: "hospitalAdmissionId", header: "Admission ID" },
      { accessorKey: "patient.aadhaarNumber", header: "Aadhaar Number" },
      { accessorKey: "patient.gender", header: "Sex" },
      { accessorKey: "patient.mobileNumber", header: "Phone No." },
      { accessorKey: "doctor.fullName", header: "Doctor Name" },
      {
        accessorKey: "admissionDate",
        header: "Admission Date",
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
        accessorKey: "dischargeDate",
        header: "Discharge",
        cell: (info) => {
          const value = info.getValue();
          if (!value) return "-";
          const date = new Date(value);
          return isNaN(date)
            ? value
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
        },
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Admission Entries</h2>
        <Link className="btn-primary" to="/new-admission-entry">
          <FaPlus /> Enter Patient Admission
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="admission"
        searchConfig={{
          placeholder: "Search by Name, Admission ID or Aadhaar No",
        }}
        filtersConfig={[
          {
            key: "gender",
            label: "Gender",
            type: "select",
            options: ["Male", "Female", "Other"],
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

export default AdmissionTable;