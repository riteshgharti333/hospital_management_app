import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaIdCard,
  FaUser,
  FaMobileAlt,
  FaMoneyBillWave,
  FaComment,
  FaFileInvoiceDollar,
  FaSearch,
  FaPhone,
  FaUserMd,
  FaHospitalUser,
} from "react-icons/fa";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import BackButton from "../../components/BackButton/BackButton";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";

import {
  useGetMoneyReceiptById,
  useUpdateMoneyReceipt,
  useDeleteMoneyReceipt,
} from "../../feature/transectionHooks/useMoneyReceipt";

import { useSearchAdmissions } from "../../feature/hooks/useAdmisson";

import { moneyReceiptSchema } from "@hospital/schemas";

const paymentModes = ["Cash", "Cheque", "Card", "Online Transfer", "Other"];
const statusOptions = ["Active", "Cancelled", "Refunded"];

const EditMoneyReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Admission Search
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const { data: searchResponse, isLoading: isSearching } = useSearchAdmissions(searchTerm);
  const admissions = searchResponse?.data || [];

  // Fetch receipt by its ID
  const { data: receiptData, isLoading } = useGetMoneyReceiptById(id);
  const { mutateAsync: updateReceipt, isPending: isUpdating } = useUpdateMoneyReceipt();
  const { mutateAsync: deleteReceipt, isPending: isDeleting } = useDeleteMoneyReceipt();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moneyReceiptSchema),
    defaultValues: {
      date: "",
      admissionId: "",
      patientId: "",
      amount: "",
      paymentMode: "Cash",
      remarks: "",
      receivedBy: "",
      status: "Active",
    },
  });

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

  // Load receipt data
  useEffect(() => {
    if (receiptData) {
      console.log("Receipt Data:", receiptData);
      
      reset({
        date: receiptData.date?.split("T")[0] || "",
        admissionId: receiptData.admissionId || "",
        patientId: receiptData.patientId || "",
        amount: receiptData.amount || "",
        paymentMode: receiptData.paymentMode || "Cash",
        remarks: receiptData.remarks || "",
        receivedBy: receiptData.receivedBy || "",
        status: receiptData.status || "Active",
      });

      // Set selected admission if exists
      if (receiptData.admission) {
        setSelectedAdmission(receiptData.admission);
        setSearchTerm(receiptData.admission.hospitalAdmissionId || "");
      }
    }
  }, [receiptData, reset]);

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

  const getInputClass = (name, disabled) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      errors[name] ? "border-red-500" : "border-gray-300"
    } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white"}`;

  const onSubmit = async (formData) => {
    try {
      if (!selectedAdmission && editMode) {
        toast.error("Please select an admission");
        return;
      }

      const payload = {
        date: new Date(formData.date).toISOString(),
        admissionId: Number(formData.admissionId),
        patientId: Number(formData.patientId),
        amount: Number(formData.amount),
        paymentMode: formData.paymentMode,
        remarks: formData.remarks || "",
        receivedBy: formData.receivedBy,
        status: formData.status || "Active",
      };

      console.log("Updating money receipt:", payload);

      const response = await updateReceipt({ id, data: payload });
      
      if (response?.data?.success) {
        toast.success(response.data.message || "Money receipt updated successfully");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update money receipt");
    }
  };

  const handleCancel = () => {
    if (!receiptData) return;
    reset({
      date: receiptData.date?.split("T")[0] || "",
      admissionId: receiptData.admissionId || "",
      patientId: receiptData.patientId || "",
      amount: receiptData.amount || "",
      paymentMode: receiptData.paymentMode || "Cash",
      remarks: receiptData.remarks || "",
      receivedBy: receiptData.receivedBy || "",
      status: receiptData.status || "Active",
    });
    if (receiptData.admission) {
      setSelectedAdmission(receiptData.admission);
      setSearchTerm(receiptData.admission.hospitalAdmissionId || "");
    }
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteReceipt(id);
      if (data?.success) {
        toast.success(data.message);
        navigate("/money-receipts");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!receiptData) return <NoData />;

  return (
    <div className="max-w-6xl mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <div className="mb-5">
        <div className="flex items-center">
          <BackButton />
          <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
            <FaFileInvoiceDollar className="mr-2 text-blue-600" />
            {editMode ? "Edit Money Receipt" : "View Money Receipt"}
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          {/* Receipt Information Section */}
          <div className="flex items-center mb-6">
            <FaMoneyBillWave className="text-green-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Receipt Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Receipt Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("date")}
                  disabled={!editMode}
                  className={`${getInputClass("date", !editMode)} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("status")}
                disabled={!editMode}
                className={`${getInputClass("status", !editMode)} bg-white`}
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
          </div>

          {/* Hidden inputs for IDs */}
          <input type="hidden" {...register("admissionId")} />
          <input type="hidden" {...register("patientId")} />

          {/* Admission Section */}
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
                disabled={!editMode}
                placeholder="Search by Admission ID, Patient Name, or Mobile No"
                autoComplete="off"
                className={`${getInputClass("admissionId", !editMode)} pl-10`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>

            {/* Search Results Dropdown */}
            {editMode && showDropdown && searchTerm.length >= 2 && (
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
                        <FaIdCard className="text-gray-400 ml-3" />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaSearch className="text-gray-400 mb-2" size={20} />
                      <p>No admissions found</p>
                    </div>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Selected Admission Details Card */}
          {selectedAdmission && (
            <div className={`mt-4 p-4 rounded-lg border ${
              editMode 
                ? "bg-blue-50 border-blue-200" 
                : "bg-green-50 border-green-200"
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                editMode ? "text-blue-900" : "text-green-900"
              }`}>
                {editMode ? "Selected Admission Details:" : "Current Admission Details:"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Admission ID:</span> {selectedAdmission.hospitalAdmissionId || `ADM-${selectedAdmission.id}`}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Patient ID:</span> {selectedAdmission.patient?.hospitalPatientId || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Patient Name:</span> {selectedAdmission.patient?.fullName || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Mobile:</span> {selectedAdmission.patient?.mobileNumber || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Doctor:</span> {selectedAdmission.doctor?.fullName || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Admitted On:</span> {new Date(selectedAdmission.admissionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* No Admission Selected Message */}
          {!selectedAdmission && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                {editMode ? "Please search and select an admission" : "No admission information available"}
              </p>
            </div>
          )}
        </div>

        {/* Receipt Details Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaMoneyBillWave className="text-green-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Payment Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  disabled={!editMode}
                  placeholder="Enter amount"
                  className={`${getInputClass("amount", !editMode)} pl-10`}
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
                disabled={!editMode}
                className={`${getInputClass("paymentMode", !editMode)} bg-white`}
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
              <input
                type="text"
                {...register("receivedBy")}
                disabled={!editMode}
                placeholder="Enter staff name"
                className={getInputClass("receivedBy", !editMode)}
              />
              {errors.receivedBy && (
                <p className="text-red-600 text-sm mt-1">{errors.receivedBy.message}</p>
              )}
            </div>

            {/* Remarks */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                {...register("remarks")}
                rows={3}
                disabled={!editMode}
                placeholder="Optional remarks"
                className={getInputClass("remarks", !editMode)}
              />
              {errors.remarks && (
                <p className="text-red-600 text-sm mt-1">{errors.remarks.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!editMode ? (
            <>
              <DeleteButton onClick={() => setShowDeleteModal(true)} />
              <EditButton onClick={() => setEditMode(true)} />
            </>
          ) : (
            <>
              <CancelButton onClick={handleCancel} />
              <SaveButton type="submit" isLoading={isUpdating} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditMoneyReceipt;