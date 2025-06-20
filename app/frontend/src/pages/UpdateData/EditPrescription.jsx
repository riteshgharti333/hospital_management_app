import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUserMd,
  FaUser,
  FaFileAlt,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import {
  useUpdatePrescription,
  useDeletePrescription,
  useGetPrescriptionById,
} from "../../feature/hooks/usePrescription";
import { useNavigate, useParams } from "react-router-dom";
import { prescriptionSchema } from "@hospital/schemas";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const EditPrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctors] = useState([
    { id: 5, name: "Dr. Smith" },
    { id: 2, name: "Dr. Johnson" },
    { id: 3, name: "Dr. Williams" },
  ]);
  const [patients] = useState([
    { id: 13, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Johnson" },
  ]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const { data: prescriptionData, isLoading } = useGetPrescriptionById(id);
  const { mutateAsync: updatePrescription, isPending: isUpdating } =
    useUpdatePrescription();
  const { mutateAsync: deletePrescription, isPending: isDeleting } =
    useDeletePrescription();

  // Reusable function for disabled styles
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  // Set form values when data loads
  useEffect(() => {
    if (prescriptionData) {
      const formattedData = {
        ...prescriptionData,
        prescriptionDate:
          prescriptionData.prescriptionDate?.split("T")[0] || "",
        medicines: prescriptionData.medicines || [
          { medicineName: "", description: "" },
        ],
      };
      reset(formattedData);
    }
  }, [prescriptionData, reset]);

  // Form submission
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        prescriptionDate: new Date(data.prescriptionDate).toISOString(),
        doctorId: Number(data.doctorId),
        patientId: Number(data.patientId),
        prescriptionDoc: data.prescriptionDoc || "",
        medicines: data.medicines.map((med) => ({
          medicineName: med.medicineName.trim(),
          description: med.description.trim(),
        })),
      };

      const response = await updatePrescription({ id, data: payload });

      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update prescription"
      );
    }
  };

  const handleCancel = () => {
    reset(prescriptionData);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deletePrescription(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/prescriptions");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete prescription"
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!prescriptionData) return <NoData />;

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
              <FaFileAlt className="mr-2 text-blue-600" />
              {editMode ? "Edit Prescription" : "View Prescription"}
            </h2>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaFileAlt className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Prescription Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Prescription Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("prescriptionDate", { required: true })}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.prescriptionDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.prescriptionDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.prescriptionDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Doctor<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("doctorId", {
                  required: "Doctor is required",
                  valueAsNumber: true,
                })}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                  errors.doctorId ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="" disabled hidden>
                  Select Doctor
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.doctorId.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Patient<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("patientId", {
                  required: "Patient is required",
                  valueAsNumber: true,
                })}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                  errors.patientId ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="" disabled hidden>
                  Select Patient
                </option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patientId.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Prescription Document
              </label>
              <input
                type="file"
                disabled={!editMode}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const dummyUrl = `https://example.com/${file.name}`;
                  }
                }}
                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
                  editMode
                    ? "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    : "file:bg-gray-100 file:text-gray-500"
                }`}
                accept=".pdf,.jpg,.png,.doc,.docx"
              />
              {errors.prescriptionDoc && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.prescriptionDoc.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Medicines</h3>
            {editMode && (
              <button
                type="button"
                onClick={() => append({ medicineName: "", description: "" })}
                className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <FaPlus className="mr-1" /> Add Medicine
              </button>
            )}
          </div>
          {errors.medicines && (
            <p className="text-red-600 text-sm mb-4">
              {errors.medicines.message || "At least one medicine is required"}
            </p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-4 items-start bg-gray-50 p-4 rounded-lg"
              >
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Medicine Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    {...register(`medicines.${index}.medicineName`, {
                      required: "Medicine name is required",
                    })}
                    disabled={!editMode}
                    placeholder="e.g., Paracetamol"
                    className={`block w-full px-3 py-2 border rounded-lg ${
                      errors.medicines?.[index]?.medicineName
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${getDisabledStyles(!editMode)}`}
                  />
                  {errors.medicines?.[index]?.medicineName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.medicines[index].medicineName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description<span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    {...register(`medicines.${index}.description`, {
                      required: "Description is required",
                    })}
                    disabled={!editMode}
                    placeholder="e.g., 1 tablet twice a day"
                    className={`block w-full px-3 py-2 border rounded-lg ${
                      errors.medicines?.[index]?.description
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${getDisabledStyles(!editMode)}`}
                    rows={2}
                  />
                  {errors.medicines?.[index]?.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.medicines[index].description.message}
                    </p>
                  )}
                </div>

                {editMode && (
                  <div className="self-center pt-6">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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

export default EditPrescription;
