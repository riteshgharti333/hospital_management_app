import React from "react";
import {
  FaUser,
  FaPhone,
  FaBed,
  FaIdCard,
  FaVenusMars,
  FaHome,
  FaNotesMedical,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "../../components/BackButton/BackButton";
import { toast } from "sonner";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useCreatePatient } from "../../feature/hooks/usePatient";
import { patientSchema } from "@hospital/schemas";
import { useNavigate } from "react-router-dom";

const formFields = [
  {
    section: "Basic Information",
    icon: <FaUser className="text-blue-500" />,
    fields: [
      {
        label: "Full Name",
        type: "text",
        name: "fullName",
        placeholder: "Enter patient's full name",
        icon: <FaUser className="text-gray-400" />,
      },
      {
        label: "Age",
        type: "number",
        name: "age",
        placeholder: "Enter age",
        min: 0,
        max: 120,
      },
      {
        label: "Mobile Number",
        type: "tel",
        name: "mobileNumber",
        placeholder: "Enter mobile number",
        icon: <FaPhone className="text-gray-400" />,
      },
      {
        label: "Gender",
        type: "select",
        name: "gender",
        placeholder: "Select gender",
        options: ["Male", "Female", "Other"],
        icon: <FaVenusMars className="text-gray-400" />,
      },
    ],
  },
  {
    section: "Additional Details",
    icon: <FaBed className="text-blue-500" />,
    fields: [
      {
        label: "Bed Number",
        type: "text",
        name: "bedNumber",
        placeholder: "Enter bed number",
        icon: <FaBed className="text-gray-400" />,
      },
      {
        label: "Aadhaar Number",
        type: "text",
        name: "aadhaarNumber",
        placeholder: "Enter 12-digit Aadhaar number",
        icon: <FaIdCard className="text-gray-400" />,
        maxLength: 12,
      },
      {
        label: "Address",
        type: "textarea",
        name: "address",
        placeholder: "Enter full address",
        icon: <FaHome className="text-gray-400" />,
      },
      {
        label: "Medical History",
        type: "textarea",
        name: "medicalHistory",
        placeholder: "Enter any known medical conditions or history",
        icon: <FaNotesMedical className="text-gray-400" />,
      },
    ],
  },
];

const PatientRegister = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: "",
      age: 0,
      mobileNumber: "",
      gender: "",
      bedNumber: "",
      aadhaarNumber: "",
      address: "",
      medicalHistory: "",
    },
  });

  const { mutateAsync, isPending } = useCreatePatient();

  const onSubmit = async (data) => {
       const formattedData = {
        ...data,
        age: parseInt(data.age, 10),
      };

      const response = await mutateAsync(formattedData);
      const { success, message, data: createdPatient } = response;

         if (response?.data?.success) {
            toast.success(response?.data?.message);
            navigate(`/patient/${response.data.data.id}`);
          }
    }
 
  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaUser className="mr-2 text-blue-500" />
              Patient Registration
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for patient registration
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIndex) => {
                const error = errors[field.name];
                return (
                  <div
                    key={fieldIndex}
                    className={`space-y-1 ${
                      field.type === "textarea" ? "md:col-span-2" : ""
                    }`}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          {...register(field.name)}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                            field.icon ? "pl-10" : ""
                          } ${error ? "border-red-500" : "border-gray-300"}`}
                          aria-invalid={error ? "true" : "false"}
                        >
                          <option value="" disabled selected hidden>
                            {field.placeholder}
                          </option>
                          {field.options.map((option, i) => (
                            <option key={i} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {field.icon && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {field.icon}
                          </div>
                        )}
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
                      <div className="relative">
                        <textarea
                          {...register(field.name)}
                          rows={3}
                          placeholder={field.placeholder}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                            field.icon ? "pl-10" : ""
                          } ${error ? "border-red-500" : "border-gray-300"}`}
                          aria-invalid={error ? "true" : "false"}
                        />
                        {field.icon && (
                          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                            {field.icon}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name, {
                            valueAsNumber: field.type === "number",
                          })}
                          placeholder={field.placeholder}
                          min={field.min}
                          max={field.max}
                          maxLength={field.maxLength}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                            field.icon ? "pl-10" : ""
                          } ${error ? "border-red-500" : "border-gray-300"}`}
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

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <LoadingButton isLoading={isPending} type="submit">
            {isPending ? "Registering..." : "Register Patient"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default PatientRegister;
