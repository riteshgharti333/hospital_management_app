import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUserMd, FaBuilding, FaEdit, FaTimes, FaSave, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../../components/BackButton/BackButton";
import { toast } from "sonner";
import {
  useUpdateAppointment,
  useDeleteAppointment,
  useGetAppointmentById,
} from "../../feature/hooks/useAppointment";
import { useNavigate, useParams } from "react-router-dom";
import { appointmentSchema } from "@hospital/schemas";
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
    section: "Appointment Information",
    icon: <FaCalendarAlt className="text-blue-500" />,
    fields: [
      {
        label: "Appointment Date",
        type: "date",
        name: "appointmentDate",
        placeholder: "Select appointment date",
        icon: <FaCalendarAlt className="text-gray-400" />,
        required: true,
      },
      {
        label: "Doctor Name",
        type: "select",
        name: "doctorName",
        placeholder: "Select doctor",
        options: ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown"],
        required: true,
      },
      {
        label: "Department",
        type: "select",
        name: "department",
        placeholder: "Select department",
        options: ["Cardiology", "Neurology", "Pediatrics", "Orthopedics"],
        required: true,
      },
      {
        label: "Appointment Time",
        type: "time",
        name: "appointmentTime",
        placeholder: "Select appointment time",
        required: true,
      },
    ],
  },
];

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: appointmentData, isLoading } = useGetAppointmentById(id);
  const { mutateAsync: updateAppointment, isPending: isUpdating } = useUpdateAppointment();
  const { mutateAsync: deleteAppointment, isPending: isDeleting } = useDeleteAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
  });

  // Reusable function for disabled styles
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  // Set form values when data loads
  useEffect(() => {
    if (appointmentData) {
      const formattedData = {
        ...appointmentData,
        appointmentDate: appointmentData.appointmentDate?.split("T")[0] || "",
      };
      reset(formattedData);
    }
  }, [appointmentData, reset]);

  // Form submission
  const onSubmit = async (formData) => {
    try {
      const submissionData = {
        ...formData,
        appointmentDate: new Date(formData.appointmentDate),
      };

      const response = await updateAppointment({ id, data: submissionData });
      
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleCancel = () => {
    reset(appointmentData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteAppointment(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/appointments");
      }
    } catch (error) {
      console.log(error)
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!appointmentData) return <NoData />;

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
              <FaCalendarAlt className="mr-2 text-blue-600" />
              {editMode ? "Edit Appointment" : "View Appointment"}
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
                const fieldValue = appointmentData[field.name];

                return (
                  <div key={fieldIndex} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
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

export default EditAppointment;