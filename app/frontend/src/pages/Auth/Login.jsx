import React from "react";
import {
  MdLocalHospital,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loginAsyncUser } from "../../redux/asyncThunks/authThunks";
import { useNavigate } from "react-router-dom";
import logo  from "../../assets/images/logo.png";


const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(loginAsyncUser(data)).unwrap();
      if (response?.message) {
        toast.success(response.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const formFields = [
    {
      label: "Email Address",
      type: "email",
      name: "email",
      placeholder: "your@email.com",
      icon: <MdEmail className="text-gray-400" />,
      required: true,
    },
    {
      label: "Password",
      type: showPassword ? "text" : "password",
      name: "password",
      placeholder: "••••••••",
      icon: <MdLock className="text-gray-400" />,
      minLength: 8,
      required: true,
      rightIcon: (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
        </button>
      ),
    },
   
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MdLocalHospital className="text-3xl text-white" />
              <h1 className="text-2xl font-bold text-white">MediCare</h1>
            </div>
            <p className="text-blue-100">Hospital Management System</p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {formFields.map((field, index) => {
                  const error = errors[field.name];
                  return (
                    <div key={index} className="space-y-1">
                      {field.type !== "checkbox" && (
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {field.label}
                        </label>
                      )}
                      {field.type === "checkbox" ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={field.name}
                            {...register(field.name)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={field.name}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {field.label}
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          {field.icon && (
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {field.icon}
                            </div>
                          )}
                          <input
                            type={field.type}
                            id={field.name}
                            placeholder={field.placeholder}
                            {...register(field.name, {
                              required: field.required
                                ? `${field.label} is required`
                                : false,
                              minLength: field.minLength && {
                                value: field.minLength,
                                message: `${field.label} must be at least ${field.minLength} characters`,
                              },
                            })}
                            className={`w-full ${
                              field.icon ? "pl-10" : ""
                            } pr-${field.rightIcon ? "10" : "3"} py-2 border ${
                              error ? "border-red-500" : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                          />
                          {field.rightIcon && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              {field.rightIcon}
                            </div>
                          )}
                        </div>
                      )}
                      {error && (
                        <p className="text-red-600 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition mt-6 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>
                © {new Date().getFullYear()} MediCare Hospital Management
                System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
