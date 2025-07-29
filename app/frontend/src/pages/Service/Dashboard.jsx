// pages/Dashboard.jsx
import React from "react";
import Number from "../../components/DashboardComp/Number";
import PatientInflowChart from "../../components/DashboardComp/PatientInflowChart";
import DepartmentAdmissionsChart from "../../components/DashboardComp/DepartmentAdmissionsChart";
import PatientTypeChart from "../../components/DashboardComp/PatientTypeChart";
import BedOccupancyChart from "../../components/DashboardComp/BedOccupancyChart";
import WaitTimeChart from "../../components/DashboardComp/WaitTimeChart";
import StaffAvailabilityChart from "../../components/DashboardComp/StaffAvailabilityChart";
import RevenueChart from "../../components/DashboardComp/RevenueChart";
import InventoryChart from "../../components/DashboardComp/InventoryChart";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Hospital Dashboard
            </h1>
          </div>
          <div className="text-sm text-gray-600">
            Date:{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <div className="mb-6">
          <Number />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PatientInflowChart />
          <DepartmentAdmissionsChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <BedOccupancyChart />
          <WaitTimeChart />
          <StaffAvailabilityChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart />
          <InventoryChart />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <PatientTypeChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
