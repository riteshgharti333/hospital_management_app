import React, { useState, useEffect } from "react";
import {
  FaUniversity,
  FaHashtag,
  FaCode,
  FaUser,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../../components/BackButton/BackButton";
import {
  useUpdateBank,
  useDeleteBank,
  useGetBankById,
} from "../../feature/hooks/useBank";
import { useNavigate, useParams } from "react-router-dom";
import { bankSchema } from "@hospital/schemas";
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
    section: "Bank Account Information",
    icon: <FaUniversity className="text-blue-500" />,
    fields: [
      {
        label: "Bank Name",
        type: "text",
        name: "bankName",
        placeholder: "Enter bank name",
        icon: <FaUniversity className="text-gray-400" />,
        required: true,
      },
      {
        label: "Account Number",
        type: "text",
        name: "accountNo",
        placeholder: "Enter account number",
        icon: <FaHashtag className="text-gray-400" />,
        required: true,
      },
     
      {
        label: "Bank Code",
        type: "text",
        name: "code",
        placeholder: "Auto-generated",
        icon: <FaCode className="text-gray-400" />,
        required: true,
        disabledAlways: true,
      },
      {
        label: "IFSC Code",
        type: "text",
        name: "ifscCode",
        placeholder: "Enter IFSC code (e.g., SBIN0001234)",
        icon: <FaCode className="text-gray-400" />,
        required: false,
      },
    ],
  },
  {
    section: "Account Status",
    icon: <FaUniversity className="text-blue-500" />,
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

const EditBank = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: bankData, isLoading } = useGetBankById(id);
  const { mutateAsync: updateBank, isPending: isUpdating } =
    useUpdateBank();
  const { mutateAsync: deleteBank, isPending: isDeleting } =
    useDeleteBank();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bankSchema),
  });

  useEffect(() => {
    if (bankData) {
      reset(bankData);
    }
  }, [bankData, reset]);

  const onSubmit = async (formData) => {
    const response = await updateBank({ id, data: formData });
    if (response?.data?.success) setEditMode(false);
  };

  const handleCancel = () => {
    reset(bankData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    const { data } = await deleteBank(id);
    if (data?.success) navigate("/bank");
    setShowDeleteModal(false);
  };

  if (isLoading) return <Loader />;
  if (!bankData) return <NoData />;

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
          {editMode ? "Edit Bank Account" : "View Bank Account"}
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

export default EditBank;