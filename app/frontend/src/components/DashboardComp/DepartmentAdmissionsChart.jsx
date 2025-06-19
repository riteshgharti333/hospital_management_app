import Chart from 'react-apexcharts';

const DepartmentAdmissionsChart = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: {
        show: false
      },
    },
    colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    grid: {
      borderColor: '#e9ecef',
      row: {
        colors: ['#f8f9fa', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Oncology', 'General'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Admissions',
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
    fill: {
      opacity: 1
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val) {
          return val + " admissions";
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
    }
  };

  const series = [
    {
      name: 'Current Month',
      data: [44, 55, 41, 37, 22, 43]
    },
    {
      name: 'Previous Month',
      data: [38, 48, 35, 29, 18, 36]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Admissions by Department</h3>
        <select className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-lg border border-gray-200">
          <option>Last 30 days</option>
          <option>Last 60 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="bar" 
        height={350} 
      />
    </div>
  );
};

export default DepartmentAdmissionsChart;