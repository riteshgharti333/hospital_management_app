// components/DashboardComp/StaffAvailabilityChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const StaffAvailabilityChart = () => {
  const options = {
    chart: {
      type: 'heatmap',
      toolbar: {
        show: false
      },
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#10B981"],
    xaxis: {
      type: 'category',
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      categories: ['6-9', '9-12', '12-3', '3-6', '6-9'],
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    grid: {
      padding: {
        right: 20
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " staff available";
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [{
              from: 0,
              to: 5,
              name: 'Critical',
              color: '#EF4444'
            },
            {
              from: 6,
              to: 10,
              name: 'Low',
              color: '#F59E0B'
            },
            {
              from: 11,
              to: 15,
              name: 'Medium',
              color: '#3B82F6'
            },
            {
              from: 16,
              to: 20,
              name: 'High',
              color: '#10B981'
            }
          ]
        }
      }
    }
  };

  const series = [{
    name: 'Nurses',
    data: [
      {x: 'Mon', y: '6-9', value: 18},
      {x: 'Mon', y: '9-12', value: 15},
      {x: 'Mon', y: '12-3', value: 12},
      {x: 'Mon', y: '3-6', value: 10},
      {x: 'Mon', y: '6-9', value: 8},
      {x: 'Tue', y: '6-9', value: 17},
      {x: 'Tue', y: '9-12', value: 14},
      {x: 'Tue', y: '12-3', value: 11},
      {x: 'Tue', y: '3-6', value: 9},
      {x: 'Tue', y: '6-9', value: 7},
      {x: 'Wed', y: '6-9', value: 19},
      {x: 'Wed', y: '9-12', value: 16},
      {x: 'Wed', y: '12-3', value: 13},
      {x: 'Wed', y: '3-6', value: 11},
      {x: 'Wed', y: '6-9', value: 9},
      {x: 'Thu', y: '6-9', value: 17},
      {x: 'Thu', y: '9-12', value: 14},
      {x: 'Thu', y: '12-3', value: 12},
      {x: 'Thu', y: '3-6', value: 10},
      {x: 'Thu', y: '6-9', value: 8},
      {x: 'Fri', y: '6-9', value: 15},
      {x: 'Fri', y: '9-12', value: 13},
      {x: 'Fri', y: '12-3', value: 10},
      {x: 'Fri', y: '3-6', value: 8},
      {x: 'Fri', y: '6-9', value: 6},
      {x: 'Sat', y: '6-9', value: 12},
      {x: 'Sat', y: '9-12', value: 10},
      {x: 'Sat', y: '12-3', value: 8},
      {x: 'Sat', y: '3-6', value: 6},
      {x: 'Sat', y: '6-9', value: 4},
      {x: 'Sun', y: '6-9', value: 10},
      {x: 'Sun', y: '9-12', value: 8},
      {x: 'Sun', y: '12-3', value: 6},
      {x: 'Sun', y: '3-6', value: 4},
      {x: 'Sun', y: '6-9', value: 2}
    ]
  }];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Staff Availability Heatmap</h3>
      <Chart 
        options={options} 
        series={series} 
        type="heatmap" 
        height={350} 
      />
      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>Critical (0-5)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>Low (6-10)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Medium (11-15)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>High (16-20)</span>
        </div>
      </div>
    </div>
  );
};

export default StaffAvailabilityChart;