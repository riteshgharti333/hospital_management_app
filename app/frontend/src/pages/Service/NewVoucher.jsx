import React from "react";
import {
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaListAlt,
  FaUserTie,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaInfoCircle,
  FaHashtag,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { voucherSchema } from "@hospital/schemas";
import { useCreateVoucher } from "../../feature/transectionHooks/useVoucher";
import { useNavigate } from "react-router-dom";


const NewVoucher = () => {
  const navigate = useNavigate();
  // Static data
  const voucherTypes = ["Payment", "Receipt", "Journal"];
  const paymentModes = [
    "Cash", "Cheque", "Bank Transfer", "Card", "Online"
  ];
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D"];
  // NEW: Status options
  const statusOptions = ["Pending", "Approved", "Rejected", "Paid"];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      voucherDate: new Date().toISOString().split("T")[0],
      paymentFor: "",
      voucherType: "Payment",
      vendorName: "",
      paymentDate: "",
      amount: 0,
      paymentMode: "Cash",
      referenceNo: "",
      description: "",
      status: "Pending", 
    },
  });

  const { mutateAsync, isPending } = useCreateVoucher();

  const onSubmit = async (data) => {
    try {
      const response = await mutateAsync(data);
      if (response?.data?.success) {
         toast.success("Voucher created successfully!");
         navigate(`/voucher/${response?.data?.data?.id}`);
      }
    } catch (error) {
       toast.error(error?.response?.data?.message || "Failed to create voucher.");
    }
  };

  return (
    <div className="">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaFileInvoiceDollar className="mr-2 text-blue-600" />
              New Voucher Entry
            </h2>
            <p className="text-gray-600 mt-1">
              Please fill all required voucher details
            </p>
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
              Voucher Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voucher Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Voucher Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("voucherDate")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.voucherDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.voucherDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.voucherDate.message}
                </p>
              )}
            </div>

            {/* Payment For */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment For<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("paymentFor")}
                  placeholder="Enter payment purpose"
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.paymentFor ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaListAlt className="text-gray-400" />
                </div>
              </div>
              {errors.paymentFor && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.paymentFor.message}
                </p>
              )}
            </div>

            {/* Voucher Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Voucher Type<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("voucherType")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                    errors.voucherType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled selected hidden>
                    Select voucher type
                  </option>
                  {voucherTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaExchangeAlt className="text-gray-400" />
                </div>
              </div>
              {errors.voucherType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.voucherType.message}
                </p>
              )}
            </div>

            {/* Vendor Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Vendor Name<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("vendorName")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                    errors.vendorName ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled selected hidden>
                    Select vendor
                  </option>
                  {vendors.map((vendor, i) => (
                    <option key={i} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaUserTie className="text-gray-400" />
                </div>
              </div>
              {errors.vendorName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.vendorName.message}
                </p>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("paymentDate")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.paymentDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.paymentDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.paymentDate.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Amount<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}  
                  placeholder="Enter amount"
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
              </div>
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Payment Mode */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment Mode<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("paymentMode")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                    errors.paymentMode ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled selected hidden>
                    Select payment mode
                  </option>
                  {paymentModes.map((mode, i) => (
                    <option key={i} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" />
                </div>
              </div>
              {errors.paymentMode && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.paymentMode.message}
                </p>
              )}
            </div>

            {/* NEW FIELD: Reference No */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Reference No
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("referenceNo")}
                  placeholder="e.g., Cheque No, TXN ID"
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.referenceNo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaHashtag className="text-gray-400" />
                </div>
              </div>
              {errors.referenceNo && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.referenceNo.message}
                </p>
              )}
            </div>

            {/* NEW FIELD: Status */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Status<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("status")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {statusOptions.map((status, i) => (
                    <option key={i} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaInfoCircle className="text-gray-400" />
                </div>
              </div>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

             {/* NEW FIELD: Description */}
             <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows="3"
                placeholder="Enter any additional details or notes"
                className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Reset
          </button>
          <LoadingButton isLoading={isPending} type="submit">
            {isPending ? "Saving..." : "Save Voucher"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewVoucher;