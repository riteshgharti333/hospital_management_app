import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaCode,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../../components/BackButton/BackButton";
import {
  useUpdateCashAccount,
  useDeleteCashAccount,
  useGetCashAccountById,
} from "../../feature/hooks/useCash";
import { useNavigate, useParams } from "react-router-dom";
import { cashSchema } from "@hospital/schemas";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const formFields = [
  {
    section: "Cash Account Information",
    icon: <FaMoneyBillWave className="text-green-500" />,
    fields: [
      {
        label: "Cash Account Name",
        type: "text",
        name: "cashName",
        placeholder: "Enter cash account name",
        icon: <FaMoneyBillWave className="text-gray-400" />,
        required: true,
      },
      {
        label: "Cash Code",
        type: "text",
        name: "code",
        placeholder: "Auto-generated",
        icon: <FaCode className="text-gray-400" />,
        required: true,
        disabledAlways: true,
      },
    ],
  },
  {
    section: "Account Status",
    icon: <FaMoneyBillWave className="text-green-500" />,
    fields: [
      {
        label: "Status",
        type: "select",
        name: "isActive",
        placeholder: "Select status",
        options: [
          { label: "Active", value: true },
          { label: "Inactive", value: false },
        ],
        required: true,
      },
    ],
  },
];

const EditCash = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: cashData, isLoading } = useGetCashAccountById(id);
  const { mutateAsync: updateCashAccount, isPending: isUpdating } =
    useUpdateCashAccount();
  const { mutateAsync: deleteCashAccount, isPending: isDeleting } =
    useDeleteCashAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cashSchema),
  });

  useEffect(() => {
    if (cashData) {
      reset(cashData);
    }
  }, [cashData, reset]);

  const onSubmit = async (formData) => {
    const response = await updateCashAccount({ id, data: formData });
    if (response?.data?.success) setEditMode(false);
  };

  const handleCancel = () => {
    reset(cashData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    const { data } = await deleteCashAccount(id);
    if (data?.success) navigate("/cash");
    setShowDeleteModal(false);
  };

  if (isLoading) return <Loader />;
  if (!cashData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* Header */}
      <div className="mb-5 flex items-center">
        <BackButton />
        <h2 className="text-2xl font-bold text-gray-800 ml-2">
          {editMode ? "Edit Cash Account" : "View Cash Account"}
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {formFields.map((section, sIndex) => (
          <div
            key={sIndex}
            className={`p-6 ${sIndex !== 0 ? "border-t border-gray-100" : ""}`}
          >
            <div className="flex items-center mb-6">
              {section.icon}
              <h3 className="ml-2 text-lg font-semibold text-gray-800">
                {section.section}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fIndex) => {
                const error = errors[field.name];
                const isDisabled = field.disabledAlways || !editMode;

                return (
                  <div key={fIndex} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {/* Select field */}
                    {field.type === "select" ? (
                      <select
                        {...register(field.name, {
                          setValueAs: (value) =>
                            value === "true"
                              ? true
                              : value === "false"
                              ? false
                              : value,
                        })}
                        disabled={isDisabled}
                        className={`block w-full px-4 py-2 border rounded-lg ${
                          error ? "border-red-500" : "border-gray-300"
                        } ${
                          isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      >
                        <option value="" disabled>
                          {field.placeholder}
                        </option>
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt.value.toString()}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          disabled={isDisabled}
                          className={`block w-full px-4 py-2 border rounded-lg ${
                            field.icon ? "pl-10" : ""
                          } ${error ? "border-red-500" : "border-gray-300"} ${
                            isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        />
                        {field.icon && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {field.icon}
                          </div>
                        )}
                      </div>
                    )}

                    {error && (
                      <p className="text-red-600 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
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

export default EditCash;