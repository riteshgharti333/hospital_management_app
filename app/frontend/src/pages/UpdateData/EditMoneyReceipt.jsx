import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaIdCard,
  FaUser,
  FaMobileAlt,
  FaMoneyBillWave,
  FaComment,
  FaFileInvoiceDollar,
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

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // For searchable admission no
  const [searchAdmission, setSearchAdmission] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: admissionResults = [] } = useSearchAdmissions(searchAdmission);

  // Fetch receipt by its ID
  const { data: receiptData, isLoading } = useGetMoneyReceiptById(id);
  const { mutateAsync: updateReceipt, isPending: isUpdating } =
    useUpdateMoneyReceipt();
  const { mutateAsync: deleteReceipt, isPending: isDeleting } =
    useDeleteMoneyReceipt();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moneyReceiptSchema),
  });

  useEffect(() => {
    if (receiptData) {
      setSearchAdmission(receiptData.admissionNo);

      reset({
        ...receiptData,
        date: receiptData.date?.split("T")[0] || "",
      });
    }
  }, [receiptData, reset]);

  const handleSelectAdmission = (item) => {
    setSearchAdmission(item.gsRsRegNo);
    setShowDropdown(false);

    setValue("admissionNo", item.gsRsRegNo);
    setValue("patientName", item.patientName);
    setValue("mobile", item.phoneNo);

    toast.success("Patient details auto-filled");
  };

  const getInputClass = (error, disabled) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`;

  const onSubmit = async (data) => {
    try {
      const response = await updateReceipt({ id, data });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    if (!receiptData) return;
    reset({
      ...receiptData,
      date: receiptData.date?.split("T")[0] || "",
    });
    setSearchAdmission(receiptData.admissionNo);
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
    <div className="">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* HEADER */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaFileInvoiceDollar className="mr-2 text-blue-600" />
              {editMode ? "Edit Money Receipt" : "View Money Receipt"}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* =======================
          ADMISSION INFO
        ======================= */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4">
            <FaIdCard className="text-blue-500 mr-2" />
            Admission Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admission No Searchable */}
            <div className="space-y-1 relative">
              <label className="block text-sm font-medium text-gray-700">
                Admission No<span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={searchAdmission}
                  disabled={!editMode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchAdmission(val);
                    setValue("admissionNo", val);
                    setShowDropdown(true);
                  }}
                  autoComplete="off"
                  className={`${getInputClass(
                    errors.admissionNo,
                    !editMode
                  )} pl-10`}
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" />
                </div>
              </div>

              {showDropdown &&
                editMode &&
                searchAdmission &&
                admissionResults.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-sm max-h-60 overflow-y-auto mt-1">
                    {admissionResults.slice(0, 10).map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelectAdmission(item)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <p className="font-medium text-sm text-gray-800">
                          {item.gsRsRegNo} — {item.patientName}
                        </p>
                        <p className="text-xs text-gray-500">{item.phoneNo}</p>
                      </li>
                    ))}
                  </ul>
                )}

              {errors.admissionNo && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.admissionNo.message}
                </p>
              )}
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                disabled
                {...register("patientName")}
                className={getInputClass(errors.patientName, true)}
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="text"
                disabled
                {...register("mobile")}
                className={getInputClass(errors.mobile, true)}
              />
            </div>
          </div>
        </div>

        {/* =======================
          RECEIPT DETAILS
        ======================= */}
        <div className="p-6">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4">
            <FaMoneyBillWave className="text-blue-500 mr-2" />
            Receipt Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date<span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="date"
                  {...register("date")}
                  disabled={!editMode}
                  className={`${getInputClass(
                    errors.date,
                    !editMode
                  )} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>

              {errors.date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                disabled={!editMode}
                className={getInputClass(errors.amount, !editMode)}
                placeholder="Enter amount"
              />

              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Mode<span className="text-red-500">*</span>
              </label>
              <select
                {...register("paymentMode")}
                disabled={!editMode}
                className={getInputClass(errors.paymentMode, !editMode)}
              >
                {paymentModes.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>

              {errors.paymentMode && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.paymentMode.message}
                </p>
              )}
            </div>

            {/* Received By */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Received By<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("receivedBy")}
                disabled={!editMode}
                placeholder="Enter staff name"
                className={getInputClass(errors.receivedBy, !editMode)}
              />

              {errors.receivedBy && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.receivedBy.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status<span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                disabled={!editMode}
                className={getInputClass(errors.status, !editMode)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {errors.status && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                {...register("remarks")}
                rows={3}
                disabled={!editMode}
                placeholder="Optional remarks"
                className={getInputClass(errors.remarks, !editMode)}
              />

              {errors.remarks && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.remarks.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
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
