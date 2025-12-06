import Chart from "react-apexcharts";
import { usePatientAgeDistribution } from "../../feature/dashboardHooks/useCharts";

const AgeDistribution = () => {
  const { data, isLoading } = usePatientAgeDistribution();

  if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  const groups = data.groups || {};
  const averageAge = data.averageAge || 0;
  const modeGroup = data.modeGroup || "N/A";
  const modeCount = data.modeCount || 0;

  const categories = Object.keys(groups);
  const counts = Object.values(groups);

  const options = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Number of Patients" },
    },
    grid: { borderColor: "#f1f1f1" },
    tooltip: {
      y: {
        formatter: (val) => `${val} patients`,
      },
    },
  };

  const series = [
    {
      name: "Patients",
      data: counts,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Age Distribution
        </h3>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
          Most: {modeGroup} yrs
        </span>
      </div>

      <Chart options={options} series={series} type="bar" height={300} />

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Average Age: <span className="font-semibold">{averageAge} years</span>
        </p>
        <p className="text-xs mt-1">
          Mode: <span className="font-semibold">{modeGroup}</span> age group (
          {modeCount} patients)
        </p>
      </div>
    </div>
  );
};

export default AgeDistribution;
