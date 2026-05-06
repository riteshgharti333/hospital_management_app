import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaListAlt,
  FaBox,
  FaPlus,
  FaTrash,
  FaSearch,
  FaHospitalUser,
  FaPhone,
  FaUserMd,
  FaUser,
  FaIdCard,
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

import { useSearchAdmissions } from "../../feature/hooks/useAdmisson";

const EditBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const searchRef = useRef(null);

  const [productData, setProductData] = useState({
    company: "",
    itemOrService: "",
    quantity: 1,
    mrp: "",
    totalAmount: "",
  });

  // Admission Search
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const { data: searchResponse, isLoading: isSearching } =
    useSearchAdmissions(searchTerm);
  const admissions = searchResponse?.data || [];

  const billTypes = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"];
  const billStatusOptions = [
    "Pending",
    "PartiallyPaid",
    "Paid",
    "Cancelled",
    "Refunded",
  ];
  const companies = [
    "Sun Pharma",
    "Cipla",
    "Dr. Reddy's",
    "Abbott",
    "Mankind Pharma",
  ];
  const services = [
    "Paracetamol 500mg",
    "Amoxicillin 250mg",
    "Omeprazole 20mg",
    "CBC Test",
    "X-Ray Chest",
    "Ultrasound",
    "Consultation Fee",
    "Room Charges",
    "Nursing Care",
    "IV Fluids",
  ];

  const { data: billData, isLoading } = useGetBillById(id);
  const { mutateAsync: updateBill, isPending: isUpdating } = useUpdateBill();
  const { mutateAsync: deleteBill, isPending: isDeleting } = useDeleteBill();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(billSchema),
    defaultValues: {
      billDate: "",
      billType: "",
      status: "Pending",
      admissionId: "",
      patientId: "",
      billItems: [],
      totalAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "billItems",
  });

  const watchedItems = useWatch({ control, name: "billItems" });

  const getInputClass = (name, disabled) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      errors[name] ? "border-red-500" : "border-gray-300"
    } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white"}`;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Load bill data
  useEffect(() => {
    if (billData) {
      console.log("Bill Data:", billData);
      1;
      // Reset form with bill data
      reset({
        billDate: billData.billDate?.split("T")[0] || "",
        billType: billData.billType || "",
        status: billData.status || "Pending",
        admissionId: billData.admissionId || "",
        patientId: billData.patientId || "",
        billItems: billData.billItems || [],
        totalAmount: billData.totalAmount || 0,
      });

      // Set selected admission if exists
      if (billData.admission) {
        setSelectedAdmission(billData);
        setSearchTerm(billData.admission.hospitalAdmissionId || "");
      }
    }
  }, [billData, reset]);

  const calculateTotal = () =>
    (watchedItems || []).reduce(
      (sum, item) => sum + (Number(item.totalAmount) || 0),
      0,
    );

  // Update total amount when items change
  useEffect(() => {
    const total = calculateTotal();
    setValue("totalAmount", total);
  }, [watchedItems, setValue]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => {
      const updatedData = {
        ...prev,
        [name]: name === "quantity" ? parseInt(value, 10) || 1 : value,
      };

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
      toast.error("Please fill all required item fields");
      return;
    }

    append({
      company,
      itemOrService,
      quantity: Number(quantity),
      mrp: Number(mrp),
      totalAmount: Number(totalAmount),
    });

    setProductData({
      company: "",
      itemOrService: "",
      quantity: 1,
      mrp: "",
      totalAmount: "",
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length >= 2);
    if (value.length < 2) {
      setSelectedAdmission(null);
      setValue("admissionId", "");
      setValue("patientId", "");
    }
  };

  const handleSelectAdmission = (admission) => {
    setSelectedAdmission(admission);
    setValue("admissionId", admission.id);
    setValue("patientId", admission.patient?.id);
    setSearchTerm(admission.hospitalAdmissionId || `ADM-${admission.id}`);
    setShowDropdown(false);
    toast.success("Admission selected successfully");
  };

  const onSubmit = async (formData) => {
    try {
      if (!selectedAdmission && editMode) {
        toast.error("Please select an admission");
        return;
      }

      // Process bill items
      const processedItems = (formData.billItems || []).map((item) => ({
        company: item.company,
        itemOrService: item.itemOrService,
        quantity: Number(item.quantity),
        mrp: Number(item.mrp),
        totalAmount: Number(item.totalAmount),
      }));

      // Prepare payload matching the schema
      const payload = {
        billDate: new Date(formData.billDate).toISOString(),
        billType: formData.billType,
        totalAmount: Number(formData.totalAmount) || calculateTotal(),
        admissionId: Number(formData.admissionId),
        patientId: Number(formData.patientId),
        status: formData.status,
        billItems: processedItems,
      };

      console.log("Updating bill with payload:", payload);

      const res = await updateBill({ id, data: payload });

      if (res?.data?.success) {
        toast.success(res.data.message || "Bill updated successfully");
        setEditMode(false);
      }
    } catch (e) {
      console.error("Update error:", e);
      toast.error(e?.response?.data?.message || "Failed to update bill");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteBill(id);
      if (res?.data?.success) {
        toast.success(res.data.message);
        navigate("/bills");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShowDeleteModal(false);
    }
  };

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
        <div className="flex items-center">
          <BackButton />
          <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
            <FaListAlt className="mr-2 text-blue-600" />
            {editMode ? "Edit Bill" : "View Bill"}
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          {/* Bill Information Section */}
          <div className="flex items-center mb-6">
            <FaListAlt className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Bill Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bill Date */}
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

            {/* Bill Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Type<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("billType")}
                disabled={!editMode}
                className={`${getInputClass("billType", !editMode)} bg-white`}
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

            {/* Bill Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Bill Status<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("status")}
                disabled={!editMode}
                className={`${getInputClass("status", !editMode)} bg-white`}
              >
                {billStatusOptions.map((s) => (
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
          </div>
        </div>

        {/* Admission Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-6">
            <FaHospitalUser className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Admission Information
            </h3>
          </div>

          {/* Search Input - Only visible in edit mode */}
          {editMode ? (
            <div className="space-y-1 relative" ref={searchRef}>
              <label className="block text-sm font-medium text-gray-700">
                Search Admission<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchTerm.length >= 2 && admissions.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  placeholder="Search by Admission ID, Patient Name, or Mobile No"
                  autoComplete="off"
                  className={`${getInputClass("admissionId", false)} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchTerm.length >= 2 && (
                <ul className="absolute z-50 bg-white w-full border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                  {isSearching ? (
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
                  ) : admissions.length > 0 ? (
                    admissions.slice(0, 10).map((admission) => (
                      <li
                        key={admission.id}
                        onClick={() => handleSelectAdmission(admission)}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {admission.patient?.fullName || "Unknown Patient"}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Admission:</span>{" "}
                                {admission.hospitalAdmissionId ||
                                  `ADM-${admission.id}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Patient ID:</span>{" "}
                                {admission.patient?.hospitalPatientId || "N/A"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-600 flex items-center">
                                <FaPhone
                                  className="mr-1 text-gray-400"
                                  size={12}
                                />
                                {admission.patient?.mobileNumber || "N/A"}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Admitted:{" "}
                              {new Date(
                                admission.admissionDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <FaIdCard className="text-gray-400 ml-3" />
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaSearch className="text-gray-400 mb-2" size={20} />
                        <p>No admissions found</p>
                      </div>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ) : null}

          {/* Current/Selected Admission Details Card - Shows in BOTH modes */}
          {selectedAdmission && (
            <div
              className={`mt-4 p-4 rounded-lg border ${
                editMode
                  ? "bg-blue-50 border-blue-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <p
                className={`text-sm font-medium mb-2 ${
                  editMode ? "text-blue-900" : "text-green-900"
                }`}
              >
                {editMode
                  ? "Selected Admission Details:"
                  : "Current Admission Details:"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Admission ID:</span>{" "}
                  {selectedAdmission.admission?.hospitalAdmissionId ||
                    `ADM-${selectedAdmission.id}`}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Patient ID:</span>{" "}
                  {selectedAdmission.patient?.hospitalPatientId || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Patient Name:</span>{" "}
                  {selectedAdmission.patient?.fullName || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Mobile:</span>{" "}
                  {selectedAdmission.patient?.mobileNumber || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Admitted On:</span>{" "}
                  {new Date(
                    selectedAdmission.admissionDate,
                  ).toLocaleDateString()}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Gender:</span>{" "}
                  {selectedAdmission.patient?.gender || "N/A"}
                </p>
                <p className={editMode ? "text-blue-800" : "text-green-800"}>
                  <span className="font-medium">Address:</span>{" "}
                  {selectedAdmission.patient?.address || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* No Admission Selected Message */}
          {!selectedAdmission && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                {editMode
                  ? "Please search and select an admission"
                  : "No admission information available"}
              </p>
            </div>
          )}
        </div>

        {/* Hidden inputs for IDs */}
        <input type="hidden" {...register("admissionId")} />
        <input type="hidden" {...register("patientId")} />
        <input type="hidden" {...register("totalAmount")} />

        {/* Add Items Section (only in edit mode) */}
        {editMode && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center mb-6">
              <FaBox className="text-blue-500" />
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                Add Items/Services
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Select Company<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="company"
                  value={productData.company}
                  onChange={handleProductChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  MRP (₹)<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={productData.mrp}
                  onChange={handleProductChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={productData.totalAmount}
                  readOnly
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Item
            </button>
          </div>
        )}

        {/* Items Table */}
        {fields.length > 0 && (
          <div className="p-6 border-t border-gray-100">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
              Added Items
            </h4>
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
                      MRP (₹)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (₹)
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
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.itemOrService}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{Number(item.mrp).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{Number(item.totalAmount).toFixed(2)}
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
                      colSpan={editMode ? 5 : 5}
                      className="px-6 py-4 text-right font-semibold text-sm text-gray-800"
                    >
                      Grand Total:
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-gray-900">
                      ₹{calculateTotal().toFixed(2)}
                    </td>
                    {editMode && <td />}
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
              <CancelButton onClick={() => setEditMode(false)} />
              <SaveButton type="submit" isLoading={isUpdating} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditBill;
``;
