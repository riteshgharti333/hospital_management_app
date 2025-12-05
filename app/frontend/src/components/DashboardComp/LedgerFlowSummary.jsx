// components/Dashboard/Charts/LedgerFlowSummary.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const LedgerFlowSummary = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 400,
      stacked: true,
      toolbar: {
        show: true
      }
    },
    colors: ['#10B981', '#EF4444'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 6
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Patient Ledger', 'Doctor Ledger', 'Cash Ledger', 'Bank Ledger'],
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      title: {
        text: 'Amount (₹)'
      },
      labels: {
        formatter: function(val) {
          return '₹' + (val / 1000) + 'k';
        }
      }
    },
    fill: {
      opacity: 0.9
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return "₹" + val.toLocaleString('en-IN')
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  };

  const series = [
    {
      name: 'Money In',
      data: [1250000, 850000, 680000, 920000]
    },
    {
      name: 'Money Out',
      data: [980000, 720000, 450000, 680000]
    }
  ];

  const netBalances = [
    { name: 'Patient Ledger', value: '₹2.70L', color: 'bg-green-100 text-green-800' },
    { name: 'Doctor Ledger', value: '₹1.30L', color: 'bg-blue-100 text-blue-800' },
    { name: 'Cash Ledger', value: '₹2.30L', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Bank Ledger', value: '₹2.40L', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Ledger Flow Summary</h3>
          <p className="text-sm text-gray-600">Money In vs Money Out across different ledgers</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Money In</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Money Out</span>
          </div>
        </div>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="bar" 
        height={400} 
      />
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {netBalances.map((item, index) => (
          <div key={index} className={`${item.color} p-4 rounded-lg`}>
            <p className="text-sm font-medium mb-1">{item.name}</p>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-xs mt-1 opacity-75">Net Balance</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Total Money In: <span className="font-semibold">₹37.0L</span> • Total Money Out: <span className="font-semibold">₹28.3L</span></p>
        <p className="text-xs mt-1">Overall Net Balance: <span className="font-semibold text-green-600">₹8.7L</span> (Positive)</p>
      </div>
    </div>
  );
};

export default LedgerFlowSummary;