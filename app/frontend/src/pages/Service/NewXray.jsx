import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUser,
  FaUserMd,
  FaFileAlt,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useCreateXrayReport } from "../../feature/hooks/useXray";
import { xrayReportSchema } from "@hospital/schemas";

const NewXray = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateXrayReport();

  const departments = [
    "Radiology",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "General",
  ];
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(xrayReportSchema),
    defaultValues: {
      billDate: today,
      patientMobile: "",
      patientName: "",
      patientSex: "Male",
      age: 0,
      referredDoctor: "",
      testDate: today,
      reportDate: "",
      patientAddress: "",
      examDescription: "",
      department: "",
      billAmount: "",
      discountPercent: 0,
      netBillAmount: 0,
      commissionPercent: 0,
      doctorEarning: 0,
    },
  });

  const [billAmount, discountPercent, commissionPercent, netBillAmount] = watch(
    ["billAmount", "discountPercent", "commissionPercent", "netBillAmount"]
  );

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

  // --- REFACTORED onSubmit function ---
  const onSubmit = async (data) => {
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      // Trim strings and convert empty strings to undefined to be omitted
      if (typeof value === "string") {
        const trimmedValue = value.trim();
        if (trimmedValue) acc[key] = trimmedValue;
      } else if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await mutateAsync(cleanedData);

    if (response?.data?.success) {
      const newReportId = response.data.data.id;
      navigate(`/xray/${newReportId}`);
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <p className="text-red-600 text-sm mt-1">{errors[field].message}</p>
    );

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" />
              New X-ray Report
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for the X-ray report
            </p>
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
            {/* ... other patient fields ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bill Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("billDate")}
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.billDate ? "border-red-500" : "border-gray-300"
                  }`}
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
                placeholder="Enter 10-digit mobile"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.patientMobile ? "border-red-500" : "border-gray-300"
                }`}
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
                placeholder="Enter patient name"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.patientName ? "border-red-500" : "border-gray-300"
                }`}
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
                placeholder="e.g., 35"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
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
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("patientSex")}
                    value="Female"
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Female</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("patientSex")}
                    value="Other"
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
                  placeholder="Enter doctor name"
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.referredDoctor ? "border-red-500" : "border-gray-300"
                  }`}
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
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.testDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {renderError("testDate")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Report Date <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("reportDate")}
                  className={`block w-full px-4 py-2 border rounded-lg pl-10 ${
                    errors.reportDate ? "border-red-500" : "border-gray-300"
                  }`}
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
                className={`block w-full px-4 py-2 border rounded-lg bg-white ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled selected hidden>
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
                placeholder="Enter patient address"
                rows="2"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.patientAddress ? "border-red-500" : "border-gray-300"
                }`}
              />
              {renderError("patientAddress")}
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Exam / Description<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register("examDescription")}
                placeholder="e.g., Chest X-ray PA view"
                rows="2"
                className={`block w-full px-4 py-2 border rounded-lg ${
                  errors.examDescription ? "border-red-500" : "border-gray-300"
                }`}
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
                  placeholder="0.00"
                  step="0.01"
                  className={`block w-full px-4 py-2 border rounded-lg pl-8 ${
                    errors.billAmount ? "border-red-500" : "border-gray-300"
                  }`}
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
                  placeholder="0"
                  className={`block w-full px-4 py-2 border rounded-lg pr-8 ${
                    errors.discountPercent
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
                  placeholder="0"
                  className={`block w-full px-4 py-2 border rounded-lg pr-8 ${
                    errors.commissionPercent
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={() => window.location.reload()} // Simple reset by reloading the page
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Cancel
          </button>
          <LoadingButton isLoading={isPending} type="submit">
            {isPending ? "Saving..." : "Save Report"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewXray;
