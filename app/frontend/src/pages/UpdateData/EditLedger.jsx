import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUser,
  FaUserMd,
  FaTruck,
  FaPills,
  FaFlask,
  FaMoneyBillAlt,
  FaBuilding,
  FaFileInvoice,
  FaFileMedical,
  FaCalendarAlt,
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

// --- Import all your hooks (assuming they exist) ---
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
  useGetDiagnosticsLedgerEntryById,
  useUpdateDiagnosticsLedgerEntry,
  useDeleteDiagnosticsLedgerEntry,
} from "../../feature/ledgerHook/useDiagnosticsLedger";
import {
  useGetDoctorLedgerEntryById,
  useUpdateDoctorLedgerEntry,
  useDeleteDoctorLedgerEntry,
} from "../../feature/ledgerHook/useDoctorLedger";
import {
  useGetExpenseEntryById,
  useUpdateExpenseEntry,
  useDeleteExpenseEntry,
} from "../../feature/ledgerHook/useExpenseLedger";
import {
  useGetInsuranceLedgerEntryById,
  useUpdateInsuranceLedgerEntry,
  useDeleteInsuranceLedgerEntry,
} from "../../feature/ledgerHook/useInsuranceLedger";
import {
  useGetPatientLedgerEntryById,
  useUpdatePatientLedgerEntry,
  useDeletePatientLedgerEntry,
} from "../../feature/ledgerHook/usePatientLedger";
import {
  useGetPharmacyLedgerEntryById,
  useUpdatePharmacyLedgerEntry,
  useDeletePharmacyLedgerEntry,
} from "../../feature/ledgerHook/usePharmacyLedger";
import {
  useGetSupplierLedgerEntryById,
  useUpdateSupplierLedgerEntry,
  useDeleteSupplierLedgerEntry,
} from "../../feature/ledgerHook/useSupplierLedger";

// --- Import all your schemas ---
import {
  bankLedgerSchema,
  cashLedgerSchema,
  diagnosticsLedgerSchema,
  doctorLedgerSchema,
  expenseLedgerSchema,
  insuranceLedgerSchema,
  patientLedgerSchema,
  pharmacyLedgerSchema,
  supplierLedgerSchema,
} from "@hospital/schemas";

// --- Mappings for dynamic hook and config selection ---
const ledgerMappings = {
  patient: {
    schema: patientLedgerSchema,
    getHook: useGetPatientLedgerEntryById,
    updateHook: useUpdatePatientLedgerEntry,
    deleteHook: useDeletePatientLedgerEntry,
    config: {
      /* Patient Form Config */
    },
    title: "Patient Ledger",
    icon: <FaUser />,
    navPath: "/ledger/patient-ledger",
  },
  doctor: {
    schema: doctorLedgerSchema,
    getHook: useGetDoctorLedgerEntryById,
    updateHook: useUpdateDoctorLedgerEntry,
    deleteHook: useDeleteDoctorLedgerEntry,
    config: {
      /* Doctor Form Config */
    },
    title: "Doctor Ledger",
    icon: <FaUserMd />,
    navPath: "/ledger/doctor-ledger",
  },
  supplier: {
    schema: supplierLedgerSchema,
    getHook: useGetSupplierLedgerEntryById,
    updateHook: useUpdateSupplierLedgerEntry,
    deleteHook: useDeleteSupplierLedgerEntry,
    config: {
      /* Supplier Form Config */
    },
    title: "Supplier Ledger",
    icon: <FaTruck />,
    navPath: "/ledger/supplier-ledger",
  },
  pharmacy: {
    schema: pharmacyLedgerSchema,
    getHook: useGetPharmacyLedgerEntryById,
    updateHook: useUpdatePharmacyLedgerEntry,
    deleteHook: useDeletePharmacyLedgerEntry,
    config: {
      /* Pharmacy Form Config */
    },
    title: "Pharmacy Ledger",
    icon: <FaPills />,
    navPath: "/ledger/pharmacy-ledger",
  },
  lab: {
    schema: diagnosticsLedgerSchema,
    getHook: useGetDiagnosticsLedgerEntryById,
    updateHook: useUpdateDiagnosticsLedgerEntry,
    deleteHook: useDeleteDiagnosticsLedgerEntry,
    config: {
      /* Lab Form Config */
    },
    title: "Lab Ledger",
    icon: <FaFlask />,
    navPath: "/ledger/lab-ledger",
  },
  cash: {
    schema: cashLedgerSchema,
    getHook: useGetCashLedgerEntryById,
    updateHook: useUpdateCashLedgerEntry,
    deleteHook: useDeleteCashLedgerEntry,
    config: {
      /* Cash Form Config */
    },
    title: "Cash Ledger",
    icon: <FaMoneyBillAlt />,
    navPath: "/ledger/cash-ledger",
  },
  bank: {
    schema: bankLedgerSchema,
    getHook: useGetBankLedgerEntryById,
    updateHook: useUpdateBankLedgerEntry,
    deleteHook: useDeleteBankLedgerEntry,
    config: {
      /* Bank Form Config */
    },
    title: "Bank Ledger",
    icon: <FaBuilding />,
    navPath: "/ledger/bank-ledger",
  },
  insurance: {
    schema: insuranceLedgerSchema,
    getHook: useGetInsuranceLedgerEntryById,
    updateHook: useUpdateInsuranceLedgerEntry,
    deleteHook: useDeleteInsuranceLedgerEntry,
    config: {
      /* Insurance Form Config */
    },
    title: "Insurance Ledger",
    icon: <FaFileMedical />,
    navPath: "/ledger/insurance-ledger",
  },
  expense: {
    schema: expenseLedgerSchema,
    getHook: useGetExpenseEntryById,
    updateHook: useUpdateExpenseEntry,
    deleteHook: useDeleteExpenseEntry,
    config: {
      /* Expense Form Config */
    },
    title: "Expense Ledger",
    icon: <FaFileInvoice />,
    navPath: "/ledger/expense-ledger",
  },
};

// --- (Your form config objects would be here) ---
// I'm using placeholder objects; in a real app, these would be your detailed configs.
// To keep the code clean, these could be imported from a separate file.
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
        name: "date",
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
        options: ["Debit", "Credit"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["Cash", "Card", "UPI", "Insurance"],
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
      { name: "date", label: "Date", type: "date", required: true },
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
        options: ["Debit", "Credit"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["Bank", "UPI", "Cash"],
        required: true,
      },
      { name: "transactionId", label: "Transaction ID", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  supplier: {
    fields: [
      {
        name: "supplierName",
        label: "Supplier Name",
        type: "text",
        icon: <FaTruck />,
        required: true,
      },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "invoiceNo", label: "Invoice No.", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Gloves order, Medicine refund etc.",
        required: true,
      },
      {
        name: "amountType",
        label: "Amount Type",
        type: "select",
        options: ["Debit", "Credit"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["Bank", "UPI", "Cheque", "Cash"],
      },
      { name: "transactionId", label: "Transaction ID", type: "text" },
      { name: "attachBill", label: "Attach Bill", type: "file" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  pharmacy: {
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
      {
        name: "medicineName",
        label: "Medicine Name",
        type: "text",
        icon: <FaPills />,
        required: true,
      },
      {
        name: "category",
        label: "Category",
        type: "text",
        placeholder: "e.g., Antibiotics, Analgesics",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Patient sale, Restocking etc.",
        required: true,
      },
      {
        name: "amountType",
        label: "Amount Type",
        type: "select",
        options: ["Income", "Expense"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["Cash", "Card", "UPI"],
        required: true,
      },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  lab: {
    fields: [
      {
        name: "patientName",
        label: "Patient Name",
        type: "text",
        icon: <FaUser />,
        required: true,
      },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "testName", label: "Test Name", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "MRI, X-Ray, Blood test etc.",
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["Cash", "Card", "UPI", "Insurance"],
        required: true,
      },
      { name: "attachReport", label: "Attach Report", type: "file" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  cash: {
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
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
        options: ["Income", "Expense"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  bank: {
    fields: [
      { name: "bankName", label: "Bank Name", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
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
        options: ["Debit", "Credit"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "transactionId", label: "Transaction ID", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  insurance: {
    fields: [
      {
        name: "patientName",
        label: "Patient Name",
        type: "text",
        icon: <FaUser />,
        required: true,
      },
      {
        name: "tpaInsuranceCompany",
        label: "TPA/Insurance Company",
        type: "text",
        required: true,
      },
      { name: "claimDate", label: "Claim Date", type: "date", required: true },
      {
        name: "claimAmount",
        label: "Claim Amount",
        type: "number",
        required: true,
      },
      { name: "approvedAmount", label: "Approved Amount", type: "number" },
      { name: "settledAmount", label: "Settled Amount", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          "Pending",
          "Approved",
          "Rejected",
          "Partially Approved",
          "Settled",
        ],
        required: true,
      },
      { name: "approvalDate", label: "Approval Date", type: "date" },
      { name: "settlementDate", label: "Settlement Date", type: "date" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
  expense: {
    fields: [
      {
        name: "expenseCategory",
        label: "Expense Category",
        type: "select",
        options: [
          "Utilities",
          "Salaries",
          "Maintenance",
          "Office Supplies",
          "Medical Supplies",
          "Rent",
          "Others",
        ],
        required: true,
      },
      { name: "date", label: "Date", type: "date", required: true },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Electricity bill for May etc.",
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMode",
        label: "Payment Mode",
        type: "select",
        options: ["Cash", "Bank", "UPI", "Cheque"],
        required: true,
      },
      { name: "transactionId", label: "Transaction ID", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
};

const EditLedger = () => {
  const { ledgerType, id } = useParams();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- Dynamically select the correct configuration ---
  const currentLedger = ledgerMappings[ledgerType];
  const formConfig = allFormConfigs[ledgerType];

  if (!currentLedger || !formConfig) {
    return <NoData message={`Invalid ledger type: ${ledgerType}`} />;
  }

  // --- Dynamically instantiate hooks ---
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
  });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  useEffect(() => {
    if (ledgerData) {
      // Format date fields before resetting the form
      const formattedData = { ...ledgerData };
      formConfig.fields.forEach((field) => {
        if (field.type === "date" && formattedData[field.name]) {
          formattedData[field.name] = formattedData[field.name].split("T")[0];
        }
      });
      reset(formattedData);
    }
  }, [ledgerData, reset, formConfig.fields]);

  const onSubmit = async (formData) => {
    try {
      const response = await updateLedgerEntry({ id, data: formData });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to update ${currentLedger.title}`
      );
    }
  };

  const handleCancel = () => {
    reset(ledgerData);
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
      toast.error(
        error?.response?.data?.message ||
          `Failed to delete ${currentLedger.title}`
      );
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
                ) : (
                  <div className="relative">
                    <input
                      type={field.type}
                      {...register(field.name, {
                        valueAsNumber: field.type === "number",
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
