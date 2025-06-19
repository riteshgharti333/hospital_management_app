import Chart from 'react-apexcharts';

const PatientInflowChart = () => {
  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
    },
    colors: ['#4F46E5', '#10B981'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    grid: {
      borderColor: '#e9ecef',
      row: {
        colors: ['#f8f9fa', 'transparent'],
        opacity: 0.5
      },
    },
    markers: {
      size: 5,
      colors: ['#4F46E5', '#10B981'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Patients',
        style: {
          color: '#6b7280',
          fontSize: '12px',
        }
      },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        }
      },
      min: 0,
      max: 1200,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      markers: {
        width: 10,
        height: 10,
        radius: 0
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val) {
          return val + " patients";
        }
      }
    }
  };

  const series = [
    {
      name: 'Inpatients',
      data: [450, 520, 610, 580, 690, 710, 850, 920, 1010]
    },
    {
      name: 'Outpatients',
      data: [320, 410, 380, 490, 520, 580, 620, 710, 790]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Patient Inflow Trend</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg">Monthly</button>
          <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-lg">Weekly</button>
        </div>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="line" 
        height={350} 
      />
    </div>
  );
};

export default PatientInflowChart;