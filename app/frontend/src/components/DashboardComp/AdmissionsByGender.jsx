import React from "react";
import Chart from "react-apexcharts";
import { useAdmissionGenderDistribution } from "../../feature/dashboardHooks/useCharts";

const AdmissionsByGender = () => {
  const { data, isLoading } = useAdmissionGenderDistribution();

  if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  const total = data.totalAdmissions || 0;

  const male = data.male?.percentage || 0;
  const female = data.female?.percentage || 0;
  const other = data.other?.percentage || 0;

  const options = {
    chart: {
      type: "donut",
      height: 300,
    },
    colors: ["#3B82F6", "#EC4899", "#8B5CF6"],
    labels: ["Male", "Female", "Other"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => total.toLocaleString("en-IN"),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return `${opts.w.globals.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`;
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const series = [male, female, other];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Admissions by Gender
        </h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          All Time
        </span>
      </div>

      <Chart options={options} series={series} type="donut" height={300} />
    </div>
  );
};

export default AdmissionsByGender;
