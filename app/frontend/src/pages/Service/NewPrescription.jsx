import React, { useState, useRef, useEffect } from "react";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaPlus,
  FaTrash,
  FaSearch,
  FaHospitalUser,
  FaNotesMedical,
  FaFilePdf,
  FaImage,
  FaIdCard,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { prescriptionSchema } from "@hospital/schemas";
import { useCreatePrescription } from "../../feature/hooks/usePrescription";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const NewPrescription = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [admissions, setAdmissions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const fileInputRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      admissionId: undefined,
      prescriptionDate: new Date().toISOString().split("T")[0] + "T" + new Date().toTimeString().slice(0, 5),
      notes: "",
      status: "ACTIVE",
      medicines: [{
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const { mutateAsync } = useCreatePrescription();

  // Search admissions with debounce
  const searchAdmissions = async (query) => {
    if (!query || query.length < 2) {
      setAdmissions([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get("/admission/search", {
        params: { query: query }
      });
      
      const admissionsList = response?.data?.data?.data || response?.data?.data || [];
      setAdmissions(admissionsList);
      setShowDropdown(admissionsList.length > 0);
    } catch (error) {
      console.error("Error searching admissions:", error);
      toast.error("Failed to search admissions");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.length >= 2) {
      setShowDropdown(true);
      searchTimeoutRef.current = setTimeout(() => {
        searchAdmissions(value);
      }, 500);
    } else {
      setShowDropdown(false);
      setAdmissions([]);
    }
  };

  const handleSelectAdmission = (admission) => {
    setSelectedAdmission(admission);
    setValue("admissionId", admission.id);
    setSearchTerm(admission.hospitalAdmissionId || `ADM-${admission.id}`);
    setShowDropdown(false);
    setAdmissions([]);
    toast.success("Admission selected successfully");
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
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
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const hasFile = fileInputRef.current?.files?.[0];
      
      if (hasFile) {
        const formData = new FormData();
        formData.append("admissionId", data.admissionId);
        formData.append("prescriptionDate", data.prescriptionDate);
        formData.append("notes", data.notes || "");
        formData.append("status", data.status);
        formData.append("medicines", JSON.stringify(data.medicines));
        formData.append("prescriptionDoc", hasFile);
        
        const response = await mutateAsync(formData);
        
        if (response?.data?.success) {
          toast.success("Prescription created successfully");
          navigate(`/prescription/${response.data.data.id}`);
        } else {
          toast.error(response?.data?.message || "Failed to create prescription");
        }
      } else {
        const prescriptionData = {
          admissionId: data.admissionId,
          prescriptionDate: data.prescriptionDate,
          notes: data.notes || "",
          status: data.status,
          medicines: data.medicines
        };
        
        const response = await mutateAsync(prescriptionData);
        
        if (response?.data?.success) {
          toast.success("Prescription created successfully");
          navigate(`/prescription/${response.data.data.id}`);
        } else {
          toast.error(response?.data?.message || "Failed to create prescription");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error?.response?.data?.message || "Failed to create prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset({
      admissionId: undefined,
      prescriptionDate: new Date().toISOString().split("T")[0] + "T" + new Date().toTimeString().slice(0, 5),
      notes: "",
      status: "ACTIVE",
      medicines: [{
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
      }],
    });
    setSearchTerm("");
    setSelectedAdmission(null);
    setAdmissions([]);
    setShowDropdown(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddMedicine = () => {
    append({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    });
  };

  const inputClass = (error) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" />
              New Prescription
            </h2>
            <p className="text-gray-600 mt-1">
              Search for an admission and create prescription with medicines
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center mb-4">
            <FaIdCard className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Admission Information
            </h3>
          </div>

          {/* Admission Search Section */}
          <div className="space-y-1 relative" ref={searchRef}>
            <label className="block text-sm font-medium text-gray-700">
              Search Admission<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchTerm.length >= 2 && admissions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                placeholder="Search by Admission ID, Patient Name, or Mobile Number (min. 2 characters)"
                autoComplete="off"
                className={`${inputClass(errors.admissionId)} pl-10`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchTerm.length >= 2 && (
              <ul className="absolute z-50 bg-white w-full border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                {isSearching ? (
                  <li className="px-4 py-3 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching admissions...
                    </div>
                  </li>
                ) : admissions.length > 0 ? (
                  admissions.slice(0, 10).map((admission) => (
                    <li
                      key={admission.id}
                      onClick={() => handleSelectAdmission(admission)}
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {admission.patient?.fullName || "Unknown Patient"}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Admission:</span>{" "}
                              {admission.hospitalAdmissionId || `ADM-${admission.id}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Patient ID:</span>{" "}
                              {admission.patient?.hospitalPatientId || "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaUser className="mr-1 text-gray-400" size={12} />
                              {admission.doctor?.fullName || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <FaPhone className="mr-1 text-gray-400" size={12} />
                              {admission.patient?.mobileNumber || "N/A"}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Admitted: {new Date(admission.admissionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <FaHospitalUser className="text-gray-400 ml-3" />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaSearch className="text-gray-400 mb-2" size={20} />
                      <p>No admissions found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try searching with a different term
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            )}

            {errors.admissionId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.admissionId.message}
              </p>
            )}
          </div>

          {/* Selected Admission Details */}
          {selectedAdmission && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">Selected Admission Details:</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p className="text-blue-800">
                  <span className="font-medium">Admission ID:</span> {selectedAdmission.hospitalAdmissionId || `ADM-${selectedAdmission.id}`}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Patient:</span> {selectedAdmission.patient?.fullName}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Doctor:</span> {selectedAdmission.doctor?.fullName || "N/A"}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Mobile:</span> {selectedAdmission.patient?.mobileNumber || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Prescription Details */}
        <div className="p-6">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-4">
            <FaFileAlt className="text-blue-500 mr-2" />
            Prescription Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Prescription Date
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  {...register("prescriptionDate")}
                  className={`${inputClass(errors.prescriptionDate)} pl-10`}
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
                Status
              </label>
              <select
                {...register("status")}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              <FaNotesMedical className="inline mr-1 text-gray-500" />
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows="3"
              placeholder="Additional notes about the prescription..."
              className={inputClass(errors.notes)}
            />
            {errors.notes && (
              <p className="text-red-600 text-sm mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              <FaFilePdf className="inline mr-1 text-gray-500" />
              Prescription Document (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.jpg,.png,.jpeg"
                onChange={handleFileChange}
              />
              <FaImage className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Medicines</h3>
            <button
              type="button"
              onClick={handleAddMedicine}
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
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Medicine Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register(`medicines.${index}.medicineName`)}
                      placeholder="e.g., Amoxicillin"
                      className={inputClass(errors.medicines?.[index]?.medicineName)}
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
                      placeholder="e.g., 500mg"
                      className={inputClass(errors.medicines?.[index]?.dosage)}
                    />
                    {errors.medicines?.[index]?.dosage && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.medicines[index].dosage.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Frequency<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register(`medicines.${index}.frequency`)}
                      placeholder="e.g., Twice daily"
                      className={inputClass(errors.medicines?.[index]?.frequency)}
                    />
                    {errors.medicines?.[index]?.frequency && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.medicines[index].frequency.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...register(`medicines.${index}.duration`)}
                      placeholder="e.g., 7 days"
                      className={inputClass(errors.medicines?.[index]?.duration)}
                    />
                    {errors.medicines?.[index]?.duration && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.medicines[index].duration.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Instructions
                    </label>
                    <textarea
                      {...register(`medicines.${index}.instructions`)}
                      placeholder="e.g., Take after meals"
                      rows="2"
                      className={inputClass()}
                    />
                  </div>
                </div>

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
            {isSubmitting ? "Creating..." : "Create Prescription"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewPrescription;