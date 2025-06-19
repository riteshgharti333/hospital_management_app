// components/DashboardComp/BedOccupancyChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const BedOccupancyChart = () => {
  const options = {
    chart: {
      type: 'donut',
    },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    labels: ['Occupied', 'Reserved', 'Available'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Beds',
              fontSize: '16px',
              formatter: () => '320',
            },
            value: {
              fontSize: '24px',
              fontWeight: 'bold',
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} beds`,
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = [245, 32, 43];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Bed Occupancy Status</h3>
      <Chart 
        options={options} 
        series={series} 
        type="donut" 
        height={350} 
      />
      <div className="mt-4 text-sm text-gray-500">
        <p>ICU Occupancy: 92% (46/50 beds)</p>
        <p>General Ward: 78% (199/255 beds)</p>
      </div>
    </div>
  );
};

export default BedOccupancyChart;