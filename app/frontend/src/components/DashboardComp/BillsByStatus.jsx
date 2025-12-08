import React from "react";
import Chart from "react-apexcharts";
import { useBillMoneyStatusAnalytics } from "../../feature/dashboardHooks/useCharts";

const BillsByStatus = () => {
  const { data, isLoading } = useBillMoneyStatusAnalytics();

  // ---------------- SKELETON LOADER ----------------
  const BillsStatusSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
        <div className="h-5 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Pie Chart Placeholder */}
      <div className="h-[260px] w-[260px] bg-gray-200 rounded-full mx-auto mb-6"></div>

      {/* Summary placeholder */}
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Show skeleton while loading
  if (isLoading || !data) {
    return <BillsStatusSkeleton />;
  }

  // ---------------- REAL DATA ----------------
  const d = data;

  const statuses = ["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"];
  const counts = statuses.map((s) => d[s] || 0);
  const totalBills = counts.reduce((a, b) => a + b, 0);

  const percentages =
    totalBills > 0
      ? counts.map((c) => Number(((c / totalBills) * 100).toFixed(2)))
      : [0, 0, 0, 0, 0];

  const options = {
    chart: { type: "pie", height: 300 },
    colors: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6"],
    labels: statuses,
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(1) + "%",
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) =>
          `${counts[seriesIndex].toLocaleString()} bills`,
      },
    },
  };

  // ---------------- UI ----------------
  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Bills by Status</h3>

        <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">
          {totalBills.toLocaleString()} total bills
        </span>
      </div>

      {/* Chart */}
      <Chart options={options} series={percentages} type="pie" height={300} />

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {statuses.map((s, i) => (
          <div key={s} className="flex justify-between text-sm mb-1">
            <span>{s}</span>
            <span>
              {counts[i].toLocaleString()} ({percentages[i]}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsByStatus;
