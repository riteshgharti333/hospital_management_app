// components/DashboardComp/RevenueChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const RevenueChart = () => {
  const options = {
    chart: {
      height: 350,
      type: 'treemap',
      toolbar: {
        show: false
      }
    },
    legend: {
      show: false
    },
    colors: [
      '#3B82F6',
      '#1D4ED8',
      '#2563EB',
      '#1E40AF',
      '#1E3A8A',
      '#93C5FD',
      '#60A5FA',
      '#3B82F6'
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
      },
      formatter: function(text, op) {
        return [text, op.value + 'K']
      },
      offsetY: -4
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return "$" + value + "K"
        }
      }
    }
  };

  const series = [{
    data: [
      {
        x: 'Inpatient Services',
        y: 230
      },
      {
        x: 'Outpatient Services',
        y: 180
      },
      {
        x: 'Diagnostic Tests',
        y: 150
      },
      {
        x: 'Surgical Procedures',
        y: 120
      },
      {
        x: 'Emergency Care',
        y: 90
      },
      {
        x: 'Pharmacy',
        y: 75
      },
      {
        x: 'Physical Therapy',
        y: 60
      },
      {
        x: 'Other Services',
        y: 45
      }
    ]
  }];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Revenue by Service (This Month)</h3>
        <span className="text-sm bg-green-50 text-green-600 px-2 py-1 rounded">↑ 18% from last month</span>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="treemap" 
        height={350} 
      />
      <div className="mt-4 text-sm text-gray-500">
        <p>Total Revenue: $950K (Target: $1M)</p>
      </div>
    </div>
  );
};

export default RevenueChart;