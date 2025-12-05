// components/DashboardComp/TodayAdmissionsCard.jsx
import React from 'react';

const TodayAdmissionsCard = () => {
  const todayAdmissions = [
    { time: '08:30', patient: 'John Smith', department: 'Emergency', status: 'Admitted' },
    { time: '10:15', patient: 'Maria Garcia', department: 'OPD', status: 'Processing' },
    { time: '11:45', patient: 'David Lee', department: 'Cardiology', status: 'Admitted' },
    { time: '14:20', patient: 'Sarah Johnson', department: 'Maternity', status: 'Admitted' },
    { time: '16:05', patient: 'Robert Chen', department: 'Orthopedics', status: 'Processing' }
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Admitted': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Discharged': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Today's Admissions</h3>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">{todayAdmissions.length}</p>
          <p className="text-sm text-gray-600">Total today</p>
        </div>
      </div>

      <div className="space-y-3">
        {todayAdmissions.map((admission, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">{admission.patient}</p>
                <p className="text-xs text-gray-600">{admission.department}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{admission.time}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(admission.status)}`}>
                {admission.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-gray-800">Emergency</p>
          <p className="text-xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="font-medium text-gray-800">OPD</p>
          <p className="text-xl font-bold text-green-600">2</p>
        </div>
      </div>
    </div>
  );
};

export default TodayAdmissionsCard;