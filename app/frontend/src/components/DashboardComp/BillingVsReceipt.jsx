import Chart from "react-apexcharts";
import { useBillingVsReceipt } from "../../feature/dashboardHooks/useCharts";

const BillingVsReceipt = () => {
  const { data, isLoading } = useBillingVsReceipt();

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p>Loading...</p>
      </div>
    );
  }

  const {
    billingMonthly,
    receiptMonthly,
    totalBilling,
    totalReceipt,
    year,
  } = data;

  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: false,
      toolbar: { show: true },
    },
    colors: ["#3B82F6", "#10B981"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Amount (₹)",
        style: { fontSize: "14px" },
      },
      labels: {
        formatter: (value) => `₹${(value / 1000).toFixed(0)}k`,
      },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val) => "₹" + val.toLocaleString("en-IN"),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    grid: { borderColor: "#f1f1f1" },
  };

  const series = [
    {
      name: "Billing Amount",
      data: billingMonthly || [],
    },
    {
      name: "Money Receipt",
      data: receiptMonthly || [],
    },
  ];

  const formatLakh = (num) =>
    "₹" + (num / 100000).toFixed(2) + "L";

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Monthly Billing vs Money Receipt
          </h3>
          <p className="text-sm text-gray-600">
            Comparative analysis of billed amount vs actual receipts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Billing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Receipts</span>
          </div>
        </div>
      </div>

      <Chart options={options} series={series} type="bar" height={350} />

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-blue-800">
            Total Billed ({year})
          </p>
          <p className="text-2xl font-bold">
            {formatLakh(totalBilling)}
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <p className="font-medium text-green-800">
            Total Received ({year})
          </p>
          <p className="text-2xl font-bold">
            {formatLakh(totalReceipt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingVsReceipt;
