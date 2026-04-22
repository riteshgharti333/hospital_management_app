import React, { useState, useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaPlus,
  FaTrash,
  FaNotesMedical,
  FaHospitalUser,
  FaUserMd,
  FaUser,
  FaPhone,
  FaIdCard,
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
  const fileInputRef = useRef(null);
  const [newFile, setNewFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      admissionId: undefined,
      prescriptionDate: "",
      notes: "",
      status: "ACTIVE",
      medicines: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const { data: prescriptionData, isLoading, refetch } = useGetPrescriptionById(id);
  const { mutateAsync: updatePrescription, isPending: isUpdating } = useUpdatePrescription();
  const { mutateAsync: deletePrescription, isPending: isDeleting } = useDeletePrescription();

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  useEffect(() => {
    if (prescriptionData) {
      const formattedData = {
        admissionId: prescriptionData.admissionId,
        prescriptionDate: prescriptionData.prescriptionDate?.slice(0, 16) || new Date().toISOString().slice(0, 16),
        notes: prescriptionData.notes || "",
        status: prescriptionData.status || "ACTIVE",
        medicines: prescriptionData.medicines || [],
      };
      reset(formattedData);
    }
  }, [prescriptionData, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.warning("Please upload PDF, JPG, or PNG files only");
        e.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        toast.warning("File size should be less than 5MB");
        e.target.value = "";
        return;
      }

      setNewFile(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const hasFile = newFile || fileInputRef.current?.files?.[0];

      const prescriptionDataToSend = {
        admissionId: data.admissionId,
        prescriptionDate: data.prescriptionDate,
        notes: data.notes || "",
        status: data.status,
        medicines: data.medicines.map((med) => ({
          medicineName: med.medicineName.trim(),
          dosage: med.dosage.trim(),
          frequency: med.frequency.trim(),
          duration: med.duration.trim(),
          instructions: med.instructions?.trim() || "",
        })),
      };

      let response;

      if (hasFile) {
        const formData = new FormData();
        formData.append("admissionId", data.admissionId);
        formData.append("prescriptionDate", data.prescriptionDate);
        formData.append("notes", data.notes || "");
        formData.append("status", data.status);
        formData.append("medicines", JSON.stringify(prescriptionDataToSend.medicines));
        formData.append("prescriptionDoc", hasFile);
        response = await updatePrescription({ id, data: formData });
      } else {
        response = await updatePrescription({ id, data: prescriptionDataToSend });
      }

      if (response?.data?.success) {
        toast.success(response.data.message || "Prescription updated successfully");
        setEditMode(false);
        setNewFile(null);
        refetch();
      } else {
        toast.error(response?.data?.message || "Failed to update prescription");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update prescription");
    }
  };

  const handleCancel = () => {
    if (prescriptionData) {
      reset({
        admissionId: prescriptionData.admissionId,
        prescriptionDate: prescriptionData.prescriptionDate?.slice(0, 16) || "",
        notes: prescriptionData.notes || "",
        status: prescriptionData.status || "ACTIVE",
        medicines: prescriptionData.medicines || [],
      });
    }
    setNewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to delete prescription");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleAddMedicine = () => {
    append({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    });
  };

  const admission = prescriptionData?.admission;

  if (isLoading) return <Loader />;
  if (!prescriptionData) return <NoData />;

  return (
    <div className="mx-auto max-w-5xl">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

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

          {/* Admission Details Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-md font-semibold text-blue-900 mb-3 flex items-center">
              <FaHospitalUser className="mr-2" />
              Admission Details
            </h4>
            {admission ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <FaIdCard className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admission ID</p>
                    <p className="text-gray-900">
                      {admission.hospitalAdmissionId || `ADM-${admission.id}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaUser className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patient Name</p>
                    <p className="text-gray-900">{admission.patient?.fullName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaPhone className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patient Mobile</p>
                    <p className="text-gray-900">{admission.patient?.mobileNumber || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaUserMd className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doctor Name</p>
                    <p className="text-gray-900">{admission.doctor?.fullName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCalendarAlt className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admission Date</p>
                    <p className="text-gray-900">
                      {admission.admissionDate
                        ? new Date(admission.admissionDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
               
              </div>
            ) : (
              <p className="text-gray-500">No admission details available</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Prescription No
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={prescriptionData.prescriptionNo}
                  disabled
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Prescription Date
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  {...register("prescriptionDate")}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.prescriptionDate ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.prescriptionDate && (
                <p className="text-red-600 text-sm mt-1">{errors.prescriptionDate.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register("status")}
                disabled={!editMode}
                className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              <FaNotesMedical className="inline mr-1 text-gray-500" />
              Notes
            </label>
            <textarea
              {...register("notes")}
              disabled={!editMode}
              rows="3"
              placeholder="Additional notes about the prescription..."
              className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.notes ? "border-red-500" : "border-gray-300"
              } ${getDisabledStyles(!editMode)}`}
            />
            {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes.message}</p>}
          </div>

          <div className="mt-6 space-y-1">
            <label className="block text-sm font-medium text-gray-700">Prescription Document</label>
            {prescriptionData.prescriptionDoc && !newFile && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Current document:</p>
                <a
                  href={prescriptionData.prescriptionDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View current document
                </a>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              disabled={!editMode}
              onChange={handleFileChange}
              className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
                editMode
                  ? "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  : "file:bg-gray-100 file:text-gray-500"
              }`}
              accept=".pdf,.jpg,.png,.jpeg"
            />
            {newFile && <p className="text-sm text-green-600">New file selected: {newFile.name}</p>}
            <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Medicines</h3>
            {editMode && (
              <button
                type="button"
                onClick={handleAddMedicine}
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
              <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Medicine Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register(`medicines.${index}.medicineName`)}
                      disabled={!editMode}
                      placeholder="e.g., Amoxicillin"
                      className={`block w-full px-3 py-2 border rounded-lg ${
                        errors.medicines?.[index]?.medicineName ? "border-red-500" : "border-gray-300"
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
                      Dosage<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register(`medicines.${index}.dosage`)}
                      disabled={!editMode}
                      placeholder="e.g., 500mg"
                      className={`block w-full px-3 py-2 border rounded-lg ${
                        errors.medicines?.[index]?.dosage ? "border-red-500" : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                    {errors.medicines?.[index]?.dosage && (
                      <p className="text-red-600 text-sm mt-1">{errors.medicines[index].dosage.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Frequency<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register(`medicines.${index}.frequency`)}
                      disabled={!editMode}
                      placeholder="e.g., Twice daily"
                      className={`block w-full px-3 py-2 border rounded-lg ${
                        errors.medicines?.[index]?.frequency ? "border-red-500" : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                    {errors.medicines?.[index]?.frequency && (
                      <p className="text-red-600 text-sm mt-1">{errors.medicines[index].frequency.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register(`medicines.${index}.duration`)}
                      disabled={!editMode}
                      placeholder="e.g., 7 days"
                      className={`block w-full px-3 py-2 border rounded-lg ${
                        errors.medicines?.[index]?.duration ? "border-red-500" : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                    {errors.medicines?.[index]?.duration && (
                      <p className="text-red-600 text-sm mt-1">{errors.medicines[index].duration.message}</p>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                      {...register(`medicines.${index}.instructions`)}
                      disabled={!editMode}
                      placeholder="e.g., Take after meals"
                      rows="2"
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        errors.medicines?.[index]?.instructions ? "border-red-500" : "border-gray-300"
                      } ${getDisabledStyles(!editMode)}`}
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="flex justify-end mt-3">
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
              <DeleteButton type="button" onClick={() => setShowDeleteModal(true)} />
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