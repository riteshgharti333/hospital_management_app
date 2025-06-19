import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
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

import { billSchema } from "@hospital/schemas";
import {
  useGetBillById,
  useUpdateBill,
  useDeleteBill,
} from "../../feature/transectionHooks/useBill";

const EditBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [productData, setProductData] = useState({
    company: "",
    itemOrService: "",
    quantity: 1,
    mrp: "",
    totalAmount: "",
  });

  const { data: billData, isLoading } = useGetBillById(id);
  const { mutateAsync: updateBill, isPending: isUpdating } = useUpdateBill();
  const { mutateAsync: deleteBill, isPending: isDeleting } = useDeleteBill();

  // --- Sample data, ideally from API ---
  const billTypes = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"];
  const genders = ["Male", "Female", "Other"];
  const doctors = ["Dr. Sharma", "Dr. Mehta", "Dr. Gupta", "Dr. Roy"];
  const wards = ["Ward 1", "Ward 2", "Ward 3", "ICU", "Emergency"];
  const beds = ["Bed 1", "Bed 2", "Bed 3", "Bed 4", "Bed 5"];
  const companies = ["Company A", "Company B", "Company C", "Company D"];
  const services = ["Service 1", "Service 2", "Service 3", "Service 4"];
  // ---

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(billSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "billItems",
  });
  const watchedItems = useWatch({ control, name: "billItems" });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white";

  useEffect(() => {
    if (billData) {
      const formattedData = {
        ...billData,
        billDate: billData.billDate?.split("T")[0] || "",
        admissionDate: billData.admissionDate?.split("T")[0] || "",
        dateOfBirth: billData.dateOfBirth?.split("T")[0] || "",
        dischargeDate: billData.dischargeDate?.split("T")[0] || "",
      };
      reset(formattedData);
    }
  }, [billData, reset]);

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
      toast.error("Please fill all required item fields with valid values.");
      return;
    }
    const newItem = {
      company,
      itemOrService,
      quantity: parseInt(quantity, 10),
      mrp: parseFloat(mrp),
      discount: 10, // Assuming static for now
      purchaseRate: 800,
      stock: 50,
      backorder: 0,
      gst: 18,
      taxableAmount: parseFloat(mrp) * 0.9, // Example calculation
      totalGST: parseFloat(mrp) * 0.9 * 0.18, // Example calculation
      cgst: parseFloat(mrp) * 0.9 * 0.09, // Example calculation
      sgst: parseFloat(mrp) * 0.9 * 0.09, // Example calculation
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
    try {
      const response = await updateBill({ id, data });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update bill.");
    }
  };

  const handleCancel = () => {
    const formattedData = {
      ...billData,
      billDate: billData.billDate?.split("T")[0] || "",
      admissionDate: billData.admissionDate?.split("T")[0] || "",
      dateOfBirth: billData.dateOfBirth?.split("T")[0] || "",
      dischargeDate: billData.dischargeDate?.split("T")[0] || "",
    };
    reset(formattedData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteBill(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/bills");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete bill.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const getInputClass = (fieldName, isDisabled) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    } ${getDisabledStyles(isDisabled)}`;

  if (isLoading) return <Loader />;
  if (!billData) return <NoData />;

  return (
    <div className="max-w-6xl mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      <div className="mb-5">
        <div className="flex items-center justify-betweenewn">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaListAlt className="mr-2 text-blue-600" />
              {editMode ? "Edit Bill" : "View Bill"}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Bill Information */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaListAlt className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Bill Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("billDate")}
                  disabled={!editMode}
                  className={`${getInputClass("billDate", !editMode)} pl-10`}
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Type<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("billType")}
                disabled={!editMode}
                className={`${getInputClass("billType", !editMode)} pr-8`}
              >
                <option value="" disabled hidden>
                  Select bill type
                </option>
                {billTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.billType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.billType.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Mobile<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  {...register("mobile")}
                  disabled={!editMode}
                  placeholder="Enter mobile number"
                  className={`${getInputClass("mobile", !editMode)} pl-10`}
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

        {/* Patient Information */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaUser className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Patient Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Admission No<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("admissionNo")}
                  disabled={!editMode}
                  placeholder="Enter admission number"
                  className={`${getInputClass("admissionNo", !editMode)} pl-10`}
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Admission Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("admissionDate")}
                  disabled={!editMode}
                  className={`${getInputClass(
                    "admissionDate",
                    !editMode
                  )} pl-10`}
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  disabled={!editMode}
                  className={`${getInputClass("dateOfBirth", !editMode)} pl-10`}
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Gender<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("gender")}
                disabled={!editMode}
                className={`${getInputClass("gender", !editMode)} pr-8`}
              >
                <option value="" disabled hidden>
                  Select gender
                </option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Discharge Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("dischargeDate")}
                  disabled={!editMode}
                  className={`${getInputClass(
                    "dischargeDate",
                    !editMode
                  )} pl-10`}
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
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Address<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register("address")}
                disabled={!editMode}
                placeholder="Enter patient address"
                rows={3}
                className={getInputClass("address", !editMode)}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Doctor & Ward Information */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaUserMd className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Doctor & Ward Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Doctor Name<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("doctorName")}
                disabled={!editMode}
                className={`${getInputClass("doctorName", !editMode)} pr-8`}
              >
                <option value="" disabled hidden>
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Ward No<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("wardNo")}
                disabled={!editMode}
                className={`${getInputClass("wardNo", !editMode)} pr-8`}
              >
                <option value="" disabled hidden>
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bed No<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("bedNo")}
                disabled={!editMode}
                className={`${getInputClass("bedNo", !editMode)} pr-8`}
              >
                <option value="" disabled hidden>
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

        {/* Product Data Section */}
        {editMode && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center mb-6">
              <FaBox className="text-blue-500" />
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                Add Items
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
                  <option value="" disabled hidden>
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
                  Select Item/Service
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="itemOrService"
                  value={productData.itemOrService}
                  onChange={handleProductChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white pr-8"
                >
                  <option value="" disabled hidden>
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
        )}

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
                    {editMode && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.itemOrService}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {Number(item.mrp).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {Number(item.totalAmount).toFixed(2)}
                      </td>
                      {editMode && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td
                      colSpan={editMode ? 4 : 4}
                      className="px-6 py-4 text-right font-medium text-sm text-gray-800"
                    >
                      Total:
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-gray-900">
                      {calculateTotal().toFixed(2)}
                    </td>
                    {editMode && <td></td>}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
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

export default EditBill;
