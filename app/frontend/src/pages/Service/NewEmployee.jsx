import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUserCircle,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaVenusMars,
  FaHeart,
  FaIdCard,
  FaTint,
  FaBuilding,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../../components/BackButton/BackButton";
import { useCreateEmployee } from "../../feature/transectionHooks/useEmployee";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { employeeSchema } from "@hospital/schemas";

const NewEmployee = () => {
  const navigate = useNavigate();
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      dateOfRegistration: new Date().toISOString().split("T")[0],
      employeeName: "",
      fathersName: "",
      contactNo: "",
      dateOfBirth: "",
      email: "",
      gender: "Male",
      maritalStatus: "Unmarried",
      aadharNo: "",
      voterId: "",
      bloodGroup: "",
      department: "",
      photoUrl: "",
    },
  });

  const photoFile = watch("photo");

  // Handle photo preview
  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewPhoto(null);
    }
  }, [photoFile]);

  const { mutateAsync, isPending } = useCreateEmployee();

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const departments = [
    "General Medicine",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
  ];

 const onSubmit = async (data) => {
    const payload = {
        photoUrl: "https://example.com/image.jpg", // Dummy image URL
        employeeName: data.employeeName,
        fathersName: data.fathersName,
        dateOfRegistration: new Date(data.dateOfRegistration).toISOString(),
        contactNo: data.contactNo,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        email: data.email || "", // Handle optional field
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        aadharNo: data.aadharNo || "", // Handle optional field
        voterId: data.voterId || "", // Handle optional field
        bloodGroup: data.bloodGroup || "", // Handle optional field
        department: data.department
      };

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await mutateAsync(payload, config);
      
      if (response?.data?.success) {
       
        navigate("/employee/:id");
      }
    } 
  const getInputClass = (fieldName) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaUser className="mr-2 text-blue-600" />
              New Employee Registration
            </h2>
            <p className="text-gray-600 mt-1">
              Please fill all required employee details
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        encType="multipart/form-data"
      >
        <div className="p-6">
          <div className="flex items-center mb-6">
            <FaUser className="text-blue-500" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload */}
            {/* <div className="space-y-1 md:col-span-2 flex items-start">
              <div className="mr-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center">
                  {previewPhoto ? (
                    <img
                      src={previewPhoto}
                      alt="Employee Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 text-4xl" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Photo
                </label>
                <input
                  type="file"
                  {...register("photo")}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">JPG, PNG up to 2MB</p>
                {errors.photo && (
                  <p className="text-red-600 text-sm mt-1">{errors.photo.message}</p>
                )}
              </div>
            </div> */}

            <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Photo URL (Dummy)
        </label>
        <input
          type="hidden"
          {...register("photoUrl")}
          value="https://example.com/image.jpg"
        />
        <p className="text-sm text-gray-500">Using placeholder image URL</p>
      </div>


            {/* Employee Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Employee Name<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("employeeName")}
                  placeholder="Enter employee name"
                  className={`${getInputClass("employeeName")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
              </div>
              {errors.employeeName && (
                <p className="text-red-600 text-sm mt-1">{errors.employeeName.message}</p>
              )}
            </div>

            {/* Father's Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Father's Name<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("fathersName")}
                  placeholder="Enter father's name"
                  className={`${getInputClass("fathersName")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
              </div>
              {errors.fathersName && (
                <p className="text-red-600 text-sm mt-1">{errors.fathersName.message}</p>
              )}
            </div>

            {/* Date of Registration */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Date of Registration<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("dateOfRegistration")}
                  className={`${getInputClass("dateOfRegistration")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.dateOfRegistration && (
                <p className="text-red-600 text-sm mt-1">{errors.dateOfRegistration.message}</p>
              )}
            </div>

            {/* Contact No */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Contact No<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  {...register("contactNo")}
                  placeholder="Enter 10-digit contact number"
                  className={`${getInputClass("contactNo")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
              </div>
              {errors.contactNo && (
                <p className="text-red-600 text-sm mt-1">{errors.contactNo.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  max={new Date().toISOString().split("T")[0]}
                  className={`${getInputClass("dateOfBirth")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email address"
                  className={`${getInputClass("email")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Gender<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-4 pt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("gender")}
                    value="Male"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("gender")}
                    value="Female"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("gender")}
                    value="Other"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Other</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            {/* Marital Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Marital Status<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-4 pt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("maritalStatus")}
                    value="Married"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Married</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("maritalStatus")}
                    value="Unmarried"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Unmarried</span>
                </label>
              </div>
              {errors.maritalStatus && (
                <p className="text-red-600 text-sm mt-1">{errors.maritalStatus.message}</p>
              )}
            </div>

            {/* Aadhar No */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Aadhar No
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("aadharNo")}
                  placeholder="Enter 12-digit Aadhar number"
                  className={`${getInputClass("aadharNo")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" />
                </div>
              </div>
              {errors.aadharNo && (
                <p className="text-red-600 text-sm mt-1">{errors.aadharNo.message}</p>
              )}
            </div>

            {/* Voter ID */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Voter ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("voterId")}
                  placeholder="Enter Voter ID"
                  className={`${getInputClass("voterId")} pl-10`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" />
                </div>
              </div>
              {errors.voterId && (
                <p className="text-red-600 text-sm mt-1">{errors.voterId.message}</p>
              )}
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <div className="relative">
                <select
                  {...register("bloodGroup")}
                  className={`${getInputClass("bloodGroup")} bg-white pr-8 pl-10`}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTint className="text-gray-400" />
                </div>
              </div>
              {errors.bloodGroup && (
                <p className="text-red-600 text-sm mt-1">{errors.bloodGroup.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Department<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("department")}
                  className={`${getInputClass("department")} bg-white pr-8 pl-10`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
              </div>
              {errors.department && (
                <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton type="submit" isLoading={isPending}>
            Save Employee
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewEmployee;