// components/Dashboard/Charts/AdmissionsTrend.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const AdmissionsTrend = () => {
  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: {
        enabled: true
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Admissions'
      },
      labels: {
        formatter: function(val) {
          return Math.floor(val);
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " admissions";
        }
      }
    },
    markers: {
      size: 5,
      colors: ['#3B82F6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    }
  };

  const series = [{
    name: 'Admissions',
    data: [120, 135, 118, 145, 162, 178, 195, 210, 185, 170, 160, 175]
  }];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Admissions Trend (Monthly)</h3>
          <p className="text-sm text-gray-600">Patient inflow over the past year</p>
        </div>
        <div className="flex space-x-2">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">2024</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">+18.5% growth</span>
        </div>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={350} 
      />
    </div>
  );
};

export default AdmissionsTrend;