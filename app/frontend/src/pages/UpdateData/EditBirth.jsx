import React, { useState, useEffect } from "react";
import {
  FaBaby,
  FaClock,
  FaVenusMars,
  FaWeight,
  FaUser,
  FaPhone,
  FaEdit,
  FaTimes,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../../components/BackButton/BackButton";
import { toast } from "sonner";
import {
  useUpdateBirthRecord,
  useDeleteBirthRecord,
  useGetBirthRecordById,
} from "../../feature/hooks/useBirth";
import { useNavigate, useParams } from "react-router-dom";
import { birthSchema } from "@hospital/schemas";
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
    section: "Baby Details",
    icon: <FaBaby className="text-blue-500" />,
    fields: [
      {
        label: "Birth Date",
        type: "date",
        name: "birthDate",
        placeholder: "Select birth date",
      },
      {
        label: "Birth Time",
        type: "time",
        name: "birthTime",
        placeholder: "Select birth time",
        icon: <FaClock className="text-gray-400" />,
      },
      {
        label: "Baby's Sex",
        type: "select",
        name: "babySex",
        placeholder: "Select baby's sex",
        options: ["Male", "Female"],
      },
      {
        label: "Baby's Weight (kg)",
        type: "number",
        name: "babyWeightKg",
        placeholder: "Enter baby's weight",
        step: "0.01",
        icon: <FaWeight className="text-gray-400" />,
      },
    ],
  },
  {
    section: "Parent Information",
    icon: <FaUser className="text-blue-500" />,
    fields: [
      {
        label: "Father's Name",
        type: "text",
        name: "fathersName",
        placeholder: "Enter father's full name",
      },
      {
        label: "Mother's Name",
        type: "text",
        name: "mothersName",
        placeholder: "Enter mother's full name",
      },
      {
        label: "Mobile Number",
        type: "tel",
        name: "mobileNumber",
        placeholder: "Enter mobile number",
        icon: <FaPhone className="text-gray-400" />,
      },
    ],
  },
  {
    section: "Birth Information",
    icon: <FaBaby className="text-blue-500" />,
    fields: [
      {
        label: "Type of Delivery",
        type: "select",
        name: "deliveryType",
        placeholder: "Select delivery type",
        options: ["Normal", "Cesarean", "Forceps", "Vacuum"],
      },
      {
        label: "Place of Birth",
        type: "select",
        name: "placeOfBirth",
        placeholder: "Select birth place",
        options: ["Hospital", "Home", "Clinic", "Other"],
      },
      {
        label: "Attendant's Name",
        type: "text",
        name: "attendantsName",
        placeholder: "Enter attendant's name",
      },
    ],
  },
];

const EditBirth = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: birthData, isLoading } = useGetBirthRecordById(id);
  const { mutateAsync: updateBirthRecord, isPending: isUpdating } = useUpdateBirthRecord();
  const { mutateAsync: deleteBirthRecord, isPending: isDeleting } = useDeleteBirthRecord();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(birthSchema),
  });

  // Reusable function for disabled styles
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  // Set form values when data loads
  useEffect(() => {
    if (birthData) {
      const formattedData = {
        ...birthData,
        birthDate: birthData.birthDate?.split("T")[0] || "",
      };
      reset(formattedData);
    }
  }, [birthData, reset]);

  // Form submission
  const onSubmit = async (formData) => {
    try {
      const submissionData = {
        ...formData,
        birthDate: new Date(formData.birthDate),
      };

      const response = await updateBirthRecord({ id, data: submissionData });
      
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleCancel = () => {
    reset(birthData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteBirthRecord(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/birth-entries");
      }
    } catch (error) {
      console.log(error)
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!birthData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaBaby className="mr-2 text-pink-500" />
              {editMode ? "Edit Birth Record" : "View Birth Record"}
            </h2>
          </div>
        </div>
      </div>

      {/* Form */}
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
                const fieldValue = birthData[field.name];

                return (
                  <div
                    key={fieldIndex}
                    className={`space-y-1 ${
                      field.type === "textarea" ? "md:col-span-2" : ""
                    }`}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          {...register(field.name)}
                          disabled={!editMode}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8 ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${getDisabledStyles(!editMode)}`}
                          aria-invalid={error ? "true" : "false"}
                        >
                          <option value="" disabled hidden>
                            {field.placeholder}
                          </option>
                          {field.options.map((option, i) => (
                            <option
                              key={i}
                              value={option}
                              selected={fieldValue === option}
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        {...register(field.name)}
                        disabled={!editMode}
                        rows={3}
                        placeholder={field.placeholder}
                        defaultValue={fieldValue}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        } ${getDisabledStyles(!editMode)}`}
                        aria-invalid={error ? "true" : "false"}
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
                          defaultValue={
                            field.type === "date"
                              ? fieldValue?.split("T")[0] || ""
                              : fieldValue
                          }
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                            field.icon ? "pl-10" : ""
                          } ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${getDisabledStyles(!editMode)}`}
                          aria-invalid={error ? "true" : "false"}
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

export default EditBirth;