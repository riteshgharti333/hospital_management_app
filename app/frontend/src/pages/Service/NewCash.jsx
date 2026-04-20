import {
  FaMoneyBillWave,
  FaToggleOn,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../../components/BackButton/BackButton";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { cashSchema } from "@hospital/schemas";
import { useCreateCashAccount } from "../../feature/hooks/useCash";
import { useNavigate } from "react-router-dom";

const formFields = [
  {
    section: "Cash Account Information",
    icon: <FaMoneyBillWave className="text-green-500" />,
    fields: [
      {
        label: "Cash Account Name",
        type: "text",
        name: "cashName",
        placeholder: "Enter cash account name",
        icon: <FaMoneyBillWave className="text-gray-400" />,
        required: true,
      },
      {
        label: "Status",
        type: "select",
        name: "isActive",
        placeholder: "Select status",
        options: [
          { label: "Active", value: true },
          { label: "Inactive", value: false },
        ],
        required: true,
      },
    ],
  },
];

const NewCash = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cashSchema),
    defaultValues: {
      cashName: "",
      isActive: true,
    },
  });

  const { mutateAsync, isPending } = useCreateCashAccount();

  const onSubmit = async (data) => {
    const response = await mutateAsync(data);
    navigate(`/cash/${response.data.data.id}`);
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-500" />
              Add New Cash Account
            </h2>
            <p className="text-gray-600 mt-1">
              Please enter all required details for the new cash account
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
                  <div key={fieldIndex} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          {...register(field.name, {
                            setValueAs: (value) =>
                              value === "true"
                                ? true
                                : value === "false"
                                ? false
                                : value,
                          })}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 appearance-none bg-white pr-8 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          aria-invalid={error ? "true" : "false"}
                        >
                          <option value="" disabled>
                            {field.placeholder}
                          </option>
                          {field.options.map((option, i) => (
                            <option
                              key={i}
                              value={option.value.toString()}
                            >
                              {option.label}
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
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type}
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          className={`block w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
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
            {isPending ? "Creating..." : "Add Cash Account"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default NewCash;