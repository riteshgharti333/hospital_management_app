import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaUserMd, FaSearch, FaStethoscope } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "../../components/BackButton/BackButton";
import { useCreateAppointment } from "../../feature/hooks/useAppointment";
import { useSearchDoctors } from "../../feature/hooks/useDoctor";
import { toast } from "sonner";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useNavigate } from "react-router-dom";

// Appointment Status Enum
export const AppointmentStatusEnum = z.enum(["BOOKED", "CANCELLED", "EXPIRED"]);

// Schema for appointment
export const appointmentSchema = z.object({
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  doctorId: z.number().min(1, "Please select a doctor"),
  status: AppointmentStatusEnum.default("BOOKED"),
});

const NewAppointment = () => {
  const navigate = useNavigate();
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

 

      const { data: searchResponse, isLoading: searchingDoctors } =
      useSearchDoctors(searchDoctorQuery);
    
      const doctorSearchResults = searchResponse?.data || [];
    

  const {
    register,
    handleSubmit,
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

  const { mutateAsync, isPending } = useCreateAppointment();

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

  const onSubmit = async (data) => {
    const submissionData = {
      appointmentDate: new Date(data.appointmentDate),
      appointmentTime: data.appointmentTime,
      doctorId: data.doctorId,
      status: data.status,
    };

    console.log("Submitting appointment data:", submissionData);

    const response = await mutateAsync(submissionData);
    
    if (response?.data?.success) {
      toast.success(response?.data?.message || "Appointment created successfully");
      navigate(`/appointment/${response.data.data.id}`);
    }
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              New Appointment
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for the new appointment
            </p>
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
                    setSearchDoctorQuery(e.target.value);
                    setShowDoctorSearch(true);
                  }}
                  onFocus={() => setShowDoctorSearch(true)}
                  placeholder="Search by Doctor Name or Registration No..."
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.doctorId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                {showDoctorSearch && (
                  <SearchResults
                    results={doctorSearchResults}
                    loading={searchingDoctors}
                    onSelect={handleDoctorSelect}
                  />
                )}
              </div>
              
              {selectedDoctor && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Selected Doctor:</span> {selectedDoctor.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Specialization: {selectedDoctor.specialization}
                  </div>
                </div>
              )}
              
              {errors.doctorId && (
                <p className="text-red-600 text-sm mt-1">{errors.doctorId.message}</p>
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
                  min={today}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.appointmentDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.appointmentDate && (
                <p className="text-red-600 text-sm mt-1">{errors.appointmentDate.message}</p>
              )}
            </div>

            {/* Appointment Time - Simple time input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Appointment Time
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  {...register("appointmentTime")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 ${
                    errors.appointmentTime ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
              </div>
              {errors.appointmentTime && (
                <p className="text-red-600 text-sm mt-1">{errors.appointmentTime.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <LoadingButton isLoading={isPending} type="submit">
            {isPending ? "Creating..." : "Create Appointment"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewAppointment;