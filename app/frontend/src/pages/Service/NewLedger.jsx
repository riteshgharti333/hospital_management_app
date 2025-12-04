import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import BackButton from "../../components/BackButton/BackButton";

// --- Import all your mutation hooks ---
import { useCreateBankLedgerEntry } from "../../feature/ledgerHook/useBankLedger";
import { useCreateCashLedgerEntry } from "../../feature/ledgerHook/useCashLedger";
import { useCreateDiagnosticsLedgerEntry } from "../../feature/ledgerHook/useDiagnosticsLedger";
import { useCreateDoctorLedgerEntry } from "../../feature/ledgerHook/useDoctorLedger";
import { useCreateExpenseEntry } from "../../feature/ledgerHook/useExpenseLedger";
import { useCreateInsuranceLedgerEntry } from "../../feature/ledgerHook/useInsuranceLedger";
import { useCreatePatientLedgerEntry } from "../../feature/ledgerHook/usePatientLedger";
import { useCreatePharmacyLedgerEntry } from "../../feature/ledgerHook/usePharmacyLedger";
import { useCreateSupplierLedgerEntry } from "../../feature/ledgerHook/useSupplierLedger";

// --- Schemas (assuming they are in a separate file as provided) ---
// (Your schema code goes here or is imported from @hospital/schemas)

// Example Schemas (Make sure these match your actual schema definitions)
// NOTE: I've corrected these schemas based on your form fields and common sense.
import { bankLedgerSchema } from "@hospital/schemas";
import { cashLedgerSchema } from "@hospital/schemas";
import { diagnosticsLedgerSchema } from "@hospital/schemas";
import { doctorLedgerSchema } from "@hospital/schemas";
import { expenseLedgerSchema } from "@hospital/schemas";
import { insuranceLedgerSchema } from "@hospital/schemas";
import { patientLedgerSchema } from "@hospital/schemas";
import { pharmacyLedgerSchema } from "@hospital/schemas";
import { supplierLedgerSchema } from "@hospital/schemas";

// --- Mappings for schemas, hooks, and navigation paths ---
const schemas = {
  Patient: patientLedgerSchema,
  Doctor: doctorLedgerSchema,
  Supplier: supplierLedgerSchema,
  Pharmacy: pharmacyLedgerSchema,
  Lab: diagnosticsLedgerSchema,
  Cash: cashLedgerSchema,
  Bank: bankLedgerSchema,
  Insurance: insuranceLedgerSchema,
  Expense: expenseLedgerSchema,
};

const mutationHooks = {
  Patient: useCreatePatientLedgerEntry,
  Doctor: useCreateDoctorLedgerEntry,
  Supplier: useCreateSupplierLedgerEntry,
  Pharmacy: useCreatePharmacyLedgerEntry,
  Lab: useCreateDiagnosticsLedgerEntry,
  Cash: useCreateCashLedgerEntry,
  Bank: useCreateBankLedgerEntry,
  Insurance: useCreateInsuranceLedgerEntry,
  Expense: useCreateExpenseEntry,
};

const navigationPaths = {
  Patient: "/ledger/patient-ledger",
  Doctor: "/ledger/doctor-ledger",
  Supplier: "/ledger/supplier-ledger",
  Pharmacy: "/ledger/pharmacy-ledger",
  Lab: "/ledger/lab-ledger",
  Cash: "/ledger/cash-ledger",
  Bank: "/ledger/bank-ledger",
  Insurance: "/ledger/insurance-ledger",
  Expense: "/ledger/expense-ledger",
};

// --- Main Component ---
const NewLedger = () => {
  const [selectedLedger, setSelectedLedger] = useState("Patient");

  const ledgerTypes = [
    { value: "Patient", label: "Patient Ledger", icon: <FaUser /> },
    { value: "Doctor", label: "Doctor Ledger", icon: <FaUserMd /> },
    // { value: "Supplier", label: "Supplier Ledger", icon: <FaTruck /> },
    // { value: "Pharmacy", label: "Pharmacy Ledger", icon: <FaPills /> },
    // { value: "Lab", label: "Lab Ledger", icon: <FaFlask /> },
    { value: "Cash", label: "Cash Ledger", icon: <FaMoneyBillAlt /> },
    { value: "Bank", label: "Bank Ledger", icon: <FaBuilding /> },
    // { value: "Insurance", label: "Insurance Ledger", icon: <FaFileMedical /> },
    // { value: "Expense", label: "Expense Ledger", icon: <FaFileInvoice /> },
  ];

  // More dynamic rendering of the form component
  const renderForm = () => {
    const ledgerType = selectedLedger;
    const schema = schemas[ledgerType];
    let formConfig;

    switch (ledgerType) {
      case "Patient":
        formConfig = patientFormConfig;
        break;
      case "Doctor":
        formConfig = doctorFormConfig;
        break;
      case "Supplier":
        formConfig = supplierFormConfig;
        break;
      case "Pharmacy":
        formConfig = pharmacyFormConfig;
        break;
      case "Lab":
        formConfig = labFormConfig;
        break;
      case "Cash":
        formConfig = cashFormConfig;
        break;
      case "Bank":
        formConfig = bankFormConfig;
        break;
      case "Insurance":
        formConfig = insuranceFormConfig;
        break;
      case "Expense":
        formConfig = expenseFormConfig;
        break;
      default:
        return null;
    }

    return (
      <BaseLedgerForm
        key={ledgerType}
        ledgerType={ledgerType}
        schema={schema}
        formConfig={formConfig}
      />
    );
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaFileInvoice className="mr-2 text-blue-500" />
              New Ledger Entry
            </h2>
            <p className="text-gray-600 mt-1">
              Select ledger type and enter transaction details
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ledger Type<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ledgerTypes.map((ledger) => (
            <button
              key={ledger.value}
              onClick={() => setSelectedLedger(ledger.value)}
              className={`flex items-center justify-center text-center cursor-pointer p-4 border rounded-lg transition-colors ${
                selectedLedger === ledger.value
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="mr-3 text-lg">{ledger.icon}</span>
              {ledger.label}
            </button>
          ))}
        </div>
      </div>

      {renderForm()}
    </div>
  );
};

// --- Form Configurations (FIXED to match schemas) ---

const patientFormConfig = {
  formTitle: "Patient Ledger",
  formIcon: <FaUser />,
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
  defaultValues: {
    patientName: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    amountType: "Debit",
    amount: 0,
    paymentMode: "Cash",
    transactionId: "",
    remarks: "",
  },
};

const doctorFormConfig = {
  formTitle: "Doctor Ledger",
  formIcon: <FaUserMd />,
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
  defaultValues: {
    doctorName: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    amountType: "Debit",
    amount: 0,
    paymentMode: "Bank",
    transactionId: "",
    remarks: "",
  },
};

const supplierFormConfig = {
  formTitle: "Supplier Ledger",
  formIcon: <FaTruck />,
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
  defaultValues: {
    supplierName: "",
    date: new Date().toISOString().split("T")[0],
    invoiceNo: "",
    description: "",
    amountType: "Debit",
    amount: 0,
    paymentMode: "Bank",
    transactionId: "",
    attachBill: null,
    remarks: "",
  },
};

const pharmacyFormConfig = {
  formTitle: "Pharmacy Ledger",
  formIcon: <FaPills />,
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
  defaultValues: {
    date: new Date().toISOString().split("T")[0],
    medicineName: "",
    category: "",
    description: "",
    amountType: "Income",
    amount: 0,
    paymentMode: "Cash",
    remarks: "",
  },
};

const labFormConfig = {
  formTitle: "Lab/Diagnostics Ledger",
  formIcon: <FaFlask />,
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
  defaultValues: {
    patientName: "",
    date: new Date().toISOString().split("T")[0],
    testName: "",
    description: "",
    amount: 0,
    paymentMode: "Cash",
    attachReport: null,
    remarks: "",
  },
};

const cashFormConfig = {
  formTitle: "Cash Ledger",
  formIcon: <FaMoneyBillAlt />,
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
  defaultValues: {
    date: new Date().toISOString().split("T")[0],
    purpose: "",
    amountType: "Income",
    amount: 0,
    remarks: "",
  },
};

const bankFormConfig = {
  formTitle: "Bank Ledger",
  formIcon: <FaBuilding />,
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
  defaultValues: {
    bankName: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    amountType: "Debit",
    amount: 0,
    transactionId: "",
    remarks: "",
  },
};

const insuranceFormConfig = {
  formTitle: "Insurance/TPA Ledger",
  formIcon: <FaFileMedical />,
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
  defaultValues: {
    patientName: "",
    tpaInsuranceCompany: "",
    claimDate: new Date().toISOString().split("T")[0],
    claimAmount: 0,
    approvedAmount: 0,
    settledAmount: 0,
    status: "Pending",
    remarks: "",
    approvalDate: "",
    settlementDate: "",
  },
};

const expenseFormConfig = {
  formTitle: "General Expense Ledger",
  formIcon: <FaFileInvoice />,
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
  defaultValues: {
    expenseCategory: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    paymentMode: "Cash",
    transactionId: "",
    remarks: "",
  },
};

// --- The Reusable Base Form Component (with API logic) ---
const BaseLedgerForm = ({ ledgerType, schema, formConfig }) => {
  const navigate = useNavigate();

  // Dynamically select the correct mutation hook
  const { mutateAsync, isPending } = mutationHooks[ledgerType]();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formConfig.defaultValues,
  });

  const onSubmit = async (data) => {
    // Handle date fields safely
    const processedData = {
      ...data,
      // Convert only valid dates to ISO strings
      ...(data.date && { date: new Date(data.date).toISOString() }),
      // Special handling for insurance ledger dates
      ...(ledgerType === "Insurance" && {
        ...(data.claimDate && {
          claimDate: new Date(data.claimDate).toISOString(),
        }),
        ...(data.approvalDate && {
          approvalDate: new Date(data.approvalDate).toISOString(),
        }),
        ...(data.settlementDate && {
          settlementDate: new Date(data.settlementDate).toISOString(),
        }),
      }),
    };

    // Handle file attachments
    const cleanedData = {
      ...processedData,
      ...(data.attachBill && {
        attachBill: "https://example.com/dummy-bill.pdf",
      }),
      ...(data.attachReport && {
        attachReport: "https://example.com/dummy-report.pdf",
      }),
    };

    // Clean empty values
    Object.keys(cleanedData).forEach((key) => {
      if (cleanedData[key] === undefined || cleanedData[key] === "") {
        delete cleanedData[key];
      }
    });

    try {
      const response = await mutateAsync(cleanedData);
      if (response?.data?.success) {
        navigate(`${navigationPaths[ledgerType]}/${response.data.data.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCancel = () => {
    reset(formConfig.defaultValues);
    toast.info("Form reset.");
  };

  return (
    <LedgerFormUI
      fields={formConfig.fields}
      formTitle={formConfig.formTitle}
      formIcon={formConfig.formIcon}
      register={register}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isSubmitting={isPending} // Use isPending from the mutation
    />
  );
};

// --- Reusable UI Component ---
const LedgerFormUI = ({
  fields,
  formTitle,
  formIcon,
  register,
  errors,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const getInputClass = (fieldName) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
      noValidate
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <span className="text-xl text-blue-500">{formIcon}</span>
          <h3 className="ml-3 text-lg font-semibold text-gray-800">
            {formTitle}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`space-y-1 ${
                field.type === "textarea" ? "md:col-span-2" : ""
              }`}
            >
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  {...register(field.name)}
                  className={`${getInputClass(field.name)}  bg-white pr-8`}
                >
                  <option disabled selected hidden>
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
                  id={field.name}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  rows="3"
                  className={getInputClass(field.name)}
                />
              ) : field.type === "file" ? (
                <input
                  id={field.name}
                  type="file"
                  {...register(field.name)}
                  className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${getInputClass(
                    field.name
                  )}`}
                />
              ) : (
                <div className="relative">
                  <input
                    id={field.name}
                    type={field.type}
                    {...register(field.name, {
                      valueAsNumber: field.type === "number",
                    })}
                    placeholder={field.placeholder}
                    className={`${getInputClass(field.name)} ${
                      field.icon ? "pl-10" : ""
                    }`}
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

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
        >
          Cancel
        </button>
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Save Ledger
        </LoadingButton>
      </div>
    </form>
  );
};

export default NewLedger;
