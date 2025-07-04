import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaListAlt,
  FaMobileAlt,
  FaIdCard,
  FaUser,
  FaHome,
  FaUserMd,
  FaBed,
  FaBox,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

import { billSchema } from "@hospital/schemas";
import { useCreateBill } from "../../feature/transectionHooks/useBill";

const NewBillEntry = () => {
  const [productData, setProductData] = useState({
    company: "",
    itemOrService: "",
    quantity: 1,
    mrp: "",
    totalAmount: "",
  });

  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateBill();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(billSchema),
    defaultValues: {
      billDate: new Date().toISOString().split("T")[0],
      billType: "",
      mobile: "",
      admissionNo: "",
      admissionDate: "",
      dateOfBirth: "",
      gender: "Male",
      dischargeDate: "",
      address: "",
      doctorName: "",
      wardNo: "",
      bedNo: "",
      billItems: [],
      status: "Pending",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "billItems",
  });

  const watchedItems = useWatch({ control, name: "billItems" });

  const billTypes = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"];
  const genders = ["Male", "Female", "Other"];
  const doctors = ["Dr. Sharma", "Dr. Mehta", "Dr. Gupta", "Dr. Roy"];
  const wards = ["Ward 1", "Ward 2", "Ward 3", "ICU", "Emergency"];
  const beds = ["Bed 1", "Bed 2", "Bed 3", "Bed 4", "Bed 5"];
  const companies = ["Company A", "Company B", "Company C", "Company D"];
  const services = ["Service 1", "Service 2", "Service 3", "Service 4"];

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => {
      const updatedData = {
        ...prev,
        [name]: name === "quantity" ? parseInt(value, 10) || 1 : value,
      };

      // Calculate total amount if both quantity and mrp are available
      if (name === "quantity" || name === "mrp") {
        const quantity =
          name === "quantity" ? parseInt(value, 10) || 1 : prev.quantity;
        const mrp =
          name === "mrp" ? parseFloat(value) || 0 : parseFloat(prev.mrp) || 0;
        updatedData.totalAmount = (quantity * mrp).toFixed(2);
      }

      return updatedData;
    });
  };

  const handleAddItem = () => {
    const { company, itemOrService, quantity, mrp, totalAmount } = productData;

    if (!company || !itemOrService || quantity < 1 || !mrp || !totalAmount) {
      toast.error("Please fill all required fields with valid values");
      return;
    }

    const newItem = {
      company,
      itemOrService,
      quantity: parseInt(quantity, 10),
      mrp: parseFloat(mrp),
      totalAmount: parseFloat(totalAmount),
    };

    append(newItem);
    setProductData({
      company: "",
      itemOrService: "",
      quantity: 1,
      mrp: "",
      totalAmount: "",
    });
  };

  const calculateTotal = () => {
    return (watchedItems || []).reduce(
      (sum, item) => sum + (item.totalAmount || 0),
      0
    );
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      billDate: data.billDate || today,
      admissionDate: data.admissionDate || today,
      dateOfBirth: data.dateOfBirth || today,
      dischargeDate: data.dischargeDate || undefined,
      billItems: data.billItems.map((item) => ({
        ...item,
        mrp: Number(item.mrp),
        totalAmount: Number(item.totalAmount),
      })),
    };

    try {
      const response = await mutateAsync(payload);
      if (response?.data?.success) {
        navigate(`/bill/${response?.data?.data?.id}`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getInputClass = (fieldName) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaListAlt className="mr-2 text-blue-600" />
              New Bill Entry
            </h2>
            <p className="text-gray-600 mt-1">
              Please fill all required details for the new bill
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Bill Information Section */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaListAlt className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Bill Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bill Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("billDate")}
                  className={`${getInputClass("billDate")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.billDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.billDate.message}
                </p>
              )}
            </div>

            {/* Bill Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Type<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("billType")}
                  className={`${getInputClass("billType")} bg-white pr-8`}
                >
                  <option value="" disabled selected hidden>
                    Select bill type
                  </option>
                  {billTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {errors.billType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.billType.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Mobile<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  {...register("mobile")}
                  placeholder="Enter mobile number"
                  className={`${getInputClass("mobile")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMobileAlt className="text-gray-400" />
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

        {/* Patient Information Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaUser className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Patient Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admission No */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Admission No<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("admissionNo")}
                  placeholder="Enter admission number"
                  className={`${getInputClass("admissionNo")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" />
                </div>
              </div>
              {errors.admissionNo && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.admissionNo.message}
                </p>
              )}
            </div>

            {/* Admission Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Admission Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("admissionDate")}
                  className={`${getInputClass("admissionDate")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.admissionDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.admissionDate.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className={`${getInputClass("dateOfBirth")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Gender<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("gender")}
                  className={`${getInputClass("gender")}  bg-white pr-8`}
                >
                  <option value="" disabled selected hidden>
                    Select gender
                  </option>
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Discharge Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Discharge Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("dischargeDate")}
                  className={`${getInputClass("dischargeDate")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.dischargeDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.dischargeDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Doctor & Ward Information Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaUserMd className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Doctor & Ward Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Doctor Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Doctor Name<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("doctorName")}
                className={`${getInputClass("doctorName")} bg-white pr-8`}
              >
                <option value="" disabled selected hidden>
                  Select doctor
                </option>
                {doctors.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.doctorName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.doctorName.message}
                </p>
              )}
            </div>
            {/* Ward No */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Ward No<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("wardNo")}
                className={`${getInputClass("wardNo")} bg-white pr-8`}
              >
                <option value="" disabled selected hidden>
                  Select ward
                </option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              {errors.wardNo && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.wardNo.message}
                </p>
              )}
            </div>
            {/* Bed No */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bed No<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("bedNo")}
                className={`${getInputClass("bedNo")} bg-white pr-8`}
              >
                <option value="" disabled selected hidden>
                  Select bed
                </option>
                {beds.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.bedNo && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.bedNo.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaHome className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Address
            </h3>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Address<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              {...register("address")}
              placeholder="Enter patient address"
              rows={3}
              className={getInputClass("address")}
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaBox className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Product Data
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Company<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="company"
                value={productData.company}
                onChange={handleProductChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white pr-8"
              >
                <option value="" disabled selected hidden>
                  Select company
                </option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Item/Service<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="itemOrService"
                value={productData.itemOrService}
                onChange={handleProductChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white pr-8"
              >
                <option value="" disabled selected hidden>
                  Select item/service
                </option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Quantity<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleProductChange}
                min="1"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                MRP<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="mrp"
                value={productData.mrp}
                onChange={handleProductChange}
                min="0"
                step="0.01"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Total Amount<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="totalAmount"
                value={productData.totalAmount}
                onChange={handleProductChange}
                min="0"
                step="0.01"
                readOnly
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Item
          </button>
          {errors.billItems && (
            <p className="text-red-600 text-sm mt-2">
              {errors.billItems.message}
            </p>
          )}
        </div>

        {/* Items Table */}
        {fields.length > 0 && (
          <div className="p-6 border-t border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sr.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item/Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MRP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.itemOrService}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.mrp.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-right font-medium text-sm text-gray-800"
                    >
                      Total:
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-gray-900">
                      {calculateTotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton type="submit" isLoading={isPending}>
            Save Bill
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewBillEntry;
