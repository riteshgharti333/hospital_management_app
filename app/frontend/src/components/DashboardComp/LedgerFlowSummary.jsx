import React from "react";
import Chart from "react-apexcharts";
import { usePatientLedgerFlowSummary } from "../../feature/dashboardHooks/useCharts";

const LedgerFlowSummary = () => {
  const { data, isLoading } = usePatientLedgerFlowSummary();

  // ---------------- SKELETON LOADER ----------------
  const LedgerSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-4 w-52 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-40 bg-gray-200 rounded"></div>
        </div>

        <div className="flex space-x-4">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="h-[380px] w-full bg-gray-200 rounded mb-6"></div>

      {/* Ledger Cards Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-gray-100">
            <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
            <div className="h-6 w-20 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Footer Totals */}
      <div className="space-y-2">
        <div className="h-4 w-72 bg-gray-200 rounded"></div>
        <div className="h-3 w-60 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // ---------------- SHOW SKELETON WHEN LOADING OR NO DATA ----------------
  if (isLoading || !data) return <LedgerSkeleton />;

  // ---------------- REAL DATA ----------------
  const patient = data.ledgers.patient;
  const doctor = data.ledgers.doctor;
  const cash = data.ledgers.cash;
  const bank = data.ledgers.bank;

  const totals = data.totals;

  const series = [
    {
      name: "Money In",
      data: [patient.moneyIn, doctor.moneyIn, cash.moneyIn, bank.moneyIn],
    },
    {
      name: "Money Out",
      data: [patient.moneyOut, doctor.moneyOut, cash.moneyOut, bank.moneyOut],
    },
  ];

  const netBalances = [
    {
      name: "Patient Ledger",
      value: patient.netBalance,
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Doctor Ledger",
      value: doctor.netBalance,
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Cash Ledger",
      value: cash.netBalance,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Bank Ledger",
      value: bank.netBalance,
      color: "bg-purple-100 text-purple-800",
    },
  ];

  const format = (value) =>
    "₹" + Math.round(value).toLocaleString("en-IN");

  const options = {
    chart: {
      type: "bar",
      height: 400,
      stacked: true,
      toolbar: { show: true },
    },
    colors: ["#10B981", "#EF4444"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Patient Ledger", "Doctor Ledger", "Cash Ledger", "Bank Ledger"],
      labels: { style: { fontSize: "14px", fontWeight: 600 } },
    },
    yaxis: {
      title: { text: "Amount (₹)" },
      labels: {
        formatter: (val) => "₹" + (val / 1000).toFixed(0) + "k",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => "₹" + val.toLocaleString("en-IN"),
      },
    },
    legend: { position: "top", horizontalAlign: "center" },
    grid: { borderColor: "#f1f1f1" },
  };

  // ---------------- UI ----------------
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Ledger Flow Summary
          </h3>
          <p className="text-sm text-gray-600">
            Money In vs Money Out across different ledgers
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Money In</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Money Out</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <Chart options={options} series={series} type="bar" height={400} />

      {/* Net Balance Cards */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {netBalances.map((item, i) => (
          <div key={i} className={`${item.color} p-4 rounded-lg`}>
            <p className="text-sm font-medium mb-1">{item.name}</p>
            <p className="text-2xl font-bold">{format(item.value)}</p>
            <p className="text-xs mt-1 opacity-75">Net Balance</p>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Total Money In:{" "}
          <span className="font-semibold">{format(totals.totalMoneyIn)}</span>
          {" • "}
          Total Money Out:{" "}
          <span className="font-semibold">{format(totals.totalMoneyOut)}</span>
        </p>

        <p className="text-xs mt-1">
          Overall Net Balance:{" "}
          <span
            className={`font-semibold ${
              totals.overallNetBalance >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {format(totals.overallNetBalance)}
          </span>{" "}
          ({totals.overallNetBalance >= 0 ? "Positive" : "Negative"})
        </p>
      </div>
    </div>
  );
};

export default LedgerFlowSummary;
