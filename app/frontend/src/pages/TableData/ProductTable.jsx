import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { nurseData, productData } from "../../assets/tableData";
import { useGetProducts } from "../../feature/itemHooks/useProduct";
import Loader from "../../components/Loader/Loader";

const ProductTable = () => {
  const { data, error, isLoading, isError } = useGetProducts();

  const columns = useMemo(
    () => [
      {
        accessorKey: "productName",
        header: "Product Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "productCode",
        header: "Product Code",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "parentCategory",
        header: "Parent Category",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "subCategory",
        header: "Sub Category",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "price",
        header: "Price (₹)",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        accessorKey: "taxRate",
        header: "Tax Rate (%)",
        cell: (info) => `${info.getValue()}%`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          let badgeClass = "";
          switch (value) {
            case "Active":
              badgeClass = "bg-green-100 text-green-700";
              break;
            case "Inactive":
              badgeClass = "bg-red-100 text-red-700";
              break;
          }
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}
            >
              {value}
            </span>
          );
        },
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
          Products Category
        </h2>
        <Link className="btn-primary" to={"/add-product-category"}>
          <FaPlus /> Add Product Category / Sub Category
        </Link>
      </div>

      <Table data={data} columns={columns} path="product" />
    </div>
  );
};

export default ProductTable;
