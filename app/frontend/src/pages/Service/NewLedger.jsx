import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserMd,
  FaMoneyBillWave,
  FaUniversity,
  FaCalendarAlt,
  FaFileInvoice,
  FaSearch,
  FaCreditCard,
  FaStickyNote,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import BackButton from "../../components/BackButton/BackButton";
import { ledgerSchema } from "@hospital/schemas";
import { useCreateLedger } from "../../feature/hooks/useLedger";
import { useSearchPatients } from "../../feature/hooks/usePatient";
import { useSearchDoctors } from "../../feature/hooks/useDoctor";
import { useSearchCashAccounts } from "../../feature/hooks/useCash";
import { useSearchBanks } from "../../feature/hooks/useBank";
import {
  ENTITY_TYPES,
  REFERENCE_TYPES,
  AmountTypeEnum,
  PaymentModeEnum,
} from "@hospital/schemas";

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

const ledgerTypes = [
  {
    value: "PATIENT",
    label: "Patient Ledger",
    icon: <FaUser />,
    color: "blue",
    searchHook: useSearchPatients,
    searchPlaceholder: "Search patient by name or ID...",
    displayField: "fullName",
    secondaryField: "patientId",
  },
  {
    value: "DOCTOR",
    label: "Doctor Ledger",
    icon: <FaUserMd />,
    color: "green",
    searchHook: useSearchDoctors,
    searchPlaceholder: "Search doctor by name or registration...",
    displayField: "fullName",
    secondaryField: "registrationNo",
  },
  {
    value: "CASH",
    label: "Cash Ledger",
    icon: <FaMoneyBillWave />,
    color: "emerald",
    searchHook: useSearchCashAccounts,
    searchPlaceholder: "Search cash account by name...",
    displayField: "cashName",
    secondaryField: "code",
  },
  {
    value: "BANK",
    label: "Bank Ledger",
    icon: <FaUniversity />,
    color: "purple",
    searchHook: useSearchBanks,
    searchPlaceholder: "Search bank by name or account...",
    displayField: "bankName",
    secondaryField: "accountNo",
  },
];

// Search Results Dropdown Component (same style as Admission)
const SearchResults = ({ results, loading, onSelect, icon }) => (
  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
    {loading ? (
      <div className="p-3 text-center text-gray-500">Searching...</div>
    ) : results?.length > 0 ? (
      results.map((item, index) => (
        <div
          key={index}
          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          onClick={() => onSelect(item)}
        >
          <div className="flex items-center">
            <span className="mr-3 text-gray-500">{icon}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {item.fullName || item.cashName || item.bankName || item.name}
              </div>
              <div className="text-sm text-gray-600">
                {item.hospitalPatientId && `ID: ${item.hospitalPatientId}`}
                {item.registrationNo && `Reg: ${item.registrationNo}`}
                {item.code && `Code: ${item.code}`}
                {item.accountNo && `A/C: ${item.accountNo}`}
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="p-3 text-center text-gray-500">No results found</div>
    )}
  </div>
);

const NewLedger = () => {
  const [selectedLedgerType, setSelectedLedgerType] = useState(ledgerTypes[0]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navigate = useNavigate();
  const { mutateAsync: createLedger, isPending } = useCreateLedger();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ledgerSchema),
    defaultValues: {
      entityType: selectedLedgerType.value,
      entityId: "",
      transactionDate: new Date().toISOString().split("T")[0],
      description: "",
      amountType: "CREDIT",
      amount: "",
      paymentMode: "CASH",
      referenceType: "",
      referenceId: "",
      remarks: "",
    },
  });

  const entityType = watch("entityType");

  // Use the appropriate search hook based on selected ledger type
  const SearchHook = selectedLedgerType.searchHook;
  const { data: searchResults, isLoading: searching } = SearchHook(searchTerm, {
    enabled: searchTerm.length >= 2,
  });

  const handleLedgerTypeChange = (ledgerType) => {
    setSelectedLedgerType(ledgerType);
    setSelectedEntity(null);
    setSearchTerm("");
    setShowSearchResults(false);
    setValue("entityType", ledgerType.value);
    setValue("entityId", "");
  };

  // Update the handleEntitySelect function
  const handleEntitySelect = (entity) => {
    setSelectedEntity(entity);

    // Map the correct ID field based on ledger type
    let entityIdValue;
    switch (selectedLedgerType.value) {
      case "PATIENT":
        entityIdValue = entity.hospitalPatientId || entity.patientId;
        break;
      case "DOCTOR":
        entityIdValue = entity.registrationNo;
        break;
      case "CASH":
        entityIdValue = entity.code;
        break;
      case "BANK":
        entityIdValue = entity.code || entity.accountNo;
        break;
      default:
        entityIdValue = entity.id;
    }

    setValue("entityId", entityIdValue);
    setSearchTerm("");
    setShowSearchResults(false);
  };
  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearchResults && !event.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showSearchResults]);

  const onSubmit = async (data) => {
    if (!selectedEntity) {
      toast.error("Please select an entity");
      return;
    }

    // Validate enum values
    if (!ENTITY_TYPES.includes(data.entityType)) {
      toast.error("Invalid entity type");
      return;
    }

    if (data.referenceType && !REFERENCE_TYPES.includes(data.referenceType)) {
      toast.error("Invalid reference type");
      return;
    }

    const formattedData = {
      entityType: data.entityType,
      entityId: data.entityId,
      transactionDate: new Date(data.transactionDate).toISOString(),
      description: data.description,
      amountType: data.amountType,
      amount: Number(data.amount) || parseFloat(data.amount),
      paymentMode: data.paymentMode || "CASH",
      referenceType: data.referenceType || "",
      referenceId: data.referenceId?.trim() || "",
      remarks: data.remarks?.trim() || "",
    };

    console.log("Formatted data:", formattedData);

    try {
      const response = await createLedger(formattedData);
      if (response?.data?.success) {
        toast.success("Ledger entry created successfully");

        const ledgerId = response.data.data.id;

        // Redirect based on entity type with ID
        const redirectMap = {
          CASH: `/ledger/cash-ledger/${ledgerId}`,
          PATIENT: `/ledger/patient-ledger/${ledgerId}`,
          DOCTOR: `/ledger/doctor-ledger/${ledgerId}`,
          BANK: `/ledger/bank-ledger/${ledgerId}`,
        };

        const redirectPath =
          redirectMap[data.entityType] || `/ledger/${ledgerId}`;
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Error creating ledger:", error);
      toast.error(error.response?.data?.message || "Failed to create ledger");
    }
  };
  return (
    <div className="">
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

      {/* Ledger Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ledger Type<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ledgerTypes.map((ledger) => (
            <button
              key={ledger.value}
              type="button"
              onClick={() => handleLedgerTypeChange(ledger)}
              className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${
                selectedLedgerType.value === ledger.value
                  ? `border-${ledger.color}-500 bg-${ledger.color}-50 text-${ledger.color}-700`
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">{ledger.icon}</span>
              <span className="font-medium">{ledger.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          {/* Entity Search Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select {selectedLedgerType.label.split(" ")[0]}
              <span className="text-red-500 ml-1">*</span>
            </label>

            {/* Selected Entity Display */}
            {selectedEntity ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {selectedLedgerType.icon}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedEntity[selectedLedgerType.displayField]}
                    </p>

                    {selectedLedgerType.secondaryField && (
                      <p className="text-sm text-gray-600">
                        {selectedEntity[selectedLedgerType.secondaryField] ||
                          (selectedLedgerType.value === "PATIENT" &&
                            selectedEntity.hospitalPatientId) ||
                          (selectedLedgerType.value === "PATIENT" &&
                            selectedEntity.patientId)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEntity(null);
                    setValue("entityId", "");
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative search-container">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    placeholder={selectedLedgerType.searchPlaceholder}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* ✅ FIX 2: Same search dropdown design as Admission */}
                {showSearchResults && searchTerm.length >= 2 && (
                  <SearchResults
                    results={searchResults}
                    loading={searching}
                    onSelect={handleEntitySelect}
                    icon={selectedLedgerType.icon}
                  />
                )}
              </div>
            )}
            <input type="hidden" {...register("entityId")} />
          </div>

          {/* Transaction Details */}
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
                  className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.transactionDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
                placeholder="Enter transaction description"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                  errors.amountType ? "border-red-500" : "border-gray-300"
                }`}
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
                {...register("amount", {
                  valueAsNumber: true, // ✅ Convert to number automatically
                })}
                placeholder="Enter amount"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Payment Mode */}
            {/* Payment Mode - Map enum to camel case display */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment Mode
              </label>
              <div className="relative">
                <select
                  {...register("paymentMode")}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300"
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
            {/* Reference Type - Change to select */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Reference Type
              </label>
              <select
                {...register("referenceType")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" disabled selected hidden>
                  Select reference type
                </option>
                {REFERENCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {referenceTypeDisplay[type]}
                  </option>
                ))}
              </select>
              {errors.referenceType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.referenceType.message}
                </p>
              )}
            </div>

            {/* Reference ID */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Reference ID
              </label>
              <input
                type="text"
                {...register("referenceId")}
                placeholder="Enter reference ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  rows="3"
                  placeholder="Additional notes..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <FaStickyNote className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <LoadingButton
            type="submit"
            isLoading={isPending}
            disabled={!selectedEntity}
          >
            {isPending ? "Creating..." : "Create Ledger Entry"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewLedger;
