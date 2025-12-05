// components/Dashboard/Charts/BillsByStatus.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const BillsByStatus = () => {
  const options = {
    chart: {
      type: 'pie',
      height: 300
    },
    colors: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'],
    labels: ['Pending', 'Partially Paid', 'Paid', 'Cancelled', 'Refunded'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        },
        dataLabels: {
          offset: -10
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(1) + "%"
      },
      dropShadow: {
        enabled: false
      }
    },
    tooltip: {
      y: {
        formatter: function(val, { seriesIndex }) {
          const counts = [47, 28, 342, 15, 8];
          return counts[seriesIndex] + " bills"
        }
      }
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

  const series = [11, 6, 78, 3, 2];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Bills by Status</h3>
        <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">440 total bills</span>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="pie" 
        height={300} 
      />
    </div>
  );
};

export default BillsByStatus;