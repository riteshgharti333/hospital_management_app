import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetBirthRecords,
  useFilterBirthRecords,
  useSearchBirthRecords,
} from "../../feature/hooks/useBirth";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  babySex: "Baby Sex",
  deliveryType: "Delivery Type",
  fromDate: "From Date",
  toDate: "To Date",
};

const BirthTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetBirthRecords,
    searchDataHook: useSearchBirthRecords,
    filterDataHook: useFilterBirthRecords,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "birthDate",
        header: "Birth Date",
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
      { accessorKey: "birthTime", header: "Birth Time" },
      { accessorKey: "babySex", header: "Sex" },
      {
        accessorKey: "babyWeightKg",
        header: "Weight",
        cell: (info) => `${info.getValue()} kg`,
      },
      { accessorKey: "fathersName", header: "Father's Name" },
      { accessorKey: "mothersName", header: "Mother's Name" },
      { accessorKey: "mobileNumber", header: "Mobile No." },
      { accessorKey: "deliveryType", header: "Delivery Type" },
    ],
    []
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Birth Entries</h2>
        <Link className="btn-primary" to={"/new-birth-register"}>
          <FaPlus /> Enter Birth Register
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="birth"
        searchConfig={{
          placeholder: "Search by Father, Mother or Mobile No...",
        }}
        filtersConfig={[
          {
            key: "babySex",
            label: "Baby Sex",
            type: "select",
            options: ["Male", "Female", "Other"],
          },
          {
            key: "deliveryType",
            label: "Delivery Type",
            type: "select",
            options: ["Normal", "Cesarean", "Forceps", "Vacuum"],
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

export default BirthTable;