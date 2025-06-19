import React from "react";
import { FaUser, FaPhone, FaMoneyBillWave, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { moneyReceiptSchema } from "@hospital/schemas";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useCreateMoneyReceipt } from "../../feature/transectionHooks/useMoneyReceipt";

const paymentModes = ["Cash", "Cheque", "Card", "Online Transfer", "Other"];
const statuses = ["Active", "Cancelled", "Refunded"];

const formFields = [
  {
    section: "Receipt Details",
    icon: <FaMoneyBillWave className="text-blue-500" />,
    fields: [
      {
        label: "Date",
        type: "date",
        name: "date",
      },
      {
        label: "Patient Name",
        type: "text",
        name: "patientName",
        placeholder: "Enter patient name",
        icon: <FaUser className="text-gray-400" />,
      },
      {
        label: "Mobile Number",
        type: "tel",
        name: "mobile",
        placeholder: "Enter mobile number",
        icon: <FaPhone className="text-gray-400" />,
      },
      {
        label: "Amount",
        type: "number",
        name: "amount",
        placeholder: "Enter amount",
      },
    ],
  },
  {
    section: "Payment Info",
    icon: <FaFileAlt className="text-blue-500" />,
    fields: [
      {
        label: "Payment Mode",
        type: "select",
        name: "paymentMode",
        options: paymentModes,
        placeholder: "Select payment mode",
      },
      {
        label: "Remarks",
        type: "textarea",
        name: "remarks",
        placeholder: "Enter any remarks (optional)",
      },
      {
        label: "Received By",
        type: "text",
        name: "receivedBy",
        placeholder: "Enter staff name",
      },
      {
        label: "Status",
        type: "select",
        name: "status",
        options: statuses,
        placeholder: "Select status",
      },
    ],
  },
];

const NewMoneyReceiptEntry = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moneyReceiptSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      patientName: "",
      mobile: "",
      amount: 0,
      paymentMode: "Cash",
      remarks: "",
      receivedBy: "",
      status: "Active",
    },
  });

  const { mutateAsync, isPending } = useCreateMoneyReceipt();

  const onSubmit = async (formData) => {
    const response = await mutateAsync(formData);
    if (response?.data?.success) {
      navigate(`/money-receipt/${response.data.data.id}`);
    }
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-blue-500" />
              New Money Receipt
            </h2>
            <p className="text-gray-600 mt-1">Fill all required details to generate a receipt</p>
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
            className={`p-6 ${sectionIndex !== 0 ? "border-t border-gray-100" : ""}`}
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
                    className={`space-y-1 ${field.type === "textarea" ? "md:col-span-2" : ""}`}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.name !== "remarks" && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          {...register(field.name)}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="" disabled hidden>
                            {field.placeholder}
                          </option>
                          {field.options.map((option, idx) => (
                            <option key={idx} value={option}>
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
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                            field.icon ? "pl-10" : ""
                          } ${error ? "border-red-500" : "border-gray-300"}`}
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
            {isPending ? "Creating..." : "Create Receipt"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewMoneyReceiptEntry;
