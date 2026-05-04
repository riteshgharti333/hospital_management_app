import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetAppointments,
  useFilterAppointments,
  useSearchAppointments,
} from "../../feature/hooks/useAppointment";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  status: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const AppointmentTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetAppointments,
    searchDataHook: useSearchAppointments,
    filterDataHook: useFilterAppointments,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "appointmentDate",
        header: "Appointment Date",
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
      { accessorKey: "appointmentTime", header: "Appointment Time" },
      {
        accessorKey: "doctor.fullName",
        header: "Doctor Name",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const map = {
            BOOKED: "bg-blue-100 text-blue-700",
            CANCELLED: "bg-red-100 text-red-700",
            EXPIRED: "bg-gray-100 text-gray-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                map[value] || ""
              }`}
            >
              {value === "BOOKED"
                ? "Booked"
                : value === "CANCELLED"
                  ? "Cancelled"
                  : value === "EXPIRED"
                    ? "Expired"
                    : value}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <Link className="btn-primary" to={"/new-appointment"}>
          <FaPlus /> New Appointment
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="appointment"
        searchConfig={{
          placeholder: "Search by Doctor Name",
        }}
        filtersConfig={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: ["BOOKED", "CANCELLED", "EXPIRED"],
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

export default AppointmentTable;