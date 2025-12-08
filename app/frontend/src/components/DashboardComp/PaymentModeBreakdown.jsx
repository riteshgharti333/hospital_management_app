import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { usePaymentModeAnalytics } from "../../feature/dashboardHooks/useCharts";

// --------------------------------------------
//  SKELETON OUTSIDE COMPONENT (CORRECT)
// --------------------------------------------
const PaymentModeSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-4 w-56 bg-gray-200 rounded"></div>
      <div className="flex items-center space-x-3">
        <div className="h-5 w-20 bg-gray-200 rounded"></div>
        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
      </div>
    </div>

    <div className="w-[280px] h-[280px] mx-auto bg-gray-200 rounded-full mb-6"></div>

    <div className="grid grid-cols-2 gap-3 text-xs">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentModeBreakdown = () => {
  // ---------------- HOOKS MUST ALWAYS BE HERE FIRST ----------------
  const [activePopup, setActivePopup] = useState(false);
  const [timeRange, setTimeRange] = useState("threeMonths");

  const { data: apiData, isLoading } = usePaymentModeAnalytics();

  // ❗ useEffect MUST be above early return
  useEffect(() => {
    const closePopup = (e) => {
      if (activePopup && !e.target.closest(".popup-container")) {
        setActivePopup(false);
      }
    };
    document.addEventListener("mousedown", closePopup);
    return () => document.removeEventListener("mousedown", closePopup);
  }, [activePopup]);

  // ---------------- EARLY RETURN (SAFE NOW) ----------------
  if (isLoading || !apiData) {
    return <PaymentModeSkeleton />;
  }

  // ---------------- NOW SAFE TO ACCESS DATA ----------------
  const displayLabel = {
    threeMonths: "3 Months",
    sixMonths: "6 Months",
    oneyear: "1 Year",
    alltime: "All Time",
  };

  const timeMap = {
    threeMonths: "threeMonths",
    sixMonths: "sixMonths",
    oneyear: "oneYear",
    alltime: "allTime",
  };

  const selectedKey = timeMap[timeRange];
  const selectedData = apiData[selectedKey];

  const { paymentModes, percentages, totalAmount } = selectedData;

  const options = {
    chart: { type: "radialBar", height: 300 },
    colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: "14px" },
          value: { fontSize: "20px", fontWeight: "bold", formatter: (v) => v + "%" },
          total: {
            show: true,
            label: "Total",
            formatter: () => "₹" + totalAmount.toLocaleString("en-IN"),
          },
        },
      },
    },
    labels: paymentModes,
  };

  const handleTimeRangeSelect = (range) => {
    setTimeRange(range);
    setActivePopup(false);
  };

  const renderPopup = () => {
    if (!activePopup) return null;

    const menuOptions = [
      { value: "threeMonths", label: "3 months" },
      { value: "sixMonths", label: "6 months" },
      { value: "oneyear", label: "1 year" },
      { value: "alltime", label: "All time" },
    ];

    return (
      <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border popup-container z-50">
        <div className="py-1">
          {menuOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTimeRangeSelect(opt.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between ${
                timeRange === opt.value
                  ? "text-blue-600 font-medium bg-blue-50"
                  : "text-gray-700"
              }`}
            >
              {opt.label}

              {timeRange === opt.value && (
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Payment Mode Breakdown</h3>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
            {displayLabel[timeRange]}
          </span>

          <button
            onClick={() => setActivePopup(!activePopup)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart */}
      <Chart options={options} series={percentages} type="radialBar" height={300} />

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {paymentModes.map((mode, idx) => {
          const colorMap = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"];
          return (
            <div key={idx} className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${colorMap[idx]}`}></div>
              <span>
                {mode} ({percentages[idx]}%)
              </span>
            </div>
          );
        })}
      </div>

      {/* Popup */}
      <div className="absolute top-10 right-4">{renderPopup()}</div>
    </div>
  );
};

export default PaymentModeBreakdown;
