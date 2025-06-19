import Chart from 'react-apexcharts';

const PatientTypeChart = () => {
  const options = {
    chart: {
      height: 350,
      type: 'area',
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
    },
    colors: ['#4F46E5', '#10B981'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    grid: {
      borderColor: '#e9ecef',
      row: {
        colors: ['#f8f9fa', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
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
      }
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
      data: [31, 40, 28, 51, 42, 65, 70]
    },
    {
      name: 'Outpatients',
      data: [110, 125, 98, 140, 132, 150, 165]
    }
  ];

  return (
    <div className="bg-[#f1f1f1] rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Inpatients vs Outpatients</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg">Weekly</button>
          <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-lg">Daily</button>
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

export default PatientTypeChart;