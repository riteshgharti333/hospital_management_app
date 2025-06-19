// components/DashboardComp/WaitTimeChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const WaitTimeChart = () => {
  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
          },
          value: {
            fontSize: '20px',
            fontWeight: 'bold',
            formatter: function(val) {
              return val + ' min';
            }
          },
          total: {
            show: true,
            label: 'Average',
            formatter: function() {
              return '42 min';
            }
          }
        }
      }
    },
    labels: ['Emergency', 'OPD', 'Lab Tests'],
    stroke: {
      lineCap: 'round'
    },
  };

  const series = [75, 60, 45];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Average Patient Wait Times</h3>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Today</span>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="radialBar" 
        height={350} 
      />
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="font-medium">Emergency</p>
          <p className="text-gray-500">↓ 12% from yesterday</p>
        </div>
        <div>
          <p className="font-medium">OPD</p>
          <p className="text-gray-500">↑ 5% from yesterday</p>
        </div>
        <div>
          <p className="font-medium">Lab Tests</p>
          <p className="text-gray-500">↓ 8% from yesterday</p>
        </div>
      </div>
    </div>
  );
};

export default WaitTimeChart;