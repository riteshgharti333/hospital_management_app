import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaListAlt,
  FaMobileAlt,
  FaIdCard,
  FaUser,
  FaHome,
  FaUserMd,
  FaBed,
  FaBox,
  FaPlus,
  FaTrash,
  FaSearch,
  FaHospitalUser,
  FaPhone,
} from "react-icons/fa";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

import { billSchema } from "@hospital/schemas";
import { useCreateBill } from "../../feature/transectionHooks/useBill";
import { useSearchAdmissions } from "../../feature/hooks/useAdmisson";

const NewBill = () => {
  const [productData, setProductData] = useState({
    company: "",
    itemOrService: "",
    quantity: 1,
    mrp: "",
    totalAmount: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const searchRef = useRef(null);

  const { data: searchResponse, isLoading: isSearching } =
    useSearchAdmissions(searchTerm);

  const admissions = searchResponse?.data || [];

  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateBill();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(billSchema),
    defaultValues: {
      billDate: new Date().toISOString().split("T")[0],
      billType: "",
      admissionId: "",
      patientId: "",
      billItems: [],
      totalAmount: 0,
      status: "Pending",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "billItems",
  });

  const watchedItems = useWatch({ control, name: "billItems" });

  const billTypes = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"];
  const billStatusOptions = ["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"];

  const companies = [
    "Sun Pharma",
    "Cipla",
    "Dr. Reddy's",
    "Abbott",
    "Mankind Pharma",
    "Zydus Cadila",
    "Alkem Laboratories",
    "Torrent Pharmaceuticals",
  ];

  const services = [
    "Paracetamol 500mg",
    "Amoxicillin 250mg",
    "Omeprazole 20mg",
    "Metformin 500mg",
    "Atorvastatin 10mg",
    "CBC Test",
    "X-Ray Chest",
    "Ultrasound",
    "Consultation Fee",
    "Room Charges",
    "Nursing Care",
    "IV Fluids",
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length >= 2);
    if (value.length < 2) {
      setSelectedAdmission(null);
      setValue("admissionId", "");
      setValue("patientId", "");
    }
  };

  const handleSelectAdmission = (admission) => {
    setSelectedAdmission(admission);
    setValue("admissionId", admission.id);
    setValue("patientId", admission.patient?.id);
    setSearchTerm(admission.hospitalAdmissionId || `ADM-${admission.id}`);
    setShowDropdown(false);
    toast.success("Admission selected successfully");
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => {
      const updatedData = {
        ...prev,
        [name]: name === "quantity" ? parseInt(value, 10) || 1 : value,
      };

      if (name === "quantity" || name === "mrp") {
        const quantity =
          name === "quantity" ? parseInt(value, 10) || 1 : prev.quantity;
        const mrp =
          name === "mrp" ? parseFloat(value) || 0 : parseFloat(prev.mrp) || 0;
        updatedData.totalAmount = (quantity * mrp).toFixed(2);
      }

      return updatedData;
    });
  };

  const handleAddItem = () => {
    const { company, itemOrService, quantity, mrp, totalAmount } = productData;

    if (!company || !itemOrService || quantity < 1 || !mrp || !totalAmount) {
      toast.error("Please fill all required fields with valid values");
      return;
    }

    const newItem = {
      company,
      itemOrService,
      quantity: parseInt(quantity, 10),
      mrp: parseFloat(mrp),
      totalAmount: parseFloat(totalAmount),
    };

    append(newItem);
    setProductData({
      company: "",
      itemOrService: "",
      quantity: 1,
      mrp: "",
      totalAmount: "",
    });
  };

  const calculateTotal = () => {
    return (watchedItems || []).reduce(
      (sum, item) => sum + (item.totalAmount || 0),
      0,
    );
  };

  useEffect(() => {
    const total = (watchedItems || []).reduce(
      (sum, item) => sum + (Number(item.totalAmount) || 0),
      0
    );
    setValue("totalAmount", total);
  }, [watchedItems, setValue]);

  const onSubmit = async (data) => {
    try {
      if (!selectedAdmission) {
        toast.error("Please select an admission");
        return;
      }

      const processedItems = data.billItems.map((item) => ({
        company: item.company,
        itemOrService: item.itemOrService,
        quantity: Number(item.quantity),
        mrp: Number(item.mrp),
        totalAmount: Number(item.totalAmount),
      }));

      const payload = {
        billDate: new Date(data.billDate).toISOString(),
        billType: data.billType,
        totalAmount: Number(data.totalAmount),
        admissionId: Number(data.admissionId),
        patientId: Number(data.patientId),
        status: data.status,
        billItems: processedItems,
      };

      const response = await mutateAsync(payload);

      if (response?.data?.success) {
        toast.success(response.data.message || "Bill created successfully");
        navigate(`/bill/${response.data.data.id}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create bill");
    }
  };

  const inputClass = (fieldError) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      fieldError ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaListAlt className="mr-2 text-blue-600" />
              New Bill Entry
            </h2>
            <p className="text-gray-600 mt-1">
              Search admission and add bill items
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          {/* Bill Information Section */}
          <div className="flex items-center mb-6">
            <FaListAlt className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Bill Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Bill Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("billDate")}
                  className={`${inputClass(errors.billDate)} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.billDate && (
                <p className="text-red-600 text-sm mt-1">{errors.billDate.message}</p>
              )}
            </div>

            {/* Bill Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Type<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("billType")}
                className={`${inputClass(errors.billType)} bg-white`}
                defaultValue=""
              >
                <option value="" disabled hidden>
                  Select bill type
                </option>
                {billTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.billType && (
                <p className="text-red-600 text-sm mt-1">{errors.billType.message}</p>
              )}
            </div>

            {/* Bill Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Status<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("status")}
                className={`${inputClass(errors.status)} bg-white`}
              >
                {billStatusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Hidden inputs for IDs */}
          <input type="hidden" {...register("admissionId")} />
          <input type="hidden" {...register("patientId")} />

          {/* Admission Search Section */}
          <div className="space-y-1 relative" ref={searchRef}>
            <label className="block text-sm font-medium text-gray-700">
              Search Admission<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchTerm.length >= 2 && admissions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                placeholder="Search by Admission ID, Patient Name, or Mobile No"
                autoComplete="off"
                className={`${inputClass(errors.admissionId)} pl-10`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchTerm.length >= 2 && (
              <ul className="absolute z-50 bg-white w-full border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                {isSearching ? (
                  <li className="px-4 py-3 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching admissions...
                    </div>
                  </li>
                ) : admissions.length > 0 ? (
                  admissions.slice(0, 10).map((admission) => (
                    <li
                      key={admission.id}
                      onClick={() => handleSelectAdmission(admission)}
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {admission.patient?.fullName || "Unknown Patient"}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Admission:</span>{" "}
                              {admission.hospitalAdmissionId || `ADM-${admission.id}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Patient ID:</span>{" "}
                              {admission.patient?.hospitalPatientId || "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaUserMd className="mr-1 text-gray-400" size={12} />
                              {admission.doctor?.fullName || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaPhone className="mr-1 text-gray-400" size={12} />
                              {admission.patient?.mobileNumber || "N/A"}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Admitted: {new Date(admission.admissionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <FaHospitalUser className="text-gray-400 ml-3" />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaSearch className="text-gray-400 mb-2" size={20} />
                      <p>No admissions found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try searching with a different term
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            )}

            {errors.admissionId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.admissionId.message}
              </p>
            )}
          </div>

          {/* Selected Admission Details Card */}
          {selectedAdmission && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">Selected Admission Details:</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p className="text-blue-800">
                  <span className="font-medium">Admission ID:</span> {selectedAdmission.hospitalAdmissionId || `ADM-${selectedAdmission.id}`}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Patient ID:</span> {selectedAdmission.patient?.hospitalPatientId || "N/A"}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Patient Name:</span> {selectedAdmission.patient?.fullName}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Mobile:</span> {selectedAdmission.patient?.mobileNumber || "N/A"}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Doctor:</span> {selectedAdmission.doctor?.fullName || "N/A"}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Admitted On:</span> {new Date(selectedAdmission.admissionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Add Items Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaBox className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Add Items/Services
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Company<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="company"
                value={productData.company}
                onChange={handleProductChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" disabled hidden>
                  Select company
                </option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Item/Service<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="itemOrService"
                value={productData.itemOrService}
                onChange={handleProductChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" disabled hidden>
                  Select item/service
                </option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Quantity<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleProductChange}
                min="1"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                MRP (₹)<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="mrp"
                value={productData.mrp}
                onChange={handleProductChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Total Amount (₹)
              </label>
              <input
                type="number"
                name="totalAmount"
                value={productData.totalAmount}
                readOnly
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Item
          </button>

          {errors.billItems && (
            <p className="text-red-600 text-sm mt-2">{errors.billItems.message}</p>
          )}
        </div>

        {/* Items Table */}
        {fields.length > 0 && (
          <div className="p-6 border-t border-gray-100">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Added Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item/Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP (₹)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (₹)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemOrService}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.mrp.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{item.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-900">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-6 py-4 text-right font-semibold text-sm text-gray-800">
                      Grand Total:
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-gray-900">
                      ₹{calculateTotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton type="submit" isLoading={isPending}>
            {isPending ? "Saving..." : "Save Bill"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewBill;