// components/Dashboard/SectionHeader.jsx
import React from "react";

const SectionHeader = ({ title, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={`mb-4 p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm opacity-75">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
