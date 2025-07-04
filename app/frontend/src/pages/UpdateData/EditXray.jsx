import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUser,
  FaUserMd,
  FaFileAlt,
  FaMoneyBillAlt,
  FaEdit,
  FaTrash,
  FaSave,
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
  useGetXrayReportById,
  useUpdateXrayReport,
  useDeleteXrayReport,
} from "../../feature/hooks/useXray";
import { xrayReportSchema } from "@hospital/schemas";

const EditXray = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const departments = [
    "Radiology",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "General",
  ];

  const { data: xrayData, isLoading } = useGetXrayReportById(id);
  const { mutateAsync: updateXrayReport, isPending: isUpdating } =
    useUpdateXrayReport();
  const { mutateAsync: deleteXrayReport, isPending: isDeleting } =
    useDeleteXrayReport();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(xrayReportSchema),
  });

  const [billAmount, discountPercent, commissionPercent] = watch([
    "billAmount",
    "discountPercent",
    "commissionPercent",
  ]);
  const netBillAmount = watch("netBillAmount");

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white";

  // Set form values and format dates when data loads
  useEffect(() => {
    if (xrayData) {
      const formattedData = {
        ...xrayData,
        billDate: xrayData.billDate?.split("T")[0] || "",
        testDate: xrayData.testDate?.split("T")[0] || "",
        reportDate: xrayData.reportDate?.split("T")[0] || "",
      };
      reset(formattedData);
    }
  }, [xrayData, reset]);

  // Calculate Net Bill Amount
  useEffect(() => {
    const bill = parseFloat(billAmount) || 0;
    const disc = parseFloat(discountPercent) || 0;
    const netAmount = bill - (bill * disc) / 100;
    setValue("netBillAmount", parseFloat(netAmount.toFixed(2)));
  }, [billAmount, discountPercent, setValue]);

  // Calculate Doctor Earning
  useEffect(() => {
    const netAmount = parseFloat(netBillAmount) || 0;
    const commission = parseFloat(commissionPercent) || 0;
    const earning = (netAmount * commission) / 100;
    setValue("doctorEarning", parseFloat(earning.toFixed(2)));
  }, [netBillAmount, commissionPercent, setValue]);

  const onSubmit = async (formData) => {
    try {
      const response = await updateXrayReport({ id, data: formData });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    // Re-format and reset
    const formattedData = {
      ...xrayData,
      billDate: xrayData.billDate?.split("T")[0] || "",
      testDate: xrayData.testDate?.split("T")[0] || "",
      reportDate: xrayData.reportDate?.split("T")[0] || "",
    };
    reset(formattedData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteXrayReport(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/xray/xray-commision-report"); // Navigate to the list page
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <p className="text-red-600 text-sm mt-1">{errors[field].message}</p>
    );

  if (isLoading) return <Loader />;
  if (!xrayData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaFileAlt className="mr-2 text-blue-500" />
              {editMode ? "Edit X-ray Report" : "View X-ray Report"}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        noValidate
      >
        {/* --- Patient Information Section --- */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaUser className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Patient Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bill Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("billDate")}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.billDate ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {renderError("billDate")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Mobile<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                {...register("patientMobile")}
                disabled={!editMode}
                placeholder="Enter 10-digit mobile"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.patientMobile ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError("patientMobile")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("patientName")}
                disabled={!editMode}
                placeholder="Enter patient name"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.patientName ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError("patientName")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                {...register("age", { valueAsNumber: true })}
                disabled={!editMode}
                placeholder="e.g., 35"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.age ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError("age")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Sex<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-4 pt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("patientSex")}
                    value="Male"
                    disabled={!editMode}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("patientSex")}
                    value="Female"
                    disabled={!editMode}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Female</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("patientSex")}
                    value="Other"
                    disabled={!editMode}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Other</span>
                </label>
              </div>
              {renderError("patientSex")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referred Doctor<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("referredDoctor")}
                  disabled={!editMode}
                  placeholder="Enter doctor name"
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.referredDoctor ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
              </div>
              {renderError("referredDoctor")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Test Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("testDate")}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.testDate ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {renderError("testDate")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Report Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("reportDate")}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.reportDate ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {renderError("reportDate")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("department")}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.department ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="" disabled hidden>
                  Select Department
                </option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {renderError("department")}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Patient Address
              </label>
              <textarea
                {...register("patientAddress")}
                disabled={!editMode}
                placeholder="Enter patient address"
                rows="2"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.patientAddress ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError("patientAddress")}
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Exam / Description<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register("examDescription")}
                disabled={!editMode}
                placeholder="e.g., Chest X-ray PA view"
                rows="2"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.examDescription ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {renderError("examDescription")}
            </div>
          </div>
        </div>

        {/* --- Billing Information Section --- */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaMoneyBillAlt className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Billing Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bill Amount<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("billAmount", { valueAsNumber: true })}
                  disabled={!editMode}
                  placeholder="0.00"
                  step="0.01"
                  className={`block w-full px-4 py-2 border rounded-lg pl-8 ${
                    errors.billAmount ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
              </div>
              {renderError("billAmount")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount %
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("discountPercent", { valueAsNumber: true })}
                  disabled={!editMode}
                  placeholder="0"
                  className={`block w-full px-4 py-2 border rounded-lg pr-8 ${
                    errors.discountPercent
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
              {renderError("discountPercent")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Net Bill Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("netBillAmount", { valueAsNumber: true })}
                  readOnly
                  className="block w-full px-4 py-2 border rounded-lg bg-gray-100 pl-8"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commission %
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("commissionPercent", { valueAsNumber: true })}
                  disabled={!editMode}
                  placeholder="0"
                  className={`block w-full px-4 py-2 border rounded-lg pr-8 ${
                    errors.commissionPercent
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
              {renderError("commissionPercent")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Doctor Earning
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("doctorEarning", { valueAsNumber: true })}
                  readOnly
                  className="block w-full px-4 py-2 border rounded-lg bg-gray-100 pl-8"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!editMode ? (
            <>
              <DeleteButton
                type="button"
                onClick={() => setShowDeleteModal(true)}
              />
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

export default EditXray;
