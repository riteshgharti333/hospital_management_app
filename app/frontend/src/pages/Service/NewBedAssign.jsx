import React from "react";
import { FaBed, FaUser, FaCalendarAlt, FaStickyNote } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "../../components/BackButton/BackButton";
import { useCreateBedAssignment } from "../../feature/hooks/useBedAssing";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { bedAssignmentSchema } from "@hospital/schemas";
import { useNavigate } from "react-router-dom";

const formFields = [
  {
    section: "Bed Information",
    icon: <FaBed className="text-blue-500" />,
    fields: [
      {
        label: "Ward Number",
        type: "text",
        name: "wardNumber",
        placeholder: "Enter ward number (e.g., W001, ICU)",
        required: true,
      },
      {
        label: "Bed Number",
        type: "text",
        name: "bedNumber",
        placeholder: "Enter bed number (e.g., B001, ICU-01)",
        required: true,
      },
      {
        label: "Bed Type",
        type: "select",
        name: "bedType",
        placeholder: "Select bed type",
        options: [
          "General",
          "ICU",
          "Private",
          "Semi-Private",
          "Pediatric",
          "Emergency",
        ],
        required: true,
      },
    ],
  },
  {
    section: "Patient Information",
    icon: <FaUser className="text-blue-500" />,
    fields: [
      {
        label: "Patient Name",
        type: "text",
        name: "patientName",
        placeholder: "Enter patient's full name",
        icon: <FaUser className="text-gray-400" />,
        required: true,
      },
      {
        label: "Allocation Date",
        type: "date",
        name: "allocateDate",
        placeholder: "Select allocation date",
        icon: <FaCalendarAlt className="text-gray-400" />,
        required: true,
      },
      {
        label: "Expected Discharge Date",
        type: "date",
        name: "dischargeDate",
        placeholder: "Select expected discharge date (optional)",
        icon: <FaCalendarAlt className="text-gray-400" />,
        required: false,
      },
      {
        label: "Status",
        type: "select",
        name: "status",
        placeholder: "Select assignment status",
        options: ["Active", "Discharged", "Transferred"],
        required: true,
      },
    ],
  },
  {
    section: "Additional Details",
    icon: <FaStickyNote className="text-blue-500" />,
    fields: [
      {
        label: "Notes",
        type: "textarea",
        name: "notes",
        placeholder:
          "Enter any additional notes about the bed assignment (optional)",
        icon: <FaStickyNote className="text-gray-400" />,
        required: false,
      },
    ],
  },
];

const NewBedAssign = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bedAssignmentSchema),
    defaultValues: {
      wardNumber: "",
      bedNumber: "",
      bedType: "",
      patientName: "",
      allocateDate: "",
      dischargeDate: "",
      status: "Active",
      notes: "",
    },
  });

  const { mutateAsync, isPending } = useCreateBedAssignment();

  const onSubmit = async (data) => {
    const cleanedData = {
      ...data,
      allocateDate: new Date(data.allocateDate),
      dischargeDate: data.dischargeDate || undefined,
      notes: data.notes?.trim() || undefined,
    };

    const response = await mutateAsync(cleanedData);

    if (response?.data?.success) {
       navigate(`/bed-assign/${response.data.data.id}`);
    }
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaBed className="mr-2 text-blue-500" />
              Assign Bed to Patient
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for bed assignment
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
                      {field.required && (
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
                          {...register(field.name)}
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
            {isPending ? "Assigning..." : "Assign Bed"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewBedAssign;
