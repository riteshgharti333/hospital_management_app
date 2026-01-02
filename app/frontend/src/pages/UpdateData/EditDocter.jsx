import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaPhone,
  FaIdCard,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../../components/BackButton/BackButton";
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
        label: "Email",
        type: "email",
        name: "email",
        placeholder: "Enter doctor's email",
        icon: <FaIdCard className="text-gray-400" />,
        required: true,
      },
      {
        label: "Registration No",
        type: "text",
        name: "registrationNo",
        placeholder: "Auto-generated",
        icon: <FaIdCard className="text-gray-400" />,
        required: true,
        disabledAlways: true, // 🔥 custom flag for always-disabled
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

  useEffect(() => {
    if (doctorData) {
      reset(doctorData);
    }
  }, [doctorData, reset]);

  const onSubmit = async (formData) => {
    const response = await updateDoctor({ id, data: formData });
    if (response?.data?.success) setEditMode(false);
  };

  const handleCancel = () => {
    reset(doctorData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    const { data } = await deleteDoctor(id);
    if (data?.success) navigate("/doctors");
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
      <div className="mb-5 flex items-center">
        <BackButton />
        <h2 className="text-2xl font-bold text-gray-800 ml-2">
          {editMode ? "Edit Doctor" : "View Doctor"}
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
                const isDisabled = field.disabledAlways || !editMode; // 🔥 main logic!

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
                        {...register(field.name)}
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
                          <option key={i} value={opt}>
                            {opt}
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
        <div className="bg-gray-50 px-6 py-4  flex justify-end gap-3">
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

export default EditDoctor;