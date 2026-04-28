import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
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
  useUpdateAppointment,
  useDeleteAppointment,
  useGetAppointmentById,
} from "../../feature/hooks/useAppointment";
import { useSearchDoctors } from "../../feature/hooks/useDoctor";
import { useNavigate, useParams } from "react-router-dom";
import { appointmentSchema, AppointmentStatus } from "@hospital/schemas";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import {
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
} from "../../components/ActionButtons/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data: appointmentData, isLoading } = useGetAppointmentById(id);
  const { mutateAsync: updateAppointment, isPending: isUpdating } =
    useUpdateAppointment();
  const { mutateAsync: deleteAppointment, isPending: isDeleting } =
    useDeleteAppointment();

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
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      appointmentDate: "",
      appointmentTime: "",
      doctorId: null,
      status: "BOOKED",
    },
  });

  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "";

  useEffect(() => {
    if (appointmentData) {
      const formattedDate = appointmentData.appointmentDate
        ? new Date(appointmentData.appointmentDate).toISOString().split("T")[0]
        : "";

      reset({
        appointmentDate: formattedDate,
        appointmentTime: appointmentData.appointmentTime || "",
        doctorId: appointmentData.doctorId,
        status: appointmentData.status || "BOOKED",
      });

      // Set selected doctor if exists
      if (appointmentData.doctor) {
        setSelectedDoctor({
          id: appointmentData.doctor.id,
          name: appointmentData.doctor.fullName,
          specialization: appointmentData.doctor.specialization,
        });
      }
    }
  }, [appointmentData, reset]);

  const onSubmit = async (formData) => {
    try {
      const submissionData = {
        appointmentDate: new Date(formData.appointmentDate),
        appointmentTime: formData.appointmentTime,
        doctorId: formData.doctorId,
        status: formData.status,
      };

      const response = await updateAppointment({ id, data: submissionData });

      if (response?.data?.success) {
        toast.success(
          response.data.message || "Appointment updated successfully",
        );
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to update appointment",
      );
    }
  };

  const handleCancel = () => {
    const formattedDate = appointmentData.appointmentDate
      ? new Date(appointmentData.appointmentDate).toISOString().split("T")[0]
      : "";

    reset({
      appointmentDate: formattedDate,
      appointmentTime: appointmentData.appointmentTime || "",
      doctorId: appointmentData.doctorId,
      status: appointmentData.status || "BOOKED",
    });

    setSelectedDoctor(
      appointmentData.doctor
        ? {
            id: appointmentData.doctor.id,
            name: appointmentData.doctor.fullName,
            specialization: appointmentData.doctor.specialization,
          }
        : null,
    );
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
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to delete appointment",
      );
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
      if (
        showDoctorSearch &&
        !event.target.closest(".doctor-search-container")
      ) {
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
        <div className="p-3 text-center text-gray-500">
          Searching doctors...
        </div>
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
              <span>
                ID:{" "}
                {doctor.registrationNo || doctor.doctorId || `D-${doctor.id}`}
              </span>
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
  if (!appointmentData) return <NoData />;

  // Get current form values
  const formValues = watch();
  const today = new Date().toISOString().split("T")[0];

  // Status badge color
  const getStatusBadge = (status) => {
    const statusMap = {
      BOOKED: "bg-blue-100 text-blue-700",
      CANCELLED: "bg-red-100 text-red-700",
      EXPIRED: "bg-gray-100 text-gray-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  };

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
              <FaCalendarAlt className="mr-2 text-blue-500" />
              {editMode ? "Edit Appointment" : "View Appointment"}
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
            {/* Doctor Search */}
            <div className="space-y-1 relative doctor-search-container md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Doctor
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
                  placeholder={
                    editMode
                      ? "Search by Doctor Name or Registration No..."
                      : "Search disabled in view mode"
                  }
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
                    <span className="font-medium">Doctor:</span>{" "}
                    {selectedDoctor.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Specialization: {selectedDoctor.specialization}
                  </div>
                </div>
              )}

              {!selectedDoctor && formValues.doctorId && (
                <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Doctor ID:</span>{" "}
                    {formValues.doctorId}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Doctor details will be shown after selection
                  </div>
                </div>
              )}

              {errors.doctorId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.doctorId.message}
                </p>
              )}
            </div>

            {/* Appointment Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Appointment Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("appointmentDate")}
                  disabled={!editMode}
                  min={today}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.appointmentDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.appointmentDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.appointmentDate.message}
                </p>
              )}
            </div>

            {/* Appointment Time */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Appointment Time
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  {...register("appointmentTime")}
                  disabled={!editMode}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.appointmentTime
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${getDisabledStyles(!editMode)}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
              </div>
              {errors.appointmentTime && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.appointmentTime.message}
                </p>
              )}
            </div>

            {/* Status - Select dropdown for edit mode */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                {editMode ? (
                  <select
                    {...register("status")}
                    className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="BOOKED">BOOKED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="EXPIRED" disabled>
                      EXPIRED (Cannot select)
                    </option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formValues.status || appointmentData.status}
                    disabled
                    className={`block w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed opacity-90 border-gray-300`}
                  />
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {editMode && (
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
                  )}
                </div>
              </div>
              {!editMode && (
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(formValues.status || appointmentData.status)}`}
                  >
                    {formValues.status || appointmentData.status}
                  </span>
                </div>
              )}
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!editMode ? (
            <>
              {appointmentData.status !== "EXPIRED" && (
                <DeleteButton
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                />
              )}
              {appointmentData.status === "BOOKED" && (
                <EditButton onClick={() => setEditMode(true)} />
              )}
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
