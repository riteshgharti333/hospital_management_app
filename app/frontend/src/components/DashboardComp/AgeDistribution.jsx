// components/Dashboard/Charts/AgeDistribution.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const AgeDistribution = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    colors: ['#10B981'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '60%',
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71+'],
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Patients'
      }
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " patients"
        }
      }
    }
  };

  const series = [{
    name: 'Patients',
    data: [85, 120, 185, 210, 175, 140, 95, 50]
  }];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Age Distribution</h3>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">Most: 31-40 yrs</span>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="bar" 
        height={300} 
      />
      <div className="mt-4 text-sm text-gray-600">
        <p>Average Age: <span className="font-semibold">38.5 years</span></p>
        <p className="text-xs mt-1">Mode: 31-40 age group (210 patients)</p>
      </div>
    </div>
  );
};

export default AgeDistribution;