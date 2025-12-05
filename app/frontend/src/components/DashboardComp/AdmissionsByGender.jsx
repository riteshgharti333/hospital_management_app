// components/Dashboard/Charts/AdmissionsByGender.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const AdmissionsByGender = () => {
  const options = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#3B82F6', '#EC4899', '#8B5CF6'],
    labels: ['Male', 'Female', 'Other'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function(w) {
                return '1,248'
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return opts.w.globals.labels[opts.seriesIndex] + ": " + val.toFixed(1) + "%"
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

  const series = [55, 42, 3];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Admissions by Gender</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">All Time</span>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="donut" 
        height={300} 
      />
    </div>
  );
};

export default AdmissionsByGender;