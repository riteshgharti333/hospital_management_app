import React, { useState, useEffect } from "react";
import {
  FaUser, FaUserCircle, FaCalendarAlt, FaPhone, FaEnvelope, FaIdCard, FaTint, FaBuilding,
  FaEdit, FaTrash, FaSave
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import BackButton from "../../components/BackButton/BackButton";
import Loader from "../../components/Loader/Loader";
import NoData from "../../components/NoData/NoData";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import {
  EditButton, DeleteButton, CancelButton, SaveButton,
} from "../../components/ActionButtons/ActionButtons";

import { useGetEmployeeById, useUpdateEmployee, useDeleteEmployee } from "../../feature/transectionHooks/useEmployee";
import { employeeSchema } from "@hospital/schemas";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // --- Static Data ---
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const departments = [
    "General Medicine", "Pediatrics", "Orthopedics", "Gynecology",
    "Cardiology", "Neurology", "Oncology", "Radiology",
  ];

  // --- Data Hooks ---
  const { data: employeeData, isLoading } = useGetEmployeeById(id);
  const { mutateAsync: updateEmployee, isPending: isUpdating } = useUpdateEmployee();
  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema.partial()), // Use partial for updates
  });
  
  const getDisabledStyles = (isDisabled) =>
    isDisabled ? "bg-gray-100 cursor-not-allowed opacity-90" : "bg-white";

  // --- Photo Preview Logic ---
  const photoFile = watch("photo");
  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  }, [photoFile]);

  // --- Populate form with fetched data ---
  useEffect(() => {
    if (employeeData) {
      const formattedData = {
        ...employeeData,
        dateOfRegistration: employeeData.dateOfRegistration?.split("T")[0] || "",
        dateOfBirth: employeeData.dateOfBirth?.split("T")[0] || "",
      };
      reset(formattedData);
      if (employeeData.photoUrl) {
        setPreviewPhoto(employeeData.photoUrl);
      }
    }
  }, [employeeData, reset]);

  // --- Form Actions ---
  const onSubmit = async (data) => {
    const formData = new FormData();
    // Append all fields except the photo
    Object.keys(data).forEach(key => {
        if (key !== 'photo' && data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    // If a new photo file is selected, append it
    if (data.photo && data.photo[0]) {
        formData.append('photo', data.photo[0]);
    }

    try {
      const response = await updateEmployee({ id, data: formData });
      if (response?.data?.success) {
        toast.success(response.data.message);
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update employee.");
    }
  };

  const handleCancel = () => {
    const formattedData = {
        ...employeeData,
        dateOfRegistration: employeeData.dateOfRegistration?.split("T")[0] || "",
        dateOfBirth: employeeData.dateOfBirth?.split("T")[0] || "",
    };
    reset(formattedData);
    if (employeeData.photoUrl) {
      setPreviewPhoto(employeeData.photoUrl);
    }
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteEmployee(id);
      if (data && data.message) {
        toast.success(data.message);
        navigate("/employees");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete employee.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const getInputClass = (fieldName, isDisabled) =>
    `block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors[fieldName] ? "border-red-500" : "border-gray-300"} ${getDisabledStyles(isDisabled)}`;

  if (isLoading) return <Loader />;
  if (!employeeData) return <NoData />;

  return (
    <div className="">
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center ml-2">
              <FaUser className="mr-2 text-blue-600" />
              {editMode ? "Edit Employee" : "View Employee"}
            </h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6"><FaUser className="text-blue-500" /><h3 className="ml-2 text-lg font-semibold text-gray-800">Basic Information</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1 md:col-span-2 flex items-start">
              <div className="w-24 h-24 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center mr-4">
                  {previewPhoto ? (<img src={previewPhoto} alt="Employee" className="w-full h-full object-cover"/>) : (<FaUserCircle className="text-gray-400 text-4xl" />)}
              </div>
              <div className="flex-1">
                  <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                  <input id="photo-upload" type="file" {...register("photo")} accept="image/*" disabled={!editMode} className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${!editMode && 'cursor-not-allowed'}`}/>
                  <p className="mt-1 text-xs text-gray-500">JPG, PNG up to 2MB</p>
                  {errors.photo && <p className="text-red-600 text-sm mt-1">{errors.photo.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Employee Name<span className="text-red-500 ml-1">*</span></label>
              <div className="relative"><input type="text" {...register("employeeName")} disabled={!editMode} placeholder="Enter employee name" className={`${getInputClass("employeeName", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="text-gray-400" /></div></div>
              {errors.employeeName && <p className="text-red-600 text-sm mt-1">{errors.employeeName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Father's Name<span className="text-red-500 ml-1">*</span></label>
              <div className="relative"><input type="text" {...register("fathersName")} disabled={!editMode} placeholder="Enter father's name" className={`${getInputClass("fathersName", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="text-gray-400" /></div></div>
              {errors.fathersName && <p className="text-red-600 text-sm mt-1">{errors.fathersName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Date of Registration<span className="text-red-500 ml-1">*</span></label>
              <div className="relative"><input type="date" {...register("dateOfRegistration")} disabled={!editMode} className={`${getInputClass("dateOfRegistration", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaCalendarAlt className="text-gray-400" /></div></div>
              {errors.dateOfRegistration && <p className="text-red-600 text-sm mt-1">{errors.dateOfRegistration.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Contact No<span className="text-red-500 ml-1">*</span></label>
              <div className="relative"><input type="tel" {...register("contactNo")} disabled={!editMode} placeholder="Enter 10-digit contact number" className={`${getInputClass("contactNo", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="text-gray-400" /></div></div>
              {errors.contactNo && <p className="text-red-600 text-sm mt-1">{errors.contactNo.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Date of Birth<span className="text-red-500 ml-1">*</span></label>
              <div className="relative"><input type="date" {...register("dateOfBirth")} disabled={!editMode} max={new Date().toISOString().split("T")[0]} className={`${getInputClass("dateOfBirth", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaCalendarAlt className="text-gray-400" /></div></div>
              {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative"><input type="email" {...register("email")} disabled={!editMode} placeholder="Enter email address" className={`${getInputClass("email", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="text-gray-400" /></div></div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Gender<span className="text-red-500 ml-1">*</span></label>
              <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center"><input type="radio" {...register("gender")} value="Male" disabled={!editMode} className="h-4 w-4 text-blue-600 focus:ring-blue-500" /><span className="ml-2 text-gray-700">Male</span></label>
                  <label className="inline-flex items-center"><input type="radio" {...register("gender")} value="Female" disabled={!editMode} className="h-4 w-4 text-blue-600 focus:ring-blue-500" /><span className="ml-2 text-gray-700">Female</span></label>
                  <label className="inline-flex items-center"><input type="radio" {...register("gender")} value="Other" disabled={!editMode} className="h-4 w-4 text-blue-600 focus:ring-blue-500" /><span className="ml-2 text-gray-700">Other</span></label>
              </div>
              {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Marital Status<span className="text-red-500 ml-1">*</span></label>
              <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center"><input type="radio" {...register("maritalStatus")} value="Married" disabled={!editMode} className="h-4 w-4 text-blue-600 focus:ring-blue-500" /><span className="ml-2 text-gray-700">Married</span></label>
                  <label className="inline-flex items-center"><input type="radio" {...register("maritalStatus")} value="Unmarried" disabled={!editMode} className="h-4 w-4 text-blue-600 focus:ring-blue-500" /><span className="ml-2 text-gray-700">Unmarried</span></label>
              </div>
              {errors.maritalStatus && <p className="text-red-600 text-sm mt-1">{errors.maritalStatus.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Aadhar No</label>
              <div className="relative"><input type="text" {...register("aadharNo")} disabled={!editMode} placeholder="Enter 12-digit Aadhar number" className={`${getInputClass("aadharNo", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaIdCard className="text-gray-400" /></div></div>
              {errors.aadharNo && <p className="text-red-600 text-sm mt-1">{errors.aadharNo.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Voter ID</label>
              <div className="relative"><input type="text" {...register("voterId")} disabled={!editMode} placeholder="Enter Voter ID" className={`${getInputClass("voterId", !editMode)} pl-10`} /><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaIdCard className="text-gray-400" /></div></div>
              {errors.voterId && <p className="text-red-600 text-sm mt-1">{errors.voterId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <div className="relative">
                  <select {...register("bloodGroup")} disabled={!editMode} className={`${getInputClass("bloodGroup", !editMode)} pr-8 pl-10`}><option value="">Select blood group</option>{bloodGroups.map((group) => (<option key={group} value={group}>{group}</option>))}</select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaTint className="text-gray-400" /></div>
              </div>
              {errors.bloodGroup && <p className="text-red-600 text-sm mt-1">{errors.bloodGroup.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Department<span className="text-red-500 ml-1">*</span></label>
              <div className="relative">
                  <select {...register("department")} disabled={!editMode} className={`${getInputClass("department", !editMode)} pr-8 pl-10`}><option value="">Select department</option>{departments.map((dept) => (<option key={dept} value={dept}>{dept}</option>))}</select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaBuilding className="text-gray-400" /></div>
              </div>
              {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {!editMode ? (
              <>
                <DeleteButton onClick={() => setShowDeleteModal(true)} />
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

export default EditEmployee;