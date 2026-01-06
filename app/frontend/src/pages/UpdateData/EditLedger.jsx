import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaUser,
  FaUserMd,
  FaMoneyBillAlt,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  useGetBankLedgerEntryById,
  useUpdateBankLedgerEntry,
  useDeleteBankLedgerEntry,
} from "../../feature/ledgerHook/useBankLedger";
import {
  useGetCashLedgerEntryById,
  useUpdateCashLedgerEntry,
  useDeleteCashLedgerEntry,
} from "../../feature/ledgerHook/useCashLedger";
import {
  useGetDoctorLedgerEntryById,
  useUpdateDoctorLedgerEntry,
  useDeleteDoctorLedgerEntry,
} from "../../feature/ledgerHook/useDoctorLedger";
import {
  useGetPatientLedgerEntryById,
  useUpdatePatientLedgerEntry,
  useDeletePatientLedgerEntry,
} from "../../feature/ledgerHook/usePatientLedger";

// --- Updated Schemas ---
const AmountTypeEnum = z.enum(["CREDIT", "DEBIT"]);
const CashAmountTypeEnum = z.enum(["INCOME", "EXPENSE"]);
const PaymentModeEnum = z.enum([
  "CASH",
  "CARD",
  "UPI",
  "BANK_TRANSFER",
  "CHEQUE",
]);
const requiredDate = z.preprocess(
  (val) => {
    if (val === undefined || val === null || val === "") {
      return undefined;
    }
    return new Date(val);
  },
  z.date({
    required_error: "Date is required",
    invalid_type_error: "Date is required",
  })
);

export const bankLedgerSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  transactionDate: requiredDate,
  description: z.string().min(1, "Description is required"),
  amountType: AmountTypeEnum,
  amount: z.number().positive("Amount must be positive"),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export const cashLedgerSchema = z.object({
  transactionDate: requiredDate,
  purpose: z.string().min(1, "Purpose is required"),
  amountType: CashAmountTypeEnum,
  amount: z.number().positive("Amount must be positive"),
  remarks: z.string().optional(),
});

export const doctorLedgerSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  transactionDate: requiredDate,
  description: z.string().min(1, "Description is required"),
  amountType: AmountTypeEnum,
  amount: z.number().positive("Amount must be positive"),
  paymentMode: PaymentModeEnum,
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export const patientLedgerSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  transactionDate: requiredDate,
  description: z.string().min(1, "Description is required"),
  amountType: AmountTypeEnum,
  amount: z.number().positive("Amount must be positive"),
  paymentMode: PaymentModeEnum,
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

// --- Mappings for dynamic hook and config selection ---
const ledgerMappings = {
  patient: {
    schema: patientLedgerSchema,
    getHook: useGetPatientLedgerEntryById,
    updateHook: useUpdatePatientLedgerEntry,
    deleteHook: useDeletePatientLedgerEntry,
    config: "patient",
    title: "Patient Ledger",
    icon: <FaUser />,
    navPath: "/ledger/patient-ledger",
  },
  doctor: {
    schema: doctorLedgerSchema,
    getHook: useGetDoctorLedgerEntryById,
    updateHook: useUpdateDoctorLedgerEntry,
    deleteHook: useDeleteDoctorLedgerEntry,
    config: "doctor",
    title: "Doctor Ledger",
    icon: <FaUserMd />,
    navPath: "/ledger/doctor-ledger",
  },
  cash: {
    schema: cashLedgerSchema,
    getHook: useGetCashLedgerEntryById,
    updateHook: useUpdateCashLedgerEntry,
    deleteHook: useDeleteCashLedgerEntry,
    config: "cash",
    title: "Cash Ledger",
    icon: <FaMoneyBillAlt />,
    navPath: "/ledger/cash-ledger",
  },
  bank: {
    schema: bankLedgerSchema,
    getHook: useGetBankLedgerEntryById,
    updateHook: useUpdateBankLedgerEntry,
    deleteHook: useDeleteBankLedgerEntry,
    config: "bank",
    title: "Bank Ledger",
    icon: <FaBuilding />,
    navPath: "/ledger/bank-ledger",
  },
};

const allFormConfigs = {
  patient: {
    fields: [
      {
        name: "patientName",
        label: "Patient Name",
        type: "text",
        icon: <FaUser />,
        required: true,
      },
      {
        name: "transactionDate",
        label: "Date",
        type: "date",
        icon: <FaCalendarAlt />,
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "X-ray, OPD fees etc.",
        required: true,
      },
      {
        name: "amountType",
        label: "Amount Type",
        type: "select",
        options: ["CREDIT", "DEBIT"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"],
        required: true,
      },
      { name: "transactionId", label: "Transaction ID", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  doctor: {
    fields: [
      {
        name: "doctorName",
        label: "Doctor Name",
        type: "text",
        icon: <FaUserMd />,
        required: true,
      },
      {
        name: "transactionDate",
        label: "Date",
        type: "date",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Consultation share, Salary payment etc.",
        required: true,
      },
      {
        name: "amountType",
        label: "Amount Type",
        type: "select",
        options: ["CREDIT", "DEBIT"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"],
        required: true,
      },
      { name: "transactionId", label: "Transaction ID", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  cash: {
    fields: [
      {
        name: "transactionDate",
        label: "Date",
        type: "date",
        required: true,
      },
      {
        name: "purpose",
        label: "Purpose",
        type: "text",
        placeholder: "Cash received from OPD, Cash expense etc.",
        required: true,
      },
      {
        name: "amountType",
        label: "Amount Type",
        type: "select",
        options: ["INCOME", "EXPENSE"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  bank: {
    fields: [
      { name: "bankName", label: "Bank Name", type: "text", required: true },
      {
        name: "transactionDate",
        label: "Date",
        type: "date",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Doctor payment, Supplier payment etc.",
        required: true,
      },
      {
        name: "amountType",
        label: "Amount Type",
        type: "select",
        options: ["CREDIT", "DEBIT"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "transactionId", label: "Transaction ID", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
};

const EditLedger = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract ledger type from URL path
  const pathSegments = location.pathname.split("/");
  const ledgerType = pathSegments[2];

  const cleanLedgerType = ledgerType.replace("-ledger", "");

  // --- Dynamically select the correct configuration ---
  const currentLedger = ledgerMappings[cleanLedgerType];
  const formConfig = allFormConfigs[cleanLedgerType];

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!currentLedger || !formConfig) {
    return <NoData message={`Invalid ledger type: ${cleanLedgerType}`} />;
  }

  const { data: ledgerData, isLoading } = currentLedger.getHook(id);
  const { mutateAsync: updateLedgerEntry, isPending: isUpdating } =
    currentLedger.updateHook();
  const { mutateAsync: deleteLedgerEntry, isPending: isDeleting } =
    currentLedger.deleteHook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(currentLedger.schema),
    defaultValues: {}, // Add default values
  });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  useEffect(() => {
    if (ledgerData) {
      // Format data before resetting the form
      const formattedData = { ...ledgerData };
      
      formConfig.fields.forEach((field) => {
        const value = formattedData[field.name];
        
        // Handle date fields
        if (field.type === "date" && value) {
          formattedData[field.name] = new Date(value).toISOString().split("T")[0];
        }
        
        // Handle number fields - convert string to number
        if (field.type === "number" && value !== undefined && value !== null) {
          formattedData[field.name] = Number(value);
        }
        
        // Handle optional fields - convert null to empty string
        if (field.name === "transactionId" || field.name === "remarks") {
          formattedData[field.name] = value === null ? "" : value;
        }
      });
      
      reset(formattedData);
    }
  }, [ledgerData, reset, formConfig.fields]);

  const onSubmit = async (formData) => {
    try {
      // Convert date string to Date object for schema validation
      const processedData = {
        ...formData,
        ...(formData.transactionDate && {
          transactionDate: new Date(formData.transactionDate),
        }),
      };

      // Convert amount to number if it's a string
      if (typeof processedData.amount === 'string') {
        processedData.amount = Number(processedData.amount);
      }

      // Clean empty values - convert empty strings to undefined for optional fields
      Object.keys(processedData).forEach((key) => {
        if (processedData[key] === undefined || processedData[key] === "") {
          // For optional fields, set to undefined instead of deleting
          if (key === "transactionId" || key === "remarks") {
            processedData[key] = undefined;
          } else {
            delete processedData[key];
          }
        }
      });

      console.log("Submitting data:", processedData); // Debug log
      
      const response = await updateLedgerEntry({ id, data: processedData });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log("Error submitting:", error);
      toast.error("Failed to update ledger entry");
    }
  };

  const handleCancel = () => {
    if (ledgerData) {
      // Reset with properly formatted data
      const formattedData = { ...ledgerData };
      formConfig.fields.forEach((field) => {
        const value = formattedData[field.name];
        
        if (field.type === "date" && value) {
          formattedData[field.name] = new Date(value).toISOString().split("T")[0];
        }
        
        if (field.type === "number" && value !== undefined && value !== null) {
          formattedData[field.name] = Number(value);
        }
        
        if (field.name === "transactionId" || field.name === "remarks") {
          formattedData[field.name] = value === null ? "" : value;
        }
      });
      reset(formattedData);
    }
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteLedgerEntry(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate(currentLedger.navPath);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete ledger entry");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!ledgerData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <span className="mr-2 text-blue-500">{currentLedger.icon}</span>
              {editMode
                ? `Edit ${currentLedger.title}`
                : `View ${currentLedger.title}`}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formConfig.fields.map((field) => (
              <div
                key={field.name}
                className={`space-y-1 ${
                  field.type === "textarea" ? "md:col-span-2" : ""
                }`}
              >
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {field.type === "select" ? (
                  <select
                    {...register(field.name)}
                    disabled={!editMode}
                    className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    } ${getDisabledStyles(!editMode)}`}
                  >
                    <option value="" disabled hidden>
                      Select {field.label}
                    </option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    {...register(field.name)}
                    disabled={!editMode}
                    rows={3}
                    placeholder={field.placeholder}
                    className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    } ${getDisabledStyles(!editMode)}`}
                  />
                ) : field.type === "number" ? (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      {...register(field.name, {
                        valueAsNumber: true, // This tells react-hook-form to parse as number
                      })}
                      disabled={!editMode}
                      placeholder={field.placeholder}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        field.icon ? "pl-10" : ""
                      } ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                    {field.icon && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {field.icon}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type={field.type}
                      {...register(field.name)}
                      disabled={!editMode}
                      placeholder={field.placeholder}
                      className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        field.icon ? "pl-10" : ""
                      } ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                    {field.icon && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {field.icon}
                      </div>
                    )}
                  </div>
                )}

                {errors[field.name] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}
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

export default EditLedger;