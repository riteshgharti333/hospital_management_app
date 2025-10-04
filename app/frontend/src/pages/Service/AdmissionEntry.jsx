import React from "react";
import {
  FaUserInjured,
  FaProcedures,
  FaIdCard,
  FaUserShield,
  FaPhone,
  FaHome,
  FaWeight,
  FaRulerVertical,
  FaBook,
  FaBriefcase,
  FaUserMd,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "../../components/BackButton/BackButton";
import { toast } from "sonner";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useCreateAdmission } from "../../feature/hooks/useAdmisson";
import { useNavigate } from "react-router-dom";

import { admissionSchema } from "@hospital/schemas";

const formFields = [
  {
    section: "Admission Details",
    icon: <FaProcedures className="text-blue-500" />,
    fields: [
      {
        label: "Admission Date",
        type: "date",
        name: "admissionDate",
        placeholder: "Select admission date",
      },
      {
        label: "Admission Time",
        type: "time",
        name: "admissionTime",
        placeholder: "Select admission time",
      },
      {
        label: "Date of Discharge",
        type: "date",
        name: "dischargeDate",
        placeholder: "Select discharge date",
      },

      {
        label: "Ward No",
        type: "select",
        name: "wardNo",
        placeholder: "Select ward number",
        options: ["Ward 1", "Ward 2", "Ward 3", "ICU", "Emergency"],
      },
      {
        label: "Bed No",
        type: "text",
        name: "bedNo",
        placeholder: "Enter bed number",
      },
      {
        label: "Blood Group",
        type: "select",
        name: "bloodGroup",
        placeholder: "Select blood group",
        options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      },
    ],
  },
  {
    section: "Patient Identification",
    icon: <FaUserInjured className="text-blue-500" />,
    fields: [
      {
        label: "Aadhaar No",
        type: "text",
        name: "aadhaarNo",
        placeholder: "Enter Aadhaar number",
        icon: <FaIdCard className="text-gray-400" />,
      },

      {
        label: "Patient Name",
        type: "text",
        name: "patientName",
        placeholder: "Enter patient name",
      },
      {
        label: "Patient Age",
        type: "number",
        name: "patientAge",
        placeholder: "Enter patient age",
      },
      {
        label: "Patient Sex",
        type: "select",
        name: "patientSex",
        placeholder: "Select sex",
        options: ["Male", "Female", "Other"],
      },
    ],
  },
  {
    section: "Guardian Details",
    icon: <FaUserShield className="text-blue-500" />,
    fields: [
      {
        label: "Guardian Type",
        type: "select",
        name: "guardianType",
        placeholder: "Select guardian type",
        options: ["Father", "Mother", "Spouse", "Other"],
      },
      {
        label: "Guardian Name",
        type: "text",
        name: "guardianName",
        placeholder: "Enter guardian name",
      },
      {
        label: "Phone No",
        type: "tel",
        name: "phoneNo",
        placeholder: "Enter phone number",
        icon: <FaPhone className="text-gray-400" />,
      },
    ],
  },
  {
    section: "Additional Information",
    icon: <FaHome className="text-blue-500" />,
    fields: [
      {
        label: "Patient Address",
        type: "textarea",
        name: "patientAddress",
        placeholder: "Enter patient address",
      },
      {
        label: "Body Weight (kg)",
        type: "number",
        name: "bodyWeightKg",
        placeholder: "Enter body weight",
        icon: <FaWeight className="text-gray-400" />,
      },
      {
        label: "Body Height (cm)",
        type: "number",
        name: "bodyHeightCm",
        placeholder: "Enter body height",
        icon: <FaRulerVertical className="text-gray-400" />,
      },
      {
        label: "Literacy",
        type: "text",
        name: "literacy",
        placeholder: "Enter literacy level",
        icon: <FaBook className="text-gray-400" />,
      },
      {
        label: "Occupation",
        type: "text",
        name: "occupation",
        placeholder: "Enter occupation",
        icon: <FaBriefcase className="text-gray-400" />,
      },
    ],
  },
  {
    section: "Medical Information",
    icon: <FaUserMd className="text-blue-500" />,
    fields: [
      {
        label: "Admission Under Doctor Name",
        type: "select",
        name: "doctorName",
        placeholder: "Select doctor",
        options: ["Dr. Sharma", "Dr. Mehta", "Dr. Gupta", "Dr. Roy"],
      },
      {
        label: "Delivery",
        type: "checkbox",
        name: "isDelivery",
        text: "Check if admission is for delivery",
      },
    ],
  },
];

const AdmissionEntry = () => {
  const navigate = useNavigate();

  const optionalFields = ["dischargeDate", "bodyWeightKg", "bodyHeightCm"];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      admissionDate: "",
      admissionTime: "",
      dischargeDate: "",
      wardNo: "",
      bedNo: "",
      bloodGroup: "",
      aadhaarNo: "",
      patientName: "",
      patientAge: 0,
      patientSex: "",
      guardianType: "",
      guardianName: "",
      phoneNo: "",
      patientAddress: "",
      bodyWeightKg: 0,
      bodyHeightCm: 0,
      literacy: "",
      occupation: "",
      doctorName: "",
      isDelivery: false,
    },
  });

  const { mutateAsync, isPending } = useCreateAdmission();

  const onSubmit = async (formData) => {
    const submissionData = {
      ...formData,
      admissionDate: new Date(formData.admissionDate),
      dischargeDate: formData.dischargeDate
        ? new Date(formData.dischargeDate)
        : undefined,
    };

    const response = await mutateAsync(submissionData);

    if (response?.data?.success) {
      toast.success(response?.data?.message);
      navigate(`/admission/${response.data.data.id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaProcedures className="mr-2 text-blue-600" />
              Patient Admission Form
            </h2>
            <p className="text-gray-600 mt-1">
              Please fill all required patient details
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.fields.map((field, fieldIndex) => {
                const error = errors[field.name];
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
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
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
                        rows={3}
                        placeholder={field.placeholder}
                        className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-invalid={error ? "true" : "false"}
                      />
                    ) : field.type === "checkbox" ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={field.name}
                          {...register(field.name)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={field.name}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {field.text}
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name, {
                            valueAsNumber: field.type === "number",
                          })}
                          placeholder={field.placeholder}
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
            {isPending ? "Submitting..." : "Submit Admission"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default AdmissionEntry;
