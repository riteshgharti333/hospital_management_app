import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { nurseData, pharmacistData, prescriptionData } from "../../assets/tableData";
import { useGetPrescriptions } from "../../feature/hooks/usePrescription";
import Loader from "../../components/Loader/Loader";

const PrescriptionTable = () => {

  const { data, error, isLoading, isError } = useGetPrescriptions();

  const columns = useMemo(
    () => [
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
        accessorKey: "doctorName",
        header: "Doctor Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "patientName",
        header: "Patient Name",
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Prescriptions
        </h2>
        <Link className="btn-primary" to={"/new-prescription"}>
          <FaPlus /> New Prescription
        </Link>
      </div>

      <Table data={data} columns={columns} path="prescription" />
    </div>
  );
};

export default PrescriptionTable;
