import React, { useState } from "react";
import Chart from "react-apexcharts";
import { useBillMoneyStatusAnalytics } from "../../feature/dashboardHooks/useCharts";

const BillsByStatus = () => {
  const [activePopup, setActivePopup] = useState(false);
  const [timeRange, setTimeRange] = useState("threeMonths");

  const { data, isLoading } = useBillMoneyStatusAnalytics();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) return null;

  // The API response structure is:
  // { success, message, data: { threeMonths, sixMonths, oneYear, allTime } }
  const dataset = data.data || data;

  // Map UI selections → API keys
  const timeMap = {
    threeMonths: "threeMonths",
    sixMonths: "sixMonths",
    oneyear: "oneYear",
    alltime: "allTime",
  };

  const selectedKey = timeMap[timeRange];
  const selectedData = dataset[selectedKey];

  // Safety check
  if (!selectedData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-500">No data available for {selectedKey}</p>
      </div>
    );
  }

  const { statuses, percentages, counts, totalBills } = selectedData;

  const options = {
    chart: {
      type: "pie",
      height: 300,
    },
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
        formatter: (_, { seriesIndex }) =>
          `${counts[seriesIndex].toLocaleString()} bills`,
      },
    },
  };

  const handleTimeRangeSelect = (range) => {
    setTimeRange(range);
    setActivePopup(false);
  };

  const getTimeRangeText = () =>
    ({
      threeMonths: "3 Months",
      sixMonths: "6 Months",
      oneyear: "1 Year",
      alltime: "All Time",
    }[timeRange] || "3 Months");

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Bills by Status
          </h3>
          <p className="text-sm text-gray-500">Based on selected time period</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">
            {totalBills.toLocaleString()} total bills
          </span>

          <button
            onClick={() => setActivePopup(!activePopup)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart */}
      <Chart options={options} series={percentages} type="pie" height={300} />

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Selected period:</span>
          <span className="text-sm font-medium text-gray-800">{getTimeRangeText()}</span>
        </div>
      </div>

      {/* Popup */}
      {activePopup && (
        <div className="absolute top-10 right-4 bg-white shadow-lg rounded-lg w-40 border popup-container">
          {["threeMonths", "sixMonths", "oneyear", "alltime"].map((value) => (
            <button
              key={value}
              onClick={() => handleTimeRangeSelect(value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                timeRange === value ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`}
            >
              {
                {
                  threeMonths: "3 Months",
                  sixMonths: "6 Months",
                  oneyear: "1 Year",
                  alltime: "All Time",
                }[value]
              }
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillsByStatus;
