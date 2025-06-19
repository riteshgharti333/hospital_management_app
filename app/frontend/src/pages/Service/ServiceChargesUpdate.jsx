import React, { useState } from 'react';
import { FaMoneyBillWave, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import BackButton from '../../components/BackButton/BackButton';


const ServiceChargesUpdate = () => {
  // Sample service categories
  const serviceCategories = [
    'Consultation',
    'Diagnostic',
    'Therapeutic',
    'Surgical',
    'Room Charges',
    'Emergency',
    'Pharmacy'
  ];

  // Sample charge types
  const chargeTypes = [
    'Fixed',
    'Variable',
    'Per Hour',
    'Per Day',
    'Per Session'
  ];

  // State for service charges
  const [serviceCharges, setServiceCharges] = useState([
    {
      id: Date.now(),
      serviceName: '',
      serviceCategory: '',
      chargeType: '',
      baseAmount: '',
      taxApplicable: true,
      taxPercentage: '5%',
      notes: '',
      status: 'Active'
    }
  ]);

  const handleChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setServiceCharges(prev =>
      prev.map(charge =>
        charge.id === id
          ? {
              ...charge,
              [name]: type === 'checkbox' ? checked : value
            }
          : charge
      )
    );
  };

  const addServiceCharge = () => {
    setServiceCharges(prev => [
      ...prev,
      {
        id: Date.now(),
        serviceName: '',
        serviceCategory: '',
        chargeType: '',
        baseAmount: '',
        taxApplicable: true,
        taxPercentage: '5%',
        notes: '',
        status: 'Active'
      }
    ]);
  };

  const removeServiceCharge = (id) => {
    if (serviceCharges.length > 1) {
      setServiceCharges(prev => prev.filter(charge => charge.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Service Charges Updated:', serviceCharges);
    // Add your submission logic here
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-blue-500" />
              Service Charges Update
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and update service charges for your hospital
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Service Charges Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-blue-500" />
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                Service Charges
              </h3>
            </div>
            <button
              type="button"
              onClick={addServiceCharge}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FaPlus className="mr-1" /> Add Service
            </button>
          </div>

          {serviceCharges.map((charge, index) => (
            <div
              key={charge.id}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Service Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Service Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={charge.serviceName}
                  onChange={(e) => handleChange(charge.id, e)}
                  placeholder="Enter service name"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* Service Category */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="serviceCategory"
                  value={charge.serviceCategory}
                  onChange={(e) => handleChange(charge.id, e)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {serviceCategories.map((category, i) => (
                    <option key={i} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Charge Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Charge Type <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="chargeType"
                  value={charge.chargeType}
                  onChange={(e) => handleChange(charge.id, e)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="">Select Type</option>
                  {chargeTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Base Amount */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Base Amount <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="baseAmount"
                    value={charge.baseAmount}
                    onChange={(e) => handleChange(charge.id, e)}
                    placeholder="0.00"
                    className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Tax Applicable */}
              <div className="space-y-1 flex items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="taxApplicable"
                    checked={charge.taxApplicable}
                    onChange={(e) => handleChange(charge.id, e)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Tax Applicable
                  </label>
                </div>
              </div>

              {/* Tax Percentage */}
              {charge.taxApplicable && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Tax Percentage
                  </label>
                  <select
                    name="taxPercentage"
                    value={charge.taxPercentage}
                    onChange={(e) => handleChange(charge.id, e)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {['5%', '12%', '18%', '28%'].map((percent, i) => (
                      <option key={i} value={percent}>
                        {percent}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="status"
                  value={charge.status}
                  onChange={(e) => handleChange(charge.id, e)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={charge.notes}
                  onChange={(e) => handleChange(charge.id, e)}
                  placeholder="Any special notes"
                  rows="2"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Delete Button */}
              <div className="flex justify-end items-end md:col-span-2 lg:col-span-4">
                {serviceCharges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeServiceCharge(charge.id)}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="mr-1" /> Remove Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
       
          <button
            type="submit"
            className="btn-primary"
          >
            Update Service Charges
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceChargesUpdate;