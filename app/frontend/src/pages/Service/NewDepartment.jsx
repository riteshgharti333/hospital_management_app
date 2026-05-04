import React, { useState, useEffect } from "react";
import { FaBuilding, FaUser, FaPhone, FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "../../components/BackButton/BackButton";
import { useCreateDepartment } from "../../feature/hooks/useDepartments";
import { toast } from "sonner";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useNavigate } from "react-router-dom";
import { useSearchDoctors } from "../../feature/hooks/useDoctor";

import { DepartmentNameEnum, departmentSchema } from "@hospital/schemas";

const NewDepartment = () => {
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
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
      doctorId: null,
      status: "ACTIVE",
    },
  });

  const { mutateAsync, isPending } = useCreateDepartment();

  // Watch form values
  const formValues = watch();

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
    // Prepare submission data with doctorId as number
    const submissionData = {
      name: data.name,
      description: data.description || "",
      doctorId: data.doctorId,
      status: data.status,
    };

    console.log("Submitting department data:", submissionData);

    const response = await mutateAsync(submissionData);

    if (response?.data?.success) {
      toast.success(response?.data?.message);
      navigate(`/department/${response.data.data.id}`);
    }
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

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaBuilding className="mr-2 text-blue-500" />
              New Department
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for the new department
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
            {/* Department Name - Select dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Department Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("name")}
                  className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
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
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
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

              {/* Show selected doctor name */}
              {selectedDoctor && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Selected Head:</span>{" "}
                    {selectedDoctor.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Specialization: {selectedDoctor.specialization}
                  </div>
                </div>
              )}

              {errors.doctorId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.doctorId.message}
                </p>
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
                  className="block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 border-gray-300"
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
            </div>

            {/* Description - Textarea spanning full width */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Enter department description"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton isLoading={isPending} type="submit">
            {isPending ? "Creating..." : "Create Department"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewDepartment;
