import React, { useState, useEffect } from "react";
import {
  FaUserInjured,
  FaUser,
  FaPhone,
  FaIdCard,
  FaProcedures,
  FaUserMd,
  FaStethoscope,
  FaSearch,
  FaCalendar,
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
  useUpdateAdmission,
  useDeleteAdmission,
  useGetAdmissionById,
} from "../../feature/hooks/useAdmisson";
import { useNavigate, useParams } from "react-router-dom";
import { admissionSchema } from "@hospital/schemas";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { useSearchDoctors } from "../../feature/hooks/useDoctor";
import { useSearchPatients } from "../../feature/hooks/usePatient";
import { useGetPatientById } from "../../feature/hooks/usePatient";
import { useGetDoctorById } from "../../feature/hooks/useDoctor";

const formFields = [
  {
    section: "Patient Identification",
    icon: <FaUserInjured className="text-blue-500" />,
    fields: [
      {
        label: "Search Patient",
        type: "text",
        name: "searchPatient",
        placeholder: "Search by Patient ID or Name",
        icon: <FaSearch className="text-gray-400" />,
        searchField: true,
      },
      {
        label: "Patient ID",
        type: "text",
        name: "displayPatientId",
        placeholder: "Patient ID",
        icon: <FaUser className="text-gray-400" />,
        disabledAlways: true,
      },
      {
        label: "Patient Name",
        type: "text",
        name: "patientName",
        placeholder: "Patient name",
        icon: <FaUser className="text-gray-400" />,
        required: true,
        disabledAlways: true,
      },
      {
        label: "Phone Number",
        type: "tel",
        name: "phoneNumber",
        placeholder: "Phone number",
        icon: <FaPhone className="text-gray-400" />,
        required: true,
        disabledAlways: true,
      },
      {
        label: "Aadhaar Number",
        type: "text",
        name: "aadhaarNumber",
        placeholder: "Aadhaar number",
        icon: <FaIdCard className="text-gray-400" />,
        maxLength: 12,
        required: true,
        disabledAlways: true,
      },
    ],
  },
  {
    section: "Doctor Information",
    icon: <FaUserMd className="text-purple-500" />,
    fields: [
      {
        label: "Search Doctor",
        type: "text",
        name: "searchDoctor",
        placeholder: "Search by Doctor ID or Name",
        icon: <FaSearch className="text-gray-400" />,
        searchField: true,
      },
      {
        label: "Doctor ID",
        type: "text",
        name: "displayDoctorId",
        placeholder: "Doctor ID",
        icon: <FaUserMd className="text-gray-400" />,
        disabledAlways: true,
      },
      {
        label: "Doctor Name",
        type: "text",
        name: "doctorName",
        placeholder: "Doctor name",
        icon: <FaUserMd className="text-gray-400" />,
        required: true,
        disabledAlways: true,
      },
      {
        label: "Specialization",
        type: "text",
        name: "specialization",
        placeholder: "Specialization",
        icon: <FaStethoscope className="text-gray-400" />,
        required: true,
        disabledAlways: true,
      },
    ],
  },
  {
    section: "Admission Details",
    icon: <FaProcedures className="text-red-500" />,
    fields: [
      {
        label: "Admission Date",
        type: "datetime-local",
        name: "admissionDate",
        placeholder: "Select admission date",
        icon: <FaCalendar className="text-gray-400" />,
        required: true,
      },
      {
        label: "Discharge Date",
        type: "datetime-local",
        name: "dischargeDate",
        placeholder: "Select discharge date",
        icon: <FaCalendar className="text-gray-400" />,
      },
    ],
  },
];

const EditAdmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [searchPatientQuery, setSearchPatientQuery] = useState("");
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");

  // Fetch admission data
  const { data: admissionData, isLoading: isLoadingAdmission } = useGetAdmissionById(id);
  
  // Extract patient and doctor IDs from admission data - FIXED
  const patientId = admissionData?.patientId;
  const doctorId = admissionData?.doctorId;
  
  // Fetch patient and doctor details
  const { data: patientData, isLoading: isLoadingPatient } = useGetPatientById(patientId, {
    enabled: !!patientId,
  });
  
  const { data: doctorData, isLoading: isLoadingDoctor } = useGetDoctorById(doctorId, {
    enabled: !!doctorId,
  });

  const { mutateAsync: updateAdmission, isPending: isUpdating } =
    useUpdateAdmission();
  const { mutateAsync: deleteAdmission, isPending: isDeleting } =
    useDeleteAdmission();

  const { data: patientSearchResults, isLoading: searchingPatients } =
    useSearchPatients(searchPatientQuery, {
      enabled: searchPatientQuery.length >= 2 && editMode,
    });

  const { data: doctorSearchResults, isLoading: searchingDoctors } =
    useSearchDoctors(searchDoctorQuery, {
      enabled: searchDoctorQuery.length >= 2 && editMode,
    });

  const optionalFields = ["dischargeDate"];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      admissionDate: "",
      dischargeDate: "",
      patientId: "",
      doctorId: "",
      displayPatientId: "",
      displayDoctorId: "",
      patientName: "",
      phoneNumber: "",
      aadhaarNumber: "",
      doctorName: "",
      specialization: "",
    },
  });

  // Reusable function for disabled styles
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  // Watch form values
  const formValues = watch();

  // Set form values when all data loads
  useEffect(() => {
    if (admissionData && patientData && doctorData) {
      console.log("Admission Data:", admissionData);
      console.log("Patient Data:", patientData);
      console.log("Doctor Data:", doctorData);
      
      const formattedData = {
        admissionDate: admissionData.admissionDate 
          ? new Date(admissionData.admissionDate).toISOString().slice(0, 16)
          : "",
        dischargeDate: admissionData.dischargeDate
          ? new Date(admissionData.dischargeDate).toISOString().slice(0, 16)
          : "",
        patientId: admissionData.patientId || "",
        doctorId: admissionData.doctorId || "",
        // Set display fields from fetched data
        displayPatientId: patientData?.hospitalPatientId || patientData?.patientId || `P-${patientData?.id}` || "",
        patientName: patientData?.fullName || patientData?.patientName || "",
        phoneNumber: patientData?.mobileNumber || patientData?.phoneNumber || "",
        aadhaarNumber: patientData?.aadhaarNumber || patientData?.aadhaarNo || "",
        displayDoctorId: doctorData?.registrationNo || doctorData?.doctorId || `D-${doctorData?.id}` || "",
        doctorName: doctorData?.fullName || doctorData?.doctorName || "",
        specialization: doctorData?.specialization || "",
      };
      
      console.log("Formatted Data for Form:", formattedData);
      reset(formattedData);
    }
  }, [admissionData, patientData, doctorData, reset]);

  // Handle patient selection from search
  const handlePatientSelect = (patient) => {
    if (!editMode) return;
    
    setValue("patientId", patient.id);
    setValue(
      "displayPatientId",
      patient.hospitalPatientId || patient.patientId || `P-${patient.id}`
    );
    setValue(
      "patientName",
      patient.fullName || patient.patientName || patient.name
    );
    setValue(
      "phoneNumber",
      patient.mobileNumber || patient.phoneNumber || patient.phone
    );
    setValue("aadhaarNumber", patient.aadhaarNumber || patient.aadhaarNo);

    trigger(["patientId", "patientName", "phoneNumber", "aadhaarNumber"]);

    setShowPatientSearch(false);
    setSearchPatientQuery("");
  };

  // Handle doctor selection from search
  const handleDoctorSelect = (doctor) => {
    if (!editMode) return;
    
    setValue("doctorId", doctor.id);
    setValue(
      "displayDoctorId",
      doctor.registrationNo || doctor.doctorId || `D-${doctor.id}`
    );
    setValue("doctorName", doctor.fullName || doctor.doctorName || doctor.name);
    setValue("specialization", doctor.specialization || "");

    trigger(["doctorId", "doctorName", "specialization"]);

    setShowDoctorSearch(false);
    setSearchDoctorQuery("");
  };

  const onSubmit = async (formData) => {
    console.log("Form data before submission:", formData);

    if (!editMode) return;

    // Validate patient selection
    if (!formData.patientId || formData.patientId === "") {
      toast.error("Please select a patient from the search results");
      setTimeout(() => {
        const patientSearchInput = document.querySelector('.patient-search-container input');
        if (patientSearchInput) {
          patientSearchInput.focus();
        }
      }, 100);
      return;
    }

    // Validate doctor selection
    if (!formData.doctorId || formData.doctorId === "") {
      toast.error("Please select a doctor from the search results");
      setTimeout(() => {
        const doctorSearchInput = document.querySelector('.doctor-search-container input');
        if (doctorSearchInput) {
          doctorSearchInput.focus();
        }
      }, 100);
      return;
    }

    // Validate admission date
    if (!formData.admissionDate) {
      toast.error("Please select an admission date");
      return;
    }

    // Validate discharge date is after admission date
    if (formData.dischargeDate) {
      const admissionDate = new Date(formData.admissionDate);
      const dischargeDate = new Date(formData.dischargeDate);
      
      if (dischargeDate <= admissionDate) {
        toast.error("Discharge date must be after admission date");
        return;
      }
    }

    try {
      // Prepare submission data
      const submissionData = {
        admissionDate: new Date(formData.admissionDate).toISOString(),
        patientId: parseInt(formData.patientId, 10),
        doctorId: parseInt(formData.doctorId, 10),
        dischargeDate: formData.dischargeDate
          ? new Date(formData.dischargeDate).toISOString()
          : null,
      };

      console.log("Updating admission data:", submissionData);

      const response = await updateAdmission({ id, data: submissionData });

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Admission update error:", error);
      
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      
      if (errorMessage.toLowerCase().includes("patient")) {
        toast.error("Please select a valid patient");
      } else if (errorMessage.toLowerCase().includes("doctor")) {
        toast.error("Please select a valid doctor");
      } else if (errorMessage.toLowerCase().includes("required")) {
        toast.error("Please fill all required fields");
      } else if (errorMessage.toLowerCase().includes("date")) {
        toast.error("Please check the dates entered");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleCancel = () => {
    // Reset to original admission data
    if (admissionData && patientData && doctorData) {
      const formattedData = {
        admissionDate: admissionData.admissionDate 
          ? new Date(admissionData.admissionDate).toISOString().slice(0, 16)
          : "",
        dischargeDate: admissionData.dischargeDate
          ? new Date(admissionData.dischargeDate).toISOString().slice(0, 16)
          : "",
        patientId: admissionData.patientId || "",
        doctorId: admissionData.doctorId || "",
        displayPatientId: patientData?.hospitalPatientId || patientData?.patientId || `P-${patientData?.id}` || "",
        patientName: patientData?.fullName || patientData?.patientName || "",
        phoneNumber: patientData?.mobileNumber || patientData?.phoneNumber || "",
        aadhaarNumber: patientData?.aadhaarNumber || patientData?.aadhaarNo || "",
        displayDoctorId: doctorData?.registrationNo || doctorData?.doctorId || `D-${doctorData?.id}` || "",
        doctorName: doctorData?.fullName || doctorData?.doctorName || "",
        specialization: doctorData?.specialization || "",
      };
      reset(formattedData);
    }
    setEditMode(false);
    setShowPatientSearch(false);
    setShowDoctorSearch(false);
    setSearchPatientQuery("");
    setSearchDoctorQuery("");
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteAdmission(id);
      if (data?.success) {
        toast.success(data.message);
        navigate("/admission-entries");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete admission");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Search result component
  const SearchResults = ({ results, loading, onSelect, type }) => (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {loading ? (
        <div className="p-3 text-center text-gray-500">Searching...</div>
      ) : results?.length > 0 ? (
        results.map((item, index) => {
          const displayId =
            type === "patient"
              ? item.hospitalPatientId || item.patientId || `P-${item.id}`
              : item.registrationNo || item.doctorId || `D-${item.id}`;

          return (
            <div
              key={index}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => onSelect(item)}
            >
              <div className="font-medium text-gray-800">
                {type === "patient"
                  ? item.fullName || item.patientName || item.name
                  : item.fullName || item.doctorName || item.name}
              </div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>ID: {displayId}</span>
                {type === "patient" ? (
                  <span>
                    {item.mobileNumber || item.phoneNumber || item.phone}
                  </span>
                ) : (
                  <span>{item.specialization}</span>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-3 text-center text-gray-500">No {type}s found</div>
      )}
    </div>
  );

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPatientSearch && !event.target.closest('.patient-search-container')) {
        setShowPatientSearch(false);
      }
      if (showDoctorSearch && !event.target.closest('.doctor-search-container')) {
        setShowDoctorSearch(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showPatientSearch, showDoctorSearch]);

  // Combined loading state
  const isLoading = isLoadingAdmission || isLoadingPatient || isLoadingDoctor;

  if (isLoading) return <Loader />;
  if (!admissionData) return <NoData />;

  return (
    <div className="max-w-6xl mx-auto">
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
              <FaProcedures className="mr-2 text-blue-600" />
              {editMode ? "Edit Admission" : "View Admission"}
            </h2>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Hidden inputs for validation */}
        <input type="hidden" {...register("patientId")} />
        <input type="hidden" {...register("doctorId")} />

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.fields.map((field, fieldIndex) => {
                const error = errors[field.name];
                const isDisabled = field.disabledAlways || !editMode;
                const fieldValue = formValues[field.name];

                // Special handling for Patient search field
                if (field.name === "searchPatient") {
                  return (
                    <div
                      key={fieldIndex}
                      className="space-y-1 relative patient-search-container"
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchPatientQuery}
                          onChange={(e) => {
                            setSearchPatientQuery(e.target.value);
                            setShowPatientSearch(true);
                          }}
                          onFocus={() => editMode && setShowPatientSearch(true)}
                          placeholder={field.placeholder}
                          disabled={!editMode}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${getDisabledStyles(!editMode)}`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="text-gray-400" />
                        </div>
                        {showPatientSearch && editMode && (
                          <SearchResults
                            results={patientSearchResults}
                            loading={searchingPatients}
                            onSelect={handlePatientSelect}
                            type="patient"
                          />
                        )}
                      </div>
                      {errors.patientId && (
                        <p className="text-red-600 text-sm mt-1" role="alert">
                          Please select a patient
                        </p>
                      )}
                    </div>
                  );
                }

                // Special handling for Doctor search field
                if (field.name === "searchDoctor") {
                  return (
                    <div
                      key={fieldIndex}
                      className="space-y-1 relative doctor-search-container"
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchDoctorQuery}
                          onChange={(e) => {
                            setSearchDoctorQuery(e.target.value);
                            setShowDoctorSearch(true);
                          }}
                          onFocus={() => editMode && setShowDoctorSearch(true)}
                          placeholder={field.placeholder}
                          disabled={!editMode}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${getDisabledStyles(!editMode)}`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="text-gray-400" />
                        </div>
                        {showDoctorSearch && editMode && (
                          <SearchResults
                            results={doctorSearchResults}
                            loading={searchingDoctors}
                            onSelect={handleDoctorSelect}
                            type="doctor"
                          />
                        )}
                      </div>
                      {errors.doctorId && (
                        <p className="text-red-600 text-sm mt-1" role="alert">
                          Please select a doctor
                        </p>
                      )}
                    </div>
                  );
                }

                // Handle display fields (show display IDs)
                if (
                  field.name === "displayPatientId" ||
                  field.name === "displayDoctorId"
                ) {
                  return (
                    <div key={fieldIndex} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name)}
                          disabled={isDisabled}
                          placeholder={field.placeholder}
                          value={fieldValue || ""}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                            field.icon ? "pl-10" : ""
                          } ${error ? "border-red-500" : "border-gray-300"} ${
                            getDisabledStyles(isDisabled)
                          }`}
                          aria-invalid={error ? "true" : "false"}
                          readOnly
                        />
                        {field.icon && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {field.icon}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={fieldIndex}
                    className={`space-y-1 ${
                      field.type === "textarea"
                        ? "md:col-span-2 lg:col-span-3"
                        : ""
                    }`}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.type !== "checkbox" &&
                        !optionalFields.includes(field.name) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          {...register(field.name)}
                          disabled={isDisabled}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                            error ? "border-red-500" : "border-gray-300"
                          } ${getDisabledStyles(isDisabled)}`}
                          aria-invalid={error ? "true" : "false"}
                        >
                          <option value="" disabled>
                            {field.placeholder}
                          </option>
                          {field.options?.map((option, i) => (
                            <option key={i} value={option}>
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
                        disabled={isDisabled}
                        rows={3}
                        placeholder={field.placeholder}
                        value={fieldValue || ""}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        } ${getDisabledStyles(isDisabled)}`}
                        aria-invalid={error ? "true" : "false"}
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name, {
                            valueAsNumber: field.type === "number",
                          })}
                          disabled={isDisabled}
                          placeholder={field.placeholder}
                          value={fieldValue || ""}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          maxLength={field.maxLength}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                            field.icon ? "pl-10" : ""
                          } ${error ? "border-red-500" : "border-gray-300"} ${
                            getDisabledStyles(isDisabled)
                          }`}
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
              <SaveButton type="submit" isLoading={isUpdating || isSubmitting} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditAdmission;