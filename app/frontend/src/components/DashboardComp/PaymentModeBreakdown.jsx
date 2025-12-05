// components/Dashboard/Charts/PaymentModeBreakdown.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const PaymentModeBreakdown = () => {
  const options = {
    chart: {
      type: 'radialBar',
      height: 300
    },
    colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
          },
          value: {
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: 'Inter, sans-serif',
            formatter: function(val) {
              return val + "%";
            }
          },
          total: {
            show: true,
            label: 'Total Payments',
            formatter: function(w) {
              return '₹68.9L'
            }
          }
        }
      }
    },
    labels: ['Online Transfer', 'Card', 'Cash', 'Cheque', 'Other'],
    stroke: {
      lineCap: 'round'
    },
    legend: {
      show: false
    }
  };

  const series = [42, 28, 18, 8, 4];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Payment Mode Breakdown</h3>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">2024 Data</span>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="radialBar" 
        height={300} 
      />
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Online Transfer (42%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Card (28%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span>Cash (18%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span>Cheque (8%)</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModeBreakdown;