import React from "react";
import Chart from "react-apexcharts";
import { useAdmissionMonthlyTrend } from "../../feature/dashboardHooks/useCharts";

const AdmissionsTrend = () => {
  const { data, isLoading } = useAdmissionMonthlyTrend();

  // ---------------- SKELETON LOADER (Inline) ----------------
  const ChartSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-28 bg-gray-200 rounded"></div>
        </div>

        <div className="flex space-x-2">
          <div className="h-5 w-12 bg-gray-200 rounded"></div>
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="h-[350px] w-full bg-gray-200 rounded"></div>
    </div>
  );

  // Show skeleton while loading
  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data) return null;

  // ---------------- REAL DATA ----------------
  const months = data.months;
  const counts = data.counts;
  const percentChange = data.growth?.percentChange || 0;

  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: { enabled: true },
    },
    colors: ["#3B82F6"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: months,
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Number of Admissions" },
      labels: { formatter: (val) => Math.floor(val) },
    },
    grid: { borderColor: "#f1f1f1" },
    tooltip: {
      y: {
        formatter: (val) => `${val} admissions`,
      },
    },
    markers: {
      size: 5,
      colors: ["#3B82F6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
  };

  const series = [
    {
      name: "Admissions",
      data: counts,
    },
  ];

  // ---------------- REAL UI ----------------
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Admissions Trend (Monthly)
          </h3>
          <p className="text-sm text-gray-600">
            Patient inflow over current year
          </p>
        </div>

        <div className="flex space-x-2">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
            {new Date().getFullYear()}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded ${
              percentChange >= 0
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {percentChange >= 0 ? "+" : ""}
            {percentChange}% growth last 6 months
          </span>
        </div>
      </div>

      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default AdmissionsTrend;
