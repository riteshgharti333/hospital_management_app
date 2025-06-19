import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaListAlt,
  FaUserTie,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaHashtag,
  FaInfoCircle,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
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

import { voucherSchema } from "@hospital/schemas";
import {
  useGetVoucherById,
  useUpdateVoucher,
  useDeleteVoucher,
} from "../../feature/transectionHooks/useVoucher";

// --- Define Form Structure and Options ---
const voucherTypes = ["Payment", "Receipt", "Journal"];
const paymentModes = ["Cash", "Cheque", "Bank Transfer", "Card", "Online"];
const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D"];
const statusOptions = ["Pending", "Paid", "Cancelled"];

const formFields = [
  {
    section: "Voucher Information",
    icon: <FaFileInvoiceDollar className="text-blue-500" />,
    fields: [
      {
        label: "Voucher Date",
        type: "date",
        name: "voucherDate",
        icon: <FaCalendarAlt className="text-gray-400" />,
      },
      {
        label: "Payment For",
        type: "text",
        name: "paymentFor",
        placeholder: "Enter payment purpose",
        icon: <FaListAlt className="text-gray-400" />,
      },
      {
        label: "Voucher Type",
        type: "select",
        name: "voucherType",
        placeholder: "Select voucher type",
        options: voucherTypes,
      },
      {
        label: "Vendor Name",
        type: "select",
        name: "vendorName",
        placeholder: "Select vendor",
        options: vendors,
      },
      {
        label: "Payment Date",
        type: "date",
        name: "paymentDate",
        icon: <FaCalendarAlt className="text-gray-400" />,
      },
      {
        label: "Amount",
        type: "number",
        name: "amount",
        placeholder: "Enter amount",
        step: "0.01",
        icon: <FaMoneyBillWave className="text-gray-400" />,
      },
      {
        label: "Payment Mode",
        type: "select",
        name: "paymentMode",
        placeholder: "Select payment mode",
        options: paymentModes,
      },
      {
        label: "Reference No",
        type: "text",
        name: "referenceNo",
        placeholder: "e.g., Cheque No, TXN ID",
        icon: <FaHashtag className="text-gray-400" />,
      },
      {
        label: "Status",
        type: "select",
        name: "status",
        placeholder: "Select status",
        options: statusOptions,
      },
      {
        label: "Description",
        type: "textarea",
        name: "description",
        placeholder: "Enter any additional details or notes",
        className: "md:col-span-2", // Make textarea span two columns
      },
    ],
  },
];

const EditVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: voucherData, isLoading } = useGetVoucherById(id);
  const { mutateAsync: updateVoucher, isPending: isUpdating } = useUpdateVoucher();
  const { mutateAsync: deleteVoucher, isPending: isDeleting } = useDeleteVoucher();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voucherSchema), // Correctly pass the schema
  });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white";

  useEffect(() => {
    if (voucherData) {
      // Format dates for input[type=date] and reset the form
      const formattedData = {
        ...voucherData,
        voucherDate: voucherData.voucherDate?.split('T')[0] || '',
        paymentDate: voucherData.paymentDate?.split('T')[0] || '',
      };
      reset(formattedData);
    }
  }, [voucherData, reset]);

  const onSubmit = async (formData) => {
    try {
      const response = await updateVoucher({ id, data: formData });

      if (response?.data?.success) {
        toast.success("Voucher updated successfully!");
        setEditMode(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update voucher"
      );
    }
  };

  const handleCancel = () => {
    // Reset form to the original fetched data
    if (voucherData) {
      const formattedData = {
        ...voucherData,
        voucherDate: voucherData.voucherDate?.split('T')[0] || '',
        paymentDate: voucherData.paymentDate?.split('T')[0] || '',
      };
      reset(formattedData);
    }
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteVoucher(id);
      if (data?.success) {
        toast.success(data.message);
        navigate("/payment-vouchers"); // Or your vouchers list route
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete voucher"
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!voucherData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Confirm Deletion"
        message="Are you sure you want to delete this voucher? This action cannot be undone."
      />

      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaFileInvoiceDollar className="mr-2 text-blue-500" />
              View Voucher
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {formFields.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`p-6 ${
              sectionIndex !== 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <div className="flex items-center mb-6">
              {section.icon}
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                {section.section}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIndex) => {
                const error = errors[field.name];

                return (
                  <div key={fieldIndex} className={`space-y-1 ${field.className || ''}`}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      <span className="text-red-500 ml-1">{field.name !== 'referenceNo' && field.name !== 'description' && '*'}</span>
                    </label>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          {...register(field.name)}
                          disabled={!editMode}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8 ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${getDisabledStyles(!editMode)}`}
                        >
                          <option value="" disabled hidden>{field.placeholder}</option>
                          {field.options.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FaExchangeAlt className="text-gray-400" />
                        </div>
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        {...register(field.name)}
                        disabled={!editMode}
                        rows="3"
                        placeholder={field.placeholder}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
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
                          step={field.step}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                            field.icon ? "pl-10" : ""
                          } ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${getDisabledStyles(!editMode)}`}
                        />
                        {field.icon && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {field.icon}
                          </div>
                        )}
                      </div>
                    )}

                    {error && (
                      <p className="text-red-600 text-sm mt-1" role="alert">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!editMode ? (
            <>
              <DeleteButton
                type="button"
                onClick={() => setShowDeleteModal(true)}
              />
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

export default EditVoucher;