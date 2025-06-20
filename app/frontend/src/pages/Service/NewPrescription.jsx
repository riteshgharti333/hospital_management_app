import React, { useState, useRef } from "react";
import {
  FaCalendarAlt,
  FaUserMd,
  FaUser,
  FaFileAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { prescriptionSchema } from "@hospital/schemas";
import { medicineSchema } from "@hospital/schemas";
import { useCreatePrescription } from "../../feature/hooks/usePrescription";
import { useNavigate } from "react-router-dom";

const NewPrescription = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
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
    defaultValues: {
      prescriptionDate: new Date().toISOString().split("T")[0],
      doctorId: undefined,
      patientId: undefined,
      status: "Active",
      medicines: [{ medicineName: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const { mutateAsync } = useCreatePrescription();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.warning("File size should be less than 5MB");
      e.target.value = "";
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Check if there's a file to upload
      const hasFile = fileInputRef.current?.files?.[0];
      
      if (hasFile) {
        // If there's a file, use FormData
        const formData = new FormData();
        
        formData.append("prescriptionDate", new Date(data.prescriptionDate).toISOString());
        formData.append("doctorId", data.doctorId.toString());
        formData.append("patientId", data.patientId.toString());
        formData.append("status", data.status);
        
        // Append each medicine separately for FormData
        const medicinesData = data.medicines.map(med => ({
          medicineName: med.medicineName.trim(),
          description: med.description.trim()
        }));
        
        medicinesData.forEach((medicine, index) => {
          formData.append(`medicines[${index}][medicineName]`, medicine.medicineName);
          formData.append(`medicines[${index}][description]`, medicine.description);
        });
        
        formData.append("file", fileInputRef.current.files[0]);
        
        const response = await mutateAsync(formData);
        
        if (response?.data?.success) {
          toast.success("Prescription created successfully");
          navigate(`/prescription/${response.data.data.id}`);
        }
      } else {
        // If no file, send as JSON
        const jsonData = {
          prescriptionDate: new Date(data.prescriptionDate).toISOString(),
          doctorId: data.doctorId,
          patientId: data.patientId,
          status: data.status,
          medicines: data.medicines.map(med => ({
            medicineName: med.medicineName.trim(),
            description: med.description.trim()
          }))
        };
        
        const response = await mutateAsync(jsonData);
        
        if (response?.data?.success) {
          toast.success("Prescription created successfully");
          navigate(`/prescription/${response.data.id}`);
        }
      }
    } catch (error) {
      toast.error("Failed to create prescription");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    // Clear the file input using ref
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" />
              New Prescription
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for the prescription
            </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Prescription Date<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("prescriptionDate", { required: true })}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.prescriptionDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
                className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                  errors.doctorId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled selected hidden>
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
                className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white ${
                  errors.patientId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled selected hidden>
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
                ref={fileInputRef}
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.jpg,.png,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Medicines</h3>
            <button
              type="button"
              onClick={() => append({ medicineName: "", description: "" })}
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FaPlus className="mr-1" /> Add Medicine
            </button>
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
                    placeholder="e.g., Paracetamol"
                    className={`block w-full px-3 py-2 border rounded-lg ${
                      errors.medicines?.[index]?.medicineName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
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
                    placeholder="e.g., 1 tablet twice a day"
                    className={`block w-full px-3 py-2 border rounded-lg ${
                      errors.medicines?.[index]?.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    rows={2}
                  />
                  {errors.medicines?.[index]?.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.medicines[index].description.message}
                    </p>
                  )}
                </div>

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
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Reset
          </button>
          <LoadingButton isLoading={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save Prescription"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewPrescription;