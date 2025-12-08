// components/Dashboard/KPIStats.jsx
import React, { useState, useEffect } from "react";
import {
  useAdmissionAnalytics,
  useBillStatusAnalytics,
  usePatientAnalytics,
  useRevenueAnalytics,
} from "../../feature/dashboardHooks/useCharts";

// -----------------------------------------------
//   PREMIUM KPI SKELETON (OUTSIDE COMPONENT)
// -----------------------------------------------
const KPISkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-32 bg-gray-300 rounded mb-3"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="ml-3 p-4 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------------
//   MAIN KPI COMPONENT
// -----------------------------------------------
const KPIStats = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [timeRange, setTimeRange] = useState("3months");
  const [billStatus, setBillStatus] = useState("pending");
  const [activePatientsRange, setActivePatientsRange] = useState("3months");
  const [admissionsRange, setAdmissionsRange] = useState("3months");

  const { data: revenue, isLoading: isRevenueLoading } = useRevenueAnalytics();
  const { data: billByStatus, isLoading: isBillStatusLoading } =
    useBillStatusAnalytics();
  const { data: patientStats, isLoading: isPatientStatsLoading } =
    usePatientAnalytics();
  const { data: admissionStats, isLoading: isAdmissionStatsLoading } =
    useAdmissionAnalytics();

  // -----------------------------------------------
  //   SHOW SKELETON WHILE ANY DATA IS LOADING
  // -----------------------------------------------
  const isLoading =
    isRevenueLoading ||
    isBillStatusLoading ||
    isPatientStatsLoading ||
    isAdmissionStatsLoading;

  // FIXED: Moved useEffect before any conditional returns
  // -----------------------------------------------
  // POPUP CLOSE LOGIC
  // -----------------------------------------------
  useEffect(() => {
    const closePopup = (e) => {
      if (activePopup && !e.target.closest(".popup-container")) {
        setActivePopup(null);
      }
    };

    // Only add event listener if there's an active popup
    if (activePopup) {
      document.addEventListener("mousedown", closePopup);
    }

    return () => {
      document.removeEventListener("mousedown", closePopup);
    };
  }, [activePopup]); // Dependency on activePopup

  if (isLoading) return <KPISkeleton />;

  // -----------------------------------------------
  //   HELPER FORMAT
  // -----------------------------------------------
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹0";
    if (value >= 10000000) return "₹" + (value / 10000000).toFixed(1) + "Cr";
    if (value >= 100000) return "₹" + (value / 100000).toFixed(1) + "L";
    if (value >= 1000) return "₹" + (value / 1000).toFixed(1) + "k";
    return "₹" + value.toLocaleString("en-IN");
  };

  // -----------------------------------------------
  //   KPIs CONFIG ARRAY
  // -----------------------------------------------
  const stats = [
    {
      id: "revenue",
      baseTitle: "Revenue",
      value: formatCurrency(revenue?.threeMonths),
      change: `${revenue?.percentChange || 0}%`,
      trend: (revenue?.percentChange || 0) >= 0 ? "up" : "down",
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      popupOptions: ["3 months", "6 months", "1 year", "Total"],
      currentOption: timeRange,
    },

    {
      id: "bills",
      baseTitle: "Bills",
      value: billByStatus?.Pending || 0,
      change: `${billByStatus?.PendingChange || 0}%`,
      trend: (billByStatus?.PendingChange || 0) >= 0 ? "up" : "down",
      icon: (
        <svg
          className="w-6 h-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      popupOptions: [
        "Pending",
        "PartiallyPaid",
        "Paid",
        "Cancelled",
        "Refunded",
      ],
      currentOption: billStatus,
    },

    {
      id: "patients",
      baseTitle: "Active Patients",
      value: patientStats?.threeMonths || 0,
      change: patientStats?.percentChange || 0,
      trend: (patientStats?.percentChange || 0) >= 0 ? "up" : "down",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
          />
        </svg>
      ),
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      popupOptions: ["3 months", "6 months", "1 year", "Total"],
      currentOption: activePatientsRange,
    },

    {
      id: "admissions",
      baseTitle: "Admissions",
      value: admissionStats?.threeMonths || 0,
      change: `${admissionStats?.percentChange || 0}%`,
      trend: (admissionStats?.percentChange || 0) >= 0 ? "up" : "down",
      icon: (
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3M10 4a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0"
          />
        </svg>
      ),
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      popupOptions: ["3 months", "6 months", "1 year", "Total"],
      currentOption: admissionsRange,
    },
  ];

  // -----------------------------------------------
  // POPUP & OPTION SELECT LOGIC
  // -----------------------------------------------
  const handleOptionSelect = (statId, option) => {
    const normalized = option.toLowerCase().replace(" ", "");

    if (statId === "revenue") setTimeRange(normalized);
    if (statId === "bills") setBillStatus(normalized);
    if (statId === "patients") setActivePatientsRange(normalized);
    if (statId === "admissions") setAdmissionsRange(normalized);

    setActivePopup(null);
  };

  // Toggle popup function (missing in your original code)
  const togglePopup = (statId) => {
    setActivePopup(activePopup === statId ? null : statId);
  };

  const getDisplayValue = (stat) => {
    switch (stat.id) {
      case "revenue":
        return (
          {
            "3months": {
              value: formatCurrency(revenue?.threeMonths),
              change: revenue?.percentChange || 0,
              title: "3 Months Revenue",
            },
            "6months": {
              value: formatCurrency(revenue?.sixMonths),
              change: revenue?.percentChange || 0,
              title: "6 Months Revenue",
            },
            "1year": {
              value: formatCurrency(revenue?.oneYear),
              change: revenue?.percentChange || 0,
              title: "Yearly Revenue",
            },
            total: {
              value: formatCurrency(revenue?.total),
              change: revenue?.percentChange || 0,
              title: "Total Revenue",
            },
          }[stat.currentOption] || {
            value: "₹0",
            change: 0,
            title: stat.baseTitle,
          }
        );

      case "bills":
        return (
          {
            pending: {
              value: billByStatus?.Pending || 0,
              change: billByStatus?.PendingChange || 0,
              title: "Pending Bills",
            },
            partiallypaid: {
              value: billByStatus?.PartiallyPaid || 0,
              change: billByStatus?.PartiallyPaidChange || 0,
              title: "Partially Paid Bills",
            },
            paid: {
              value: billByStatus?.Paid || 0,
              change: billByStatus?.PaidChange || 0,
              title: "Paid Bills",
            },
            cancelled: {
              value: billByStatus?.Cancelled || 0,
              change: billByStatus?.CancelledChange || 0,
              title: "Cancelled Bills",
            },
            refunded: {
              value: billByStatus?.Refunded || 0,
              change: billByStatus?.RefundedChange || 0,
              title: "Refunded Bills",
            },
          }[stat.currentOption] || {
            value: 0,
            change: 0,
            title: stat.baseTitle,
          }
        );

      case "patients":
        return (
          {
            "3months": {
              value: patientStats?.threeMonths || 0,
              change: patientStats?.percentChange || 0,
              title: "3 Months Active Patients",
            },
            "6months": {
              value: patientStats?.sixMonths || 0,
              change: patientStats?.percentChange || 0,
              title: "6 Months Active Patients",
            },
            "1year": {
              value: patientStats?.oneYear || 0,
              change: patientStats?.percentChange || 0,
              title: "Yearly Active Patients",
            },
            total: {
              value: patientStats?.total || 0,
              change: patientStats?.percentChange || 0,
              title: "Total Active Patients",
            },
          }[stat.currentOption] || {
            value: 0,
            change: 0,
            title: stat.baseTitle,
          }
        );

      case "admissions":
        return (
          {
            "3months": {
              value: admissionStats?.threeMonths || 0,
              change: admissionStats?.percentChange || 0,
              title: "3 Months Admissions",
            },
            "6months": {
              value: admissionStats?.sixMonths || 0,
              change: admissionStats?.percentChange || 0,
              title: "6 Months Admissions",
            },
            "1year": {
              value: admissionStats?.oneYear || 0,
              change: admissionStats?.percentChange || 0,
              title: "Yearly Admissions",
            },
            total: {
              value: admissionStats?.total || 0,
              change: admissionStats?.percentChange || 0,
              title: "Total Admissions",
            },
          }[stat.currentOption] || {
            value: 0,
            change: 0,
            title: stat.baseTitle,
          }
        );

      default:
        return stat;
    }
  };

  const displayStats = stats.map((stat) => ({
    ...stat,
    ...getDisplayValue(stat),
  }));

  const renderPopup = (stat) => {
    if (activePopup !== stat.id) return null;

    const isActive = (option) =>
      stat.currentOption === option.toLowerCase().replace(" ", "");

    return (
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 popup-container">
        <div className="py-1">
          {stat.popupOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(stat.id, option)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between
                ${
                  isActive(option)
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-gray-700"
                }`}
            >
              {option}
              {isActive(option) && (
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // -----------------------------------------------
  // FINAL UI
  // -----------------------------------------------
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
      {displayStats.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 hover:shadow-md transition-shadow relative group`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-600 font-medium">
                  {stat.title}
                </p>

                <button
                  onClick={() => togglePopup(stat.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v.01M12 12v.01M12 19v.01"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-2xl font-bold text-gray-800 mb-2">
                {stat.value}
              </p>

              <div
                className={`flex items-center text-[13px] 
                ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.trend === "up" ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 010-1.414l4-4a1 1 011.414 0l4 4a1 1 01-1.414 1.414L11 7.414V15a1 1 11-2 0V7.414L6.707 9.707a1 1 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 010 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 111.414-1.414L9 12.586V5a1 1 112 0v7.586l2.293-2.293a1 1 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {stat.change}% from previous month
              </div>
            </div>

            <div className="ml-3 p-2 bg-white rounded-lg shadow-sm">
              {stat.icon}
            </div>
          </div>

          {/* Popup Menu */}
          <div className="absolute top-0 right-0">{renderPopup(stat)}</div>
        </div>
      ))}
    </div>
  );
};

export default KPIStats;
