import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { nurseData, productGSTData } from "../../assets/tableData";
import { useGetProductEntries } from "../../feature/itemHooks/useSubProduct";
import Loader from "../../components/Loader/Loader";

const AllProductTable = () => {
  const { data, error, isLoading, isError } = useGetProductEntries();

  const columns = useMemo(
    () => [
      {
        accessorKey: "brand",
        header: "Brand",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "productName",
        header: "Product Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "shortDesc",
        header: "Short Description",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "hsnCode",
        header: "HSN Code",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "gst",
        header: "GST (%)",
        cell: (info) => `${info.getValue()}%`,
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
          Sub Products
        </h2>
        <Link className="btn-primary" to={"/new-product-entry"}>
          <FaPlus /> New Product
        </Link>
      </div>

      <Table data={data} columns={columns} path="sub-product" />
    </div>
  );
};

export default AllProductTable;
