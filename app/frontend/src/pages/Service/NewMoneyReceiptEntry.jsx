import React, { useState } from "react";
import {
  FaIdCard,
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaSearch,
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
const status = ["Active", "Cancelled", "Refunded"];

const NewMoneyReceiptEntry = () => {
  const navigate = useNavigate();

  const [searchAdmission, setSearchAdmission] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  // Enable the query only when search term has at least 2 characters
  const { data: admissionResults = [], isLoading: searchingAdmissions } =
  useSearchAdmissions(searchAdmission, {
    enabled: searchAdmission && searchAdmission.length >= 2,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moneyReceiptSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      admissionNo: "",
      patientName: "",
      mobile: "",
      amount: "",
      paymentMode: "Cash",
      remarks: "",
      receivedBy: "",
      status: "Active",
    },
  });

  const { mutateAsync, isPending } = useCreateMoneyReceipt();

  const handleSelectAdmission = (item) => {
    console.log("Selected admission:", item);

    setSelectedAdmission(item);

    // Extract admission number from the item
    const admissionNo = item.hospitalAdmissionId;

    // Extract patient name
    const patientName = item.patient?.fullName;
    // Extract phone number
    const mobile = item.patient?.mobileNumber;

    setSearchAdmission(admissionNo);
    setShowDropdown(false);

    setValue("admissionNo", admissionNo);
    setValue("patientName", patientName);
    setValue("mobile", mobile);

    toast.success("Patient details auto-filled");
  };

  const onSubmit = async (data) => {
    const response = await mutateAsync(data);
    if (response?.data?.success) {
      navigate(`/money-receipt/${response.data.data.id}`);
    }
  };

  const inputClass = (error) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`;

  // Helper function to safely display admission info
  const getAdmissionDisplayInfo = (item) => {
    const admissionNo =
      item.hospitalAdmissionId 

    const patientName =
      item.patient?.fullName 

    const patientId =
      item.patient?.hospitalPatientId 

    return { admissionNo, patientName, patientId };
  };

  return (
    <div className="mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-blue-500" />
              New Money Receipt
            </h2>
            <p className="text-gray-600 mt-1">
              Fill all required details to generate a receipt
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* =======================
            ADMISSION SEARCH
        ======================== */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4">
            <FaIdCard className="text-blue-500 mr-2" />
            Admission Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admission No */}
            <div className="space-y-1 relative">
              <label className="block text-sm font-medium text-gray-700">
                Admission No<span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={searchAdmission}
                  onChange={(e) => {
                    setSearchAdmission(e.target.value);
                    setValue("admissionNo", e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchAdmission.length >= 2) {
                      setShowDropdown(true);
                    }
                  }}
                  placeholder="Search admission number (min. 2 characters)"
                  autoComplete="off"
                  className={`${inputClass(errors.admissionNo)} pl-10`}
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchAdmission.length >= 2 && (
                <ul className="absolute z-50 bg-white w-full border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                  {searchingAdmissions ? (
                    <li className="px-4 py-3 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Searching admissions...
                      </div>
                    </li>
                  ) : admissionResults && admissionResults.length > 0 ? (
                    admissionResults.slice(0, 10).map((item) => {
                      const { admissionNo, patientName, patientId } =
                        getAdmissionDisplayInfo(item);

                      return (
                        <li
                          key={item.id}
                          onClick={() => handleSelectAdmission(item)}
                          className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {patientName}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Admission:
                                  </span>{" "}
                                  {admissionNo}
                                </p>
                                {patientId && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">
                                      Patient ID:
                                    </span>{" "}
                                    {patientId}
                                  </p>
                                )}
                              </div>
                              {item.admissionDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Admitted:{" "}
                                  {new Date(
                                    item.admissionDate,
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <FaIdCard className="text-gray-400 ml-3" />
                          </div>
                        </li>
                      );
                    })
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

              {errors.admissionNo && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.admissionNo.message}
                </p>
              )}
            </div>

            {/* Patient Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  {...register("patientName")}
                  className={`${inputClass(
                    errors.patientName,
                  )} bg-gray-100 cursor-not-allowed pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
              </div>

              {errors.patientName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patientName.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  {...register("mobile")}
                  className={`${inputClass(
                    errors.mobile,
                  )} bg-gray-100 cursor-not-allowed pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
              </div>

              {errors.mobile && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
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
              <input
                type="date"
                {...register("date")}
                className={inputClass(errors.date)}
              />

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
                placeholder="Enter amount"
                className={inputClass(errors.amount)}
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
                className={inputClass(errors.paymentMode)}
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
                placeholder="Enter staff name"
                className={inputClass(errors.receivedBy)}
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
                className={inputClass(errors.status)}
              >
                {status.map((s) => (
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
                placeholder="Optional remarks"
                className={inputClass(errors.remarks)}
              />

              {errors.remarks && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.remarks.message}
                </p>
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
