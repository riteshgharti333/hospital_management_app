import React from "react";
import {
  MdLocalHospital,
  MdPerson,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
} from "react-icons/md";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginAsyncUser } from "../../redux/asyncThunks/authThunks";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // 🚀 INTEGRATED LOGIN FLOW
  const onSubmit = async (data) => {
    try {
      // convert userId → regId for backend API
      const body = {
        regId: data.regId,
        password: data.password,
      };


      console.log(body)
      const response = await dispatch(loginAsyncUser(body)).unwrap();

      toast.success(response.message || "Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Login failed");
    }
  };

  // Updated field names
  const formFields = [
    {
      label: "Registered ID",
      type: "text",
      name: "regId",
      placeholder: "Enter your registered ID",
      icon: <MdPerson className="text-blue-500" />,
      required: true,
      validation: {
        required: "Registered ID is required",
        minLength: {
          value: 3,
          message: "ID must be at least 3 characters",
        },
      },
    },
    {
      label: "Password",
      type: showPassword ? "text" : "password",
      name: "password",
      placeholder: "••••••••",
      icon: <MdLock className="text-blue-500" />,
      required: true,
      validation: {
        required: "Password is required",
      },
      rightIcon: (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-lg"
      >
        {/* Background blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/30 backdrop-blur-sm relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 text-center relative overflow-hidden">
            <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white p-3 rounded-2xl shadow-lg">
                  <MdLocalHospital className="text-4xl text-blue-600" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold text-white tracking-tight">MediCare Pro</h1>
                  <p className="text-blue-100 mt-1 text-lg">Hospital Management System</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {formFields.map((field, index) => {
                  const error = errors[field.name];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-700">
                        {field.label} <span className="text-red-500">*</span>
                      </label>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                          {field.icon}
                        </div>

                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...register(field.name, field.validation)}
                          className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl transition-all 
                            ${error ? "border-red-500" : "border-gray-200"}
                          `}
                        />

                        {field.rightIcon && (
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            {field.rightIcon}
                          </div>
                        )}
                      </div>

                      {error && (
                        <p className="text-red-600 text-sm font-medium">{error.message}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl"
                >
                  {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-6 border-t text-center text-xs text-gray-400">
              © {new Date().getFullYear()} MediCare Hospital System
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Login;
