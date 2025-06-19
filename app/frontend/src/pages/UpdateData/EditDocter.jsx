import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaPhone,
  FaIdCard,
  FaGraduationCap,
  FaBriefcase,
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
  useUpdateDoctor,
  useDeleteDoctor,
  useGetDoctorById,
} from "../../feature/hooks/useDoctor";
import { useNavigate, useParams } from "react-router-dom";
import { doctorSchema } from "@hospital/schemas";
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
    section: "Doctor Information",
    icon: <FaUserMd className="text-blue-500" />,
    fields: [
      {
        label: "Full Name",
        type: "text",
        name: "fullName",
        placeholder: "Enter doctor's full name",
        icon: <FaUserMd className="text-gray-400" />,
        required: true,
      },
      {
        label: "Mobile Number",
        type: "tel",
        name: "mobileNumber",
        placeholder: "Enter mobile number",
        icon: <FaPhone className="text-gray-400" />,
        required: true,
      },
      {
        label: "Registration No",
        type: "text",
        name: "registrationNo",
        placeholder: "Enter registration number",
        icon: <FaIdCard className="text-gray-400" />,
        required: true,
      },
      {
        label: "Qualification",
        type: "text",
        name: "qualification",
        placeholder: "Enter qualification",
        icon: <FaGraduationCap className="text-gray-400" />,
        required: true,
      },
    ],
  },
  {
    section: "Professional Details",
    icon: <FaBriefcase className="text-blue-500" />,
    fields: [
      {
        label: "Designation",
        type: "text",
        name: "designation",
        placeholder: "Enter designation",
        icon: <FaBriefcase className="text-gray-400" />,
        required: true,
      },
      {
        label: "Department",
        type: "select",
        name: "department",
        placeholder: "Select department",
        options: [
          "Cardiology",
          "Neurology",
          "Pediatrics",
          "Orthopedics",
          "General Medicine",
        ],
        required: true,
      },
      {
        label: "Specialization",
        type: "text",
        name: "specialization",
        placeholder: "Enter specialization",
        required: true,
      },
      {
        label: "Status",
        type: "select",
        name: "status",
        placeholder: "Select status",
        options: ["Active", "Inactive", "On Leave"],
        required: false,
      },
    ],
  },
];

const optionalFields = ["status"];

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: doctorData, isLoading } = useGetDoctorById(id);
  const { mutateAsync: updateDoctor, isPending: isUpdating } =
    useUpdateDoctor();
  const { mutateAsync: deleteDoctor, isPending: isDeleting } =
    useDeleteDoctor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorSchema),
  });

  // Reusable function for disabled styles
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  // Set form values when data loads
  useEffect(() => {
    if (doctorData) {
      reset(doctorData);
    }
  }, [doctorData, reset]);

  // Form submission
  const onSubmit = async (formData) => {
    const response = await updateDoctor({ id, data: formData });

    if (response?.data?.success) {
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    reset(doctorData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    const { data } = await deleteDoctor(id);
    if (data && data.message) {
      navigate("/doctors");
    }

    setShowDeleteModal(false);
  };

  if (isLoading) return <Loader />;
  if (!doctorData) return <NoData />;

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaUserMd className="mr-2 text-blue-600" />
              {editMode ? "Edit Doctor" : "View Doctor"}
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
                const fieldValue = doctorData[field.name];

                return (
                  <div key={fieldIndex} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required &&
                        !optionalFields.includes(field.name) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
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
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name)}
                          disabled={!editMode}
                          placeholder={field.placeholder}
                          defaultValue={fieldValue}
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

export default EditDoctor;
