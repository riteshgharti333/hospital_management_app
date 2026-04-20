import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUser,
  FaUserMd,
  FaMoneyBillWave,
  FaUniversity,
  FaCalendarAlt,
  FaFileInvoice,
  FaCreditCard,
  FaStickyNote,
  FaHashtag,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { ledgerSchema, REFERENCE_TYPES } from "@hospital/schemas";
import {
  useGetLedgerById,
  useUpdateLedger,
  useDeleteLedger,
} from "../../feature/hooks/useLedger";

const referenceTypeDisplay = {
  OPD: "OPD",
  IPD: "IPD",
  PHARMACY: "Pharmacy",
  LAB: "Lab",
  PROCEDURE: "Procedure",
  SALARY: "Salary",
  EXPENSE: "Expense",
  ADVANCE: "Advance",
  REFUND: "Refund",
  OTHER: "Other",
};

const entityTypeIcons = {
  PATIENT: <FaUser className="text-blue-500" />,
  DOCTOR: <FaUserMd className="text-green-500" />,
  CASH: <FaMoneyBillWave className="text-emerald-500" />,
  BANK: <FaUniversity className="text-purple-500" />,
};

const entityTypeLabels = {
  PATIENT: "Patient",
  DOCTOR: "Doctor",
  CASH: "Cash",
  BANK: "Bank",
};

const EditLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: ledgerData, isLoading } = useGetLedgerById(id);
  const { mutateAsync: updateLedger, isPending: isUpdating } =
    useUpdateLedger();
  const { mutateAsync: deleteLedger, isPending: isDeleting } =
    useDeleteLedger();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ledgerSchema),
  });

  const entityType = watch("entityType");

  useEffect(() => {
    if (ledgerData) {
      // Format date to YYYY-MM-DD for input
      const formattedData = {
        ...ledgerData,
        transactionDate: ledgerData.transactionDate
          ? new Date(ledgerData.transactionDate).toISOString().split("T")[0]
          : "",
        amount: ledgerData.amount?.toString() || "",
      };
      reset(formattedData);
    }
  }, [ledgerData, reset]);

  const onSubmit = async (formData) => {
    const formattedData = {
      transactionDate: new Date(formData.transactionDate).toISOString(),
      description: formData.description,
      amountType: formData.amountType,
      amount: Number(formData.amount) || parseFloat(formData.amount),
      paymentMode: formData.paymentMode || "CASH",
      referenceType: formData.referenceType || "",
      referenceId: formData.referenceId?.trim() || "",
      remarks: formData.remarks?.trim() || "",
    };

    const response = await updateLedger({ id, data: formattedData });
    if (response?.data?.success) {
      setEditMode(false);
      toast.success("Ledger updated successfully");
    }
  };

  const handleCancel = () => {
    reset(ledgerData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    const { data } = await deleteLedger(id);
    if (data?.success) {
      navigate("/ledger");
      toast.success("Ledger deleted successfully");
    }
    setShowDeleteModal(false);
  };

  if (isLoading) return <Loader />;
  if (!ledgerData) return <NoData />;

  return (
    <div className="mx-auto max-w-4xl">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Ledger Entry"
        message="Are you sure you want to delete this ledger entry? This action cannot be undone."
      />

      {/* Header */}
      <div className="mb-5 flex items-center">
        <BackButton />
        <h2 className="text-2xl font-bold text-gray-800 ml-2">
          {editMode ? "Edit Ledger Entry" : "View Ledger Entry"}
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          {/* Entity Info Section - Read Only */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              {entityTypeIcons[ledgerData.entityType]}
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                {entityTypeLabels[ledgerData.entityType]} Ledger Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Ledger Code
                </label>
                <p className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaHashtag className="mr-2 text-gray-400" size={14} />
                  {ledgerData.code}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Entity Type
                </label>
                <p className="text-gray-800 flex items-center">
                  {entityTypeIcons[ledgerData.entityType]}
                  <span className="ml-2">
                    {entityTypeLabels[ledgerData.entityType]}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Entity ID
                </label>
                <p className="text-gray-800">{ledgerData.entityId}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Current Balance
                </label>
                <p className="text-lg font-semibold text-gray-800">
                  ₹{ledgerData.balance?.toString() || "0"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  Created At
                </label>
                <p className="text-gray-800">
                  {new Date(ledgerData.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Editable Transaction Details */}
          <div>
            <div className="flex items-center mb-6">
              <FaFileInvoice className="text-blue-500" />
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                Transaction Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Date */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Date<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("transactionDate")}
                    disabled={!editMode}
                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      errors.transactionDate
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${!editMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.transactionDate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.transactionDate.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...register("description")}
                  disabled={!editMode}
                  placeholder="Enter transaction description"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } ${!editMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Amount Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Amount Type<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register("amountType")}
                  disabled={!editMode}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    errors.amountType ? "border-red-500" : "border-gray-300"
                  } ${!editMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                >
                  <option value="CREDIT">Credit (Income)</option>
                  <option value="DEBIT">Debit (Expense)</option>
                </select>
                {errors.amountType && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.amountType.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Amount (₹)<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  disabled={!editMode}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  } ${!editMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {errors.amount && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Payment Mode */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Mode
                </label>
                <div className="relative">
                  <select
                    {...register("paymentMode")}
                    disabled={!editMode}
                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300 ${
                      !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                  <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Reference Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Reference Type
                </label>
                <select
                  {...register("referenceType")}
                  disabled={!editMode}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select reference type</option>
                  {REFERENCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {referenceTypeDisplay[type]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reference ID */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Reference ID
                </label>
                <input
                  type="text"
                  {...register("referenceId")}
                  disabled={!editMode}
                  placeholder="Enter reference ID"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Remarks */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <div className="relative">
                  <textarea
                    {...register("remarks")}
                    disabled={!editMode}
                    rows="3"
                    placeholder="Additional notes..."
                    className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                  <FaStickyNote className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
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

export default EditLedger;