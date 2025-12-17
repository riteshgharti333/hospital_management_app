import React from "react";
import {
  MdLocalHospital,
  MdPerson,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdLogin,
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

  const onSubmit = async (data) => {
    try {
      const body = {
        regId: data.regId,
        password: data.password,
      };

      const response = await dispatch(loginAsyncUser(body)).unwrap();
      toast.success(response.message || "Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Login failed");
    }
  };

  const formFields = [
    {
      label: "Registered ID",
      type: "text",
      name: "regId",
      placeholder: "Enter your registered ID",
      icon: <MdPerson className="text-gray-600" size={20} />,
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
      icon: <MdLock className="text-gray-600" size={20} />,
      required: true,
      validation: {
        required: "Password is required",
      },
      rightIcon: (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <MdVisibilityOff size={20} />
          ) : (
            <MdVisibility size={20} />
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                  <MdLocalHospital className="text-4xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    MediCare
                  </h1>
                  <p className="text-white/80 text-sm mt-2 tracking-wide">
                    Hospital Management System
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-1">
                  Sign in to continue
                </h2>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {formFields.map((field, index) => {
                const error = errors[field.name];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-white/90">
                        {field.label}
                      </label>
                      {field.name === "password" && (
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-300 hover:text-blue-200 transition-colors hover:underline"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {field.icon}
                      </div>

                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name, field.validation)}
                        className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 rounded-xl transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-white/20
                          ${
                            error
                              ? "border-red-400/50 focus:border-red-400"
                              : "border-white/10 hover:border-white/30 focus:border-blue-400/50"
                          }
                          text-white placeholder-white/40
                        `}
                      />

                      {field.rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          {field.rightIcon}
                        </div>
                      )}
                    </div>

                    {error && (
                      <p className="text-red-300 text-sm font-medium flex items-center mt-1">
                        <span className="mr-2">⚠</span>
                        {error.message}
                      </p>
                    )}
                  </motion.div>
                );
              })}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl
                    hover:from-blue-600 hover:to-indigo-700 transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-slate-900
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg hover:shadow-xl hover:shadow-blue-500/20
                    flex items-center justify-center space-x-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <MdArrowForward
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            

            {/* Support & Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-white/70 text-center mb-4">
                Need assistance?{" "}
                <Link
                  to="/support"
                  className="text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors"
                >
                  Contact support
                </Link>
              </p>

              <div className="text-center">
                <p className="text-xs text-white/40 tracking-wide">
                  © {new Date().getFullYear()} MediCare Hospital System
                </p>
                <div className="mt-3 flex items-center justify-center space-x-4">
                  <Link
                    to="/privacy-policy"
                    className="text-xs text-white/50 hover:text-white/70 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-white/30">•</span>
                  <Link
                    to="/terms-&-conditions"
                    className="text-xs text-white/50 hover:text-white/70 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <span className="text-white/30">•</span>
                  <Link
                    to="/help-center"
                    className="text-xs text-white/50 hover:text-white/70 transition-colors"
                  >
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
