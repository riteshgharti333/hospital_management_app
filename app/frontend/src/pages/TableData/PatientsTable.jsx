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
import { formatAge, formatDate } from "../../utils/format";

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
        accessorKey: "dateOfBirth",
        header: "Age",
        cell: (info) => formatAge(info.getValue()),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: (info) => formatDate(info.getValue()),
      },
    ],
    [],
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Patients Entries</h2>
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
