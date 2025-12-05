// components/DashboardComp/ActivePatientsCard.jsx
import React from 'react';

const ActivePatientsCard = () => {
  const wards = [
    { name: 'General Ward', count: 65, capacity: 80, color: 'blue' },
    { name: 'ICU', count: 24, capacity: 30, color: 'red' },
    { name: 'Pediatrics', count: 32, capacity: 40, color: 'green' },
    { name: 'Maternity', count: 28, capacity: 35, color: 'purple' },
    { name: 'Private Rooms', count: 7, capacity: 12, color: 'yellow' }
  ];

  const totalPatients = wards.reduce((sum, ward) => sum + ward.count, 0);
  const totalCapacity = wards.reduce((sum, ward) => sum + ward.capacity, 0);
  const occupancyRate = ((totalPatients / totalCapacity) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Active Patients</h3>
          <p className="text-sm text-gray-600">Currently admitted (dischargeDate = null)</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-end space-x-2">
          <p className="text-4xl font-bold text-gray-800">{totalPatients}</p>
          <p className="text-lg text-gray-600">patients</p>
        </div>
        <p className="text-sm text-gray-600 mt-1">Occupancy Rate: <span className="font-semibold">{occupancyRate}%</span></p>
      </div>

      <div className="space-y-4">
        {wards.map((ward) => {
          const percentage = ((ward.count / ward.capacity) * 100).toFixed(0);
          const colorClasses = {
            blue: 'bg-blue-500',
            red: 'bg-red-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            yellow: 'bg-yellow-500'
          };

          return (
            <div key={ward.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{ward.name}</span>
                <span className="text-gray-600">{ward.count}/{ward.capacity} ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${colorClasses[ward.color]} h-2 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivePatientsCard;