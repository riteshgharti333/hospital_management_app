// components/Dashboard/KPIStats.jsx
import React, { useState } from "react";
import {
  useAdmissionAnalytics,
  useBillStatusAnalytics,
  usePatientAnalytics,
  useRevenueAnalytics,
} from "../../feature/dashboardHooks/useCharts";

const KPIStats = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [timeRange, setTimeRange] = useState("3months");
  const [billStatus, setBillStatus] = useState("pending");
  const [activePatientsRange, setActivePatientsRange] = useState("3months");
  const [admissionsRange, setAdmissionsRange] = useState("3months");

  const { data: revenue } = useRevenueAnalytics();
  const { data: billByStatus } = useBillStatusAnalytics();
  const { data: patientStats } = usePatientAnalytics();
  const { data: admissionStats } = useAdmissionAnalytics();

  console.log(revenue);

  const stats = [
    {
      id: "revenue",
      baseTitle: "Revenue",
      value: revenue?.threeMonths,
      change: `${revenue?.percentChange}%`,
      trend: revenue?.percentChange >= 0 ? "up" : "down",
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
      type: "revenue",
      popupOptions: ["3 months", "6 months", "1 year", "Total"],
      currentOption: timeRange,
    },
    {
      id: "bills",
      baseTitle: "Bills",
      value: billByStatus?.pending,
      change: `${billByStatus?.pendingChange}%`,
      trend: billByStatus?.pendingChange >= 0 ? "up" : "down",
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
      type: "bills",
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
      value: patientStats?.threeMonths,
      change: patientStats?.percentChange,
      trend: patientStats?.percentChange >= 0 ? "up" : "down",
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      type: "patients",
      popupOptions: ["3 months", "6 months", "1 year", "Total"],
      currentOption: activePatientsRange,
    },
    {
      id: "admissions",
      baseTitle: "Admissions",
      value: admissionStats?.threeMonths,
      change: `${admissionStats?.percentChange}%`,
      trend: admissionStats?.percentChange >= 0 ? "up" : "down",
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
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      type: "admissions",
      popupOptions: ["3 months", "6 months", "1 year", "Total"],
      currentOption: admissionsRange,
    },
  ];

  const handleOptionSelect = (statId, option) => {
    // Convert option to lowercase and remove spaces for time-based options
    // Keep "Total" as "total" (lowercase) for consistency
    const normalizedOption = option.toLowerCase().replace(" ", "");

    switch (statId) {
      case "revenue":
        setTimeRange(normalizedOption);
        break;
      case "bills":
        setBillStatus(normalizedOption);
        break;
      case "patients":
        setActivePatientsRange(normalizedOption);
        break;
      case "admissions":
        setAdmissionsRange(normalizedOption);
        break;
    }
    setActivePopup(null);

    // Here you would typically make an API call to update the data based on the selected option
    console.log(`Selected ${option} for ${statId}`);
  };

  const getDisplayValue = (stat) => {
    // Helper function to normalize option for comparison
    const normalizeOption = (option) => option.toLowerCase().replace(" ", "");

    switch (stat.id) {
      case "revenue":
        const revenueData = {
          "3months": {
            value: revenue?.threeMonths,
            change: revenue?.percentChange,
            title: "3 Months Revenue",
          },
          "6months": {
            value: revenue?.sixMonths,
            change: revenue?.percentChange,
            title: "6 Months Revenue",
          },
          "1year": {
            value: revenue?.oneYear,
            change: revenue?.percentChange,
            title: "Yearly Revenue",
          },
          total: {
            value: revenue?.total,
            change: revenue?.percentChange,
            title: "Total Revenue",
          },
        };
        return revenueData[stat.currentOption] || revenueData["3months"];

      case "bills":
        const billsData = {
          pending: {
            value: billByStatus?.Pending,
            change: `${billByStatus?.PendingChange}%`,
            title: "Pending Bills",
          },
          partiallypaid: {
            value: billByStatus?.PartiallyPaid,
            change: `${billByStatus?.PartiallyPaidChange}%`,
            title: "Partially Paid Bills",
          },
          paid: {
            value: billByStatus?.Paid,
            change: `${billByStatus?.PaidChange}%`,
            title: "Paid Bills",
          },
          cancelled: {
            value: billByStatus?.Cancelled,
            change: `${billByStatus?.CancelledChange}%`,
            title: "Cancelled Bills",
          },
          refunded: {
            value: billByStatus?.Refunded,
            change: `${billByStatus?.RefundedChange}%`,
            title: "Refunded Bills",
          },
        };
        return billsData[stat.currentOption] || billsData["pending"];

      case "patients":
        const patientsData = {
          "3months": {
            value: patientStats?.threeMonths,
            change: patientStats?.percentChange,
            title: "3 Months Active Patients",
          },
          "6months": {
            value: patientStats?.sixMonths,
            change: patientStats?.percentChange,
            title: "6 Months Active Patients",
          },
          "1year": {
            value: patientStats?.oneYear,
            change: patientStats?.percentChange,
            title: "Yearly Active Patients",
          },
          total: {
            value: patientStats?.total,
            change: patientStats?.percentChange,
            title: "Total Active Patients",
          },
        };
        return patientsData[stat.currentOption] || patientsData["3months"];

      case "admissions":
        const admissionsData = {
          "3months": {
            value: admissionStats?.threeMonths,
            change: `${admissionStats?.percentChange}%`,
            title: "3 Months Admissions",
          },
          "6months": {
            value: admissionStats?.sixMonths,
            change: `${admissionStats?.percentChange}%`,
            title: "6 Months Admissions",
          },
          "1year": {
            value: admissionStats?.oneYear,
            change: `${admissionStats?.percentChange}%`,
            title: "Yearly Admissions",
          },
          total: {
            value: admissionStats?.total,
            change: `${admissionStats?.percentChange}%`,
            title: "Total Admissions",
          },
        };
        return admissionsData[stat.currentOption] || admissionsData["3months"];

      default:
        return {
          value: stat.value,
          change: stat.change,
          title: stat.baseTitle,
        };
    }
  };

  const getDisplayText = (stat) => {
    const displayValue = getDisplayValue(stat);
    return {
      title: displayValue.title,
      value: displayValue.value,
      change: displayValue.change,
    };
  };

  const getTrendDescription = (statId, currentOption) => {
    if (statId === "bills") {
      return "from previous month";
    }

    // For time-based stats, show comparison based on selection
    switch (currentOption) {
      case "3months":
        return "from previous month";
      case "6months":
        return "from previous month";
      case "1year":
        return "from previous month";
      case "total":
      default:
        return "from previous month";
    }
  };

  const togglePopup = (statId) => {
    setActivePopup(activePopup === statId ? null : statId);
  };

  // Close popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (activePopup && !event.target.closest(".popup-container")) {
        setActivePopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopup]);

  const renderPopup = (stat) => {
    if (activePopup !== stat.id) return null;

    // Helper function to check if option is active
    const isOptionActive = (option) => {
      const normalizedOption = option.toLowerCase().replace(" ", "");
      return stat.currentOption === normalizedOption;
    };

    return (
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 popup-container">
        <div className="py-1">
          {stat.popupOptions.map((option, index) => {
            const isActive = isOptionActive(option);
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(stat.id, option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  isActive
                    ? "text-blue-600 font-medium bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                {option}
                {isActive && (
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
            );
          })}
        </div>
      </div>
    );
  };

  const displayStats = stats.map((stat) => {
    const display = getDisplayText(stat);
    return { ...stat, ...display };
  });

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
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white group-hover:opacity-100 opacity-70"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">
                {stat.value}
              </p>
              <div
                className={`flex items-center text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {stat.change} {getTrendDescription(stat.id, stat.currentOption)}
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
