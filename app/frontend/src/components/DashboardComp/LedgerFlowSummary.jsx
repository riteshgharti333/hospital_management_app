import Chart from "react-apexcharts";
import { usePatientLedgerFlowSummary } from "../../feature/dashboardHooks/useCharts";

const LedgerFlowSummary = () => {
  const { data } = usePatientLedgerFlowSummary();

  if (!data) return null;

  // ================================
  // 1️⃣ EXTRACT LEDGER DATA FROM API
  // ================================
  const patient = data.ledgers.patient;
  const doctor = data.ledgers.doctor;
  const cash = data.ledgers.cash;
  const bank = data.ledgers.bank;

  const totals = data.totals;

  // -------------------------------
  // 2️⃣ BAR CHART SERIES
  // -------------------------------
  const series = [
    {
      name: "Money In",
      data: [
        patient.moneyIn,
        doctor.moneyIn,
        cash.moneyIn,
        bank.moneyIn,
      ],
    },
    {
      name: "Money Out",
      data: [
        patient.moneyOut,
        doctor.moneyOut,
        cash.moneyOut,
        bank.moneyOut,
      ],
    },
  ];

  // -------------------------------
  // 3️⃣ NET BALANCE CARDS
  // -------------------------------
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

  // Format amounts nicely
  const format = (amount) =>
    "₹" + Math.round(amount).toLocaleString("en-IN");

  // ================================
  // 4️⃣ CHART OPTIONS
  // ================================
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
      categories: [
        "Patient Ledger",
        "Doctor Ledger",
        "Cash Ledger",
        "Bank Ledger",
      ],
      labels: {
        style: { fontSize: "14px", fontWeight: 600 },
      },
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
        {netBalances.map((item, index) => (
          <div key={index} className={`${item.color} p-4 rounded-lg`}>
            <p className="text-sm font-medium mb-1">{item.name}</p>
            <p className="text-2xl font-bold">
              {format(item.value)}
            </p>
            <p className="text-xs mt-1 opacity-75">Net Balance</p>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Total Money In:{" "}
          <span className="font-semibold">
            {format(totals.totalMoneyIn)}
          </span>{" "}
          • Total Money Out:{" "}
          <span className="font-semibold">
            {format(totals.totalMoneyOut)}
          </span>
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
