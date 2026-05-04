import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import {
  useGetCashAccounts,
  useFilterCashAccounts,
  useSearchCashAccounts,
} from "../../feature/hooks/useCash";
import { useTableController } from "../../feature/hooks/useTableController";

const filterLabels = {
  isActive: "Status",
  fromDate: "From Date",
  toDate: "To Date",
};

const CashTable = () => {
  // Controller handles ALL logic
  const controller = useTableController({
    normalDataHook: useGetCashAccounts,
    searchDataHook: useSearchCashAccounts,
    filterDataHook: useFilterCashAccounts,
  });

  const columns = useMemo(
    () => [
      { accessorKey: "code", header: "Cash Account Code" },
      { accessorKey: "cashName", header: "Cash Account Name" },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                value
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {value ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => {
          const date = new Date(info.getValue());
          return isNaN(date)
            ? "-"
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
        },
      },
    ],
    [],
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Cash Accounts</h2>
        <Link className="btn-primary" to={"/new-cash"}>
          <FaPlus /> New Cash Account
        </Link>
      </div>

      <Table
        {...controller}
        columns={columns}
        path="cash"
        searchConfig={{
          placeholder: "Search by Cash Account Name or Code...",
        }}
        filtersConfig={[
          {
            key: "isActive",
            label: "Status",
            type: "select",
            options: ["Active", "Inactive"],
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

export default CashTable;
