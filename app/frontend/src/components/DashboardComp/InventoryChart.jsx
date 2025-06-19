// components/DashboardComp/InventoryChart.jsx
import React from "react";
import Chart from "react-apexcharts";

const InventoryChart = () => {
  const options = {
    chart: {
      height: 350,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ["#10B981", "#EF4444"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    xaxis: {
      categories: [
        "Paracetamol",
        "Amoxicillin",
        "Ibuprofen",
        "Omeprazole",
        "Atorvastatin",
        "Metformin",
        "Salbutamol",
      ],
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: [
      {
        seriesName: "Current Stock",
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#10B981",
        },
        labels: {
          style: {
            colors: "#10B981",
          },
          formatter: function (val) {
            return val + " units";
          },
        },
        title: {
          text: "Current Stock",
          style: {
            color: "#10B981",
            fontSize: "12px",
          },
        },
      },
      {
        seriesName: "Monthly Usage",
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#EF4444",
        },
        labels: {
          style: {
            colors: "#EF4444",
          },
          formatter: function (val) {
            return val + " units";
          },
        },
        title: {
          text: "Monthly Usage",
          style: {
            color: "#EF4444",
            fontSize: "12px",
          },
        },
      },
    ],
    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y + " units";
          }
          return y;
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  const series = [
    {
      name: "Current Stock",
      type: "column",
      data: [1200, 900, 1100, 800, 750, 950, 600],
    },
    {
      name: "Monthly Usage",
      type: "line",
      data: [850, 720, 950, 650, 600, 800, 500],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Medication Inventory Status
      </h3>
      <Chart options={options} series={series} type="line" height={350} />
      <div className="mt-4 text-sm text-gray-500 grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium text-green-600">Well Stocked:</p>
          <p>Paracetamol, Ibuprofen, Metformin</p>
        </div>
        <div>
          <p className="font-medium text-red-600">Needs Reorder:</p>
          <p>Omeprazole, Atorvastatin, Salbutamol</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryChart;
