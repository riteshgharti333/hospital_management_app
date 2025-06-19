import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt, FaSearch, FaUser, FaMobileAlt, FaMoneyBillWave, FaComment,
  FaFileInvoiceDollar, FaEdit, FaTrash, FaSave
} from "react-icons/fa";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import BackButton from "../../components/BackButton/BackButton";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import {
  EditButton, DeleteButton, CancelButton, SaveButton
} from "../../components/ActionButtons/ActionButtons";

// Assuming these hooks and schema exist
import {
  useGetMoneyReceiptById, useUpdateMoneyReceipt, useDeleteMoneyReceipt
} from "../../feature/transectionHooks/useMoneyReceipt";
import { moneyReceiptSchema }
 from "@hospital/schemas";

const EditMoneyReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- Static data ---
  const searchOptions = [
    { value: "mobile", label: "Mobile" },
    { value: "name", label: "Name" },
  ];
  const paymentModes = [
    "Cash", "Credit Card", "Debit Card", "Net Banking", "UPI", "Cheque",
  ];

  // --- Hooks for data operations ---
  const { data: receiptData, isLoading } = useGetMoneyReceiptById(id);
  const { mutateAsync: updateReceipt, isPending: isUpdating } = useUpdateMoneyReceipt();
  const { mutateAsync: deleteReceipt, isPending: isDeleting } = useDeleteMoneyReceipt();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moneyReceiptSchema),
  });

  const searchBy = useWatch({ control, name: "searchBy" });
  
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white";

  useEffect(() => {
    if (receiptData) {
      const formattedData = {
        ...receiptData,
        date: receiptData.date?.split("T")[0] || "",
      };
      reset(formattedData);
    }
  }, [receiptData, reset]);
  
  const onSubmit = async (data) => {
    try {
      const response = await updateReceipt({ id, data });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update money receipt.");
    }
  };

  const handleCancel = () => {
    const formattedData = {
        ...receiptData,
        date: receiptData.date?.split("T")[0] || "",
    };
    reset(formattedData);
    setEditMode(false);
  };
  
  const handleDelete = async () => {
    try {
      const { data } = await deleteReceipt(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/money-receipts");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete money receipt.");
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
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaFileInvoiceDollar className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Receipt Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Date<span className="text-red-500 ml-1">*</span></label>
              <div className="relative">
                <input type="date" {...register("date")} disabled={!editMode} className={`block w-full px-4 py-2 border rounded-lg pl-10 ${errors.date ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(!editMode)}`}/>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaCalendarAlt className="text-gray-400" /></div>
              </div>
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Search By<span className="text-red-500 ml-1">*</span></label>
              <div className="relative">
                <select {...register("searchBy")} disabled={!editMode} className={`block w-full px-4 py-2 border rounded-lg appearance-none pr-8 ${errors.searchBy ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(!editMode)}`}>
                  {searchOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><FaSearch className="text-gray-400" /></div>
              </div>
              {errors.searchBy && <p className="text-red-600 text-sm mt-1">{errors.searchBy.message}</p>}
            </div>

            {searchBy === "mobile" ? (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Mobile Number<span className="text-red-500 ml-1">*</span></label>
                <div className="relative">
                  <input type="tel" {...register("mobile")} disabled={!editMode} placeholder="Enter mobile number" className={`block w-full px-4 py-2 border rounded-lg pl-10 ${errors.mobile ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(!editMode)}`}/>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaMobileAlt className="text-gray-400" /></div>
                </div>
                {errors.mobile && <p className="text-red-600 text-sm mt-1">{errors.mobile.message}</p>}
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Patient Name<span className="text-red-500 ml-1">*</span></label>
                <div className="relative">
                  <input type="text" {...register("patientName")} disabled={!editMode} placeholder="Enter patient name" className={`block w-full px-4 py-2 border rounded-lg pl-10 ${errors.patientName ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(!editMode)}`}/>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="text-gray-400" /></div>
                </div>
                {errors.patientName && <p className="text-red-600 text-sm mt-1">{errors.patientName.message}</p>}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Amount<span className="text-red-500 ml-1">*</span></label>
              <div className="relative">
                <input type="number" {...register("amount", { valueAsNumber: true })} disabled={!editMode} placeholder="Enter amount" className={`block w-full px-4 py-2 border rounded-lg pl-10 ${errors.amount ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(!editMode)}`}/>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaMoneyBillWave className="text-gray-400" /></div>
              </div>
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Payment Mode<span className="text-red-500 ml-1">*</span></label>
              <div className="relative">
                <select {...register("paymentMode")} disabled={!editMode} className={`block w-full px-4 py-2 border rounded-lg appearance-none pr-8 ${errors.paymentMode ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(!editMode)}`}>
                  <option value="" disabled hidden>Select payment mode</option>
                  {paymentModes.map((mode, i) => (<option key={i} value={mode}>{mode}</option>))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><FaMoneyBillWave className="text-gray-400" /></div>
              </div>
              {errors.paymentMode && <p className="text-red-600 text-sm mt-1">{errors.paymentMode.message}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <div className="relative">
                <textarea {...register("remarks")} disabled={!editMode} placeholder="Enter any remarks" rows={3} className={`block w-full px-4 py-2 border rounded-lg pl-10 ${errors.remarks ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(!editMode)}`}/>
                <div className="absolute top-3 left-3 pointer-events-none"><FaComment className="text-gray-400" /></div>
              </div>
              {errors.remarks && <p className="text-red-600 text-sm mt-1">{errors.remarks.message}</p>}
            </div>
          </div>
        </div>

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