import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaUser,
  FaSearch,
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
  useUpdateDepartment,
  useDeleteDepartment,
  useGetDepartmentById,
} from "../../feature/hooks/useDepartments";
import { useSearchDoctors } from "../../feature/hooks/useDoctor";
import { useNavigate, useParams } from "react-router-dom";
import { departmentSchema, DepartmentNameEnum, DepartmentStatusEnum } from "@hospital/schemas";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data: departmentData, isLoading } = useGetDepartmentById(id);
  const { mutateAsync: updateDepartment, isPending: isUpdating } = useUpdateDepartment();
  const { mutateAsync: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();
  
  const { data: doctorSearchResults, isLoading: searchingDoctors } =
    useSearchDoctors(searchDoctorQuery, {
      enabled: searchDoctorQuery.length >= 2 && editMode,
    });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
      doctorId: null,
      status: "ACTIVE",
    },
  });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  useEffect(() => {
    if (departmentData) {
      reset({
        name: departmentData.name,
        description: departmentData.description || "",
        doctorId: departmentData.doctorId,
        status: departmentData.status,
      });
      
      // Set selected doctor if exists
      if (departmentData.head) {
        setSelectedDoctor({
          id: departmentData.head.id,
          name: departmentData.head.fullName,
          specialization: departmentData.head.specialization,
        });
      }
    }
  }, [departmentData, reset]);

  const onSubmit = async (formData) => {
    try {
      const submissionData = {
        name: formData.name,
        description: formData.description || "",
        doctorId: formData.doctorId,
        status: formData.status,
      };
      
      const response = await updateDepartment({ id, data: submissionData });

      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message === "Department already exists") {
        toast.error("Department with this name already exists");
      } else if (error.response?.data?.message === "Doctor already assigned to a department") {
        toast.error("This doctor is already assigned to another department");
      } else {
        toast.error(error.response?.data?.message || "Failed to update department");
      }
    }
  };

  const handleCancel = () => {
    reset({
      name: departmentData.name,
      description: departmentData.description || "",
      doctorId: departmentData.doctorId,
      status: departmentData.status,
    });
    setSelectedDoctor(departmentData.head ? {
      id: departmentData.head.id,
      name: departmentData.head.fullName,
      specialization: departmentData.head.specialization,
    } : null);
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteDepartment(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/departments");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete department");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Handle doctor selection from search
  const handleDoctorSelect = (doctor) => {
    setValue("doctorId", doctor.id);
    setSelectedDoctor({
      id: doctor.id,
      name: doctor.fullName || doctor.doctorName || doctor.name,
      specialization: doctor.specialization,
    });
    trigger("doctorId");
    setShowDoctorSearch(false);
    setSearchDoctorQuery("");
  };

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDoctorSearch && !event.target.closest('.doctor-search-container')) {
        setShowDoctorSearch(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDoctorSearch]);

  // Search result component
  const SearchResults = ({ results, loading, onSelect }) => (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {loading ? (
        <div className="p-3 text-center text-gray-500">Searching doctors...</div>
      ) : results?.length > 0 ? (
        results.map((doctor, index) => (
          <div
            key={index}
            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            onClick={() => onSelect(doctor)}
          >
            <div className="font-medium text-gray-800">
              {doctor.fullName || doctor.doctorName || doctor.name}
            </div>
            <div className="text-sm text-gray-600 flex justify-between">
              <span>ID: {doctor.registrationNo || doctor.doctorId || `D-${doctor.id}`}</span>
              <span>{doctor.specialization}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="p-3 text-center text-gray-500">No doctors found</div>
      )}
    </div>
  );

  if (isLoading) return <Loader />;
  if (!departmentData) return <NoData />;

  // Get current form values
  const formValues = watch();

  return (
    <div className="mx-auto">
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
              <FaBuilding className="mr-2 text-blue-500" />
              {editMode ? "Edit Department" : "View Department"}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Name - Select dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Department Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("name")}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                >
                  <option value="" disabled>
                    Select department name
                  </option>
                  {DepartmentNameEnum.options.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0) + option.slice(1).toLowerCase()}
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
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Department Head - Search functionality */}
            <div className="space-y-1 relative doctor-search-container">
              <label className="block text-sm font-medium text-gray-700">
                Department Head
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchDoctorQuery}
                  onChange={(e) => {
                    if (editMode) {
                      setSearchDoctorQuery(e.target.value);
                      setShowDoctorSearch(true);
                    }
                  }}
                  onFocus={() => {
                    if (editMode) setShowDoctorSearch(true);
                  }}
                  placeholder={editMode ? "Search by Doctor Name or Registration No..." : "Search disabled in view mode"}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.doctorId ? "border-red-500" : "border-gray-300"
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
                  />
                )}
              </div>
              
              {/* Show selected doctor name */}
              {selectedDoctor && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Head Doctor:</span> {selectedDoctor.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Specialization: {selectedDoctor.specialization}
                  </div>
                </div>
              )}
              
              {!selectedDoctor && formValues.doctorId && (
                <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Head ID:</span> {formValues.doctorId}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Doctor details will be shown after selection
                  </div>
                </div>
              )}
              
              {errors.doctorId && (
                <p className="text-red-600 text-sm mt-1">{errors.doctorId.message}</p>
              )}
            </div>

            {/* Status - Select dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("status")}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
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
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Description - Textarea spanning full width */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                disabled={!editMode}
                rows={3}
                placeholder="Enter department description"
                className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } ${getDisabledStyles(!editMode)}`}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
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

export default EditDepartment;