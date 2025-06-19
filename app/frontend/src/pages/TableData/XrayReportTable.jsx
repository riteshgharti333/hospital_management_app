import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Table from "../../components/Table/Table";
import { billingData } from "../../assets/tableData";
import Loader from "../../components/Loader/Loader";
import { useGetXrayReports } from "../../feature/hooks/useXray";

const XrayReportTable = () => {
  const [doctor, setDoctor] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

    const { data, error, isLoading, isError } = useGetXrayReports();

  const columns = useMemo(
    () => [
      {
        accessorKey: "billDate",
        header: "Bill Date",
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
        accessorKey: "patientName",
        header: "Patient Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "patientMobile",
        header: "Mobile",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "patientSex",
        header: "Sex",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "patientAddress",
        header: "Address",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "referredDoctor",
        header: "Referred Doctor",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "testDate",
        header: "Test Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return isNaN(date)
            ? info.getValue()
            : date.toLocaleDateString("en-GB");
        },
      },
      {
        accessorKey: "reportDate",
        header: "Report Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return isNaN(date)
            ? info.getValue()
            : date.toLocaleDateString("en-GB");
        },
      },
      {
        accessorKey: "examDescription",
        header: "Exam Description",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "billAmount",
        header: "Bill Amount",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        accessorKey: "discount",
        header: "Discount (%)",
        cell: (info) => `${info.getValue()}%`,
      },
      {
        accessorKey: "netBillAmount",
        header: "Net Bill",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        accessorKey: "doctorEarning",
        header: "Doctor Earning",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        accessorKey: "commissionPercent",
        header: "Commission (%)",
        cell: (info) => `${info.getValue()}%`,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => handleDownloadPdf(row.original)}
            className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Download PDF
          </button>
        ),
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
          X-Ray Commission Report
        </h2>
        <Link className="btn-primary" to={"/xray/new-xray"}>
          <FaPlus /> New X-Ray
        </Link>
      </div>

      {/* Filters UI */}
           <div className="my-4 flex items-center gap-4">

        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="All">All Doctors</option>
          {Array.from(new Set(billingData.map((b) => b.referredDoctor))).map(
            (doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            )
          )}
        </select>

        <p>From</p>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <p>To</p>

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <button className="btn-primary w-fit">Submit</button>
      </div>

      <Table
        data={data}
        columns={columns}
        filters={{ doctor, fromDate, toDate }}
        path="xray"
      />
    </div>
  );
};

export default XrayReportTable;
