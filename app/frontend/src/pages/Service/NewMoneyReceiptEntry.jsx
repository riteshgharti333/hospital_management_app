import React, { useState, useEffect, useRef } from "react";
import {
  FaIdCard,
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaSearch,
  FaCalendarAlt,
  FaUserCheck,
  FaStickyNote,
} from "react-icons/fa";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { moneyReceiptSchema } from "@hospital/schemas";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

import { useCreateMoneyReceipt } from "../../feature/transectionHooks/useMoneyReceipt";
import { useSearchAdmissions } from "../../feature/hooks/useAdmisson";

const paymentModes = ["Cash", "Cheque", "Card", "Online Transfer", "Other"];
const statusOptions = ["Active", "Cancelled", "Refunded"];

const NewMoneyReceiptEntry = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const { data: searchResponse, isLoading: searchingAdmissions } = useSearchAdmissions(searchTerm);
  const admissions = searchResponse?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moneyReceiptSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      admissionId: "",
      patientId: "",
      amount: "",
      paymentMode: "Cash",
      remarks: "",
      receivedBy: "",
      status: "Active",
    },
  });

  const { mutateAsync, isPending } = useCreateMoneyReceipt();

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

  const onSubmit = async (data) => {
    try {
      if (!selectedAdmission) {
        toast.error("Please select an admission");
        return;
      }

      const payload = {
        date: new Date(data.date).toISOString(),
        admissionId: Number(data.admissionId),
        patientId: Number(data.patientId),
        amount: Number(data.amount),
        paymentMode: data.paymentMode,
        remarks: data.remarks || "",
        receivedBy: data.receivedBy,
        status: data.status || "Active",
      };

      console.log("Submitting money receipt:", payload);

      const response = await mutateAsync(payload);
      
      if (response?.data?.success) {
        toast.success(response.data.message || "Money receipt created successfully");
        navigate(`/money-receipt/${response.data.data.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Failed to create money receipt");
    }
  };

  const inputClass = (error) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className=" mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-600" />
              New Money Receipt
            </h2>
            <p className="text-gray-600 mt-1">
              Search admission and create money receipt
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* ADMISSION SEARCH SECTION */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4">
            <FaIdCard className="text-blue-500 mr-2" />
            Admission Information
          </h3>

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
                {searchingAdmissions ? (
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
                          <p className="text-xs text-gray-500 mt-1">
                            Mobile: {admission.patient?.mobileNumber || "N/A"}
                          </p>
                        </div>
                        <FaIdCard className="text-gray-400 ml-3" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p className="text-blue-800">
                  <span className="font-medium">Admission ID:</span> {selectedAdmission.hospitalAdmissionId || `ADM-${selectedAdmission.id}`}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Patient ID:</span> {selectedAdmission.patient?.hospitalPatientId || "N/A"}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Patient Name:</span> {selectedAdmission.patient?.fullName || "N/A"}
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

        {/* HIDDEN INPUTS FOR IDs */}
        <input type="hidden" {...register("admissionId")} />
        <input type="hidden" {...register("patientId")} />

        {/* RECEIPT DETAILS SECTION */}
        <div className="p-6">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4">
            <FaMoneyBillWave className="text-green-500 mr-2" />
            Receipt Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Receipt Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("date")}
                  className={`${inputClass(errors.date)} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Amount (₹)<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  placeholder="Enter amount"
                  className={`${inputClass(errors.amount)} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
              </div>
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Payment Mode */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment Mode<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("paymentMode")}
                className={inputClass(errors.paymentMode)}
              >
                {paymentModes.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
              {errors.paymentMode && (
                <p className="text-red-600 text-sm mt-1">{errors.paymentMode.message}</p>
              )}
            </div>

            {/* Received By */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Received By<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("receivedBy")}
                  placeholder="Enter staff name"
                  className={`${inputClass(errors.receivedBy)} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserCheck className="text-gray-400" />
                </div>
              </div>
              {errors.receivedBy && (
                <p className="text-red-600 text-sm mt-1">{errors.receivedBy.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("status")}
                className={inputClass(errors.status)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Remarks */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <div className="relative">
                <textarea
                  {...register("remarks")}
                  rows={3}
                  placeholder="Optional remarks"
                  className={`${inputClass(errors.remarks)} pl-10`}
                />
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <FaStickyNote className="text-gray-400" />
                </div>
              </div>
              {errors.remarks && (
                <p className="text-red-600 text-sm mt-1">{errors.remarks.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton isLoading={isPending} type="submit">
            {isPending ? "Creating..." : "Create Receipt"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewMoneyReceiptEntry;