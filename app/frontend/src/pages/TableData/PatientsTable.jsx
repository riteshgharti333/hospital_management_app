import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetPatients,
  useFilterPatients,
  useSearchPatients,
} from "../../feature/hooks/usePatient";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  gender: "Gender",
  fromDate: "From Date",
  toDate: "To Date",
};

const PatientsTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetPatients,
    searchDataHook: useSearchPatients,
    filterDataHook: useFilterPatients,
  });

  const columns = useMemo(
    () => [
      { accessorKey: "hospitalPatientId", header: "Patient ID" },
      { accessorKey: "fullName", header: "Name" },
      { accessorKey: "mobileNumber", header: "Mobile" },
      { accessorKey: "gender", header: "Gender" },
      { accessorKey: "aadhaarNumber", header: "Aadhaar" },
      {
        accessorKey: "createdAt",
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
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Patients Entries
        </h2>
        <Link className="btn-primary" to="/new-patient-register">
          <FaPlus /> Enter Patient Register
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="patient"
        searchConfig={{
          placeholder: "Search by Name, Mobile or Aadhaar...",
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

export default PatientsTable;