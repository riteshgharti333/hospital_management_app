import React, { useState } from "react";
import {
  MdEmail,
  MdLock,
  MdLockReset,
  MdArrowBack,
  MdArrowForward,
  MdVerified,
  MdLocalHospital,
  MdCheckCircle,
  MdRefresh,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordThunk,
  verifyOtpThunk,
  resetPasswordThunk,
} from "../../redux/asyncThunks/authThunks";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { resetToken } = useSelector((state) => state.auth);

  // Email verification form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    watch: watchEmail,
  } = useForm();

  // OTP verification form
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    setValue: setOtpValue,
  } = useForm();

  // Reset password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    watch: watchReset,
    reset: resetForm,
  } = useForm();

  const emailValue = watchEmail("email", "");

  const onVerifyEmail = async (data) => {
    setLoading(true);
    try {
      const res = await dispatch(forgotPasswordThunk(data.email)).unwrap();

      toast.success(res.message);

      setEmail(data.email);
      setOtpSent(true);
      setCountdown(60);
      setStep(2);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setLoading(true);
    try {
      const otp = [
        data.otp0,
        data.otp1,
        data.otp2,
        data.otp3,
        data.otp4,
        data.otp5,
      ].join("");

      const res = await dispatch(verifyOtpThunk({ email, otp })).unwrap();

      toast.success(res.message);
      setStep(3);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setLoading(true);
    try {
      const res = await dispatch(
        resetPasswordThunk({
          token: resetToken,
          newPassword: data.newPassword,
        })
      ).unwrap();

      toast.success(res.message);
      toast.info("Please login with your new password");

      resetForm();

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (countdown > 0) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCountdown(60);
      setLoading(false);
      toast.success("New verification code sent!");

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) {
      e.target.value = value[0];
    }

    setOtpValue(`otp${index}`, value);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const steps = [
    { number: 1, title: "Verify Email", icon: <MdEmail /> },
    { number: 2, title: "Enter OTP", icon: <MdVerified /> },
    { number: 3, title: "Reset Password", icon: <MdLockReset /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/30 backdrop-blur-sm relative">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>

            <div className="flex items-center justify-between relative z-10">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
              >
                <MdArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Login</span>
              </Link>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="bg-white p-2 rounded-xl shadow-md">
                    <MdLockReset className="text-2xl text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    Reset Password
                  </h1>
                </div>
                <p className="text-blue-100 text-sm">
                  MediCare Hospital Management
                </p>
              </div>
              <div className="w-20"></div> {/* Spacer for alignment */}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-8 pt-8">
            <div className="flex items-center justify-between mb-8">
              {steps.map((s, index) => (
                <React.Fragment key={s.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${
                        step >= s.number
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-400"
                      }
                      ${
                        step === s.number
                          ? "ring-4 ring-blue-200 scale-110"
                          : ""
                      }
                    `}
                    >
                      {s.number < step ? <MdCheckCircle size={24} /> : s.icon}
                    </div>
                    <span
                      className={`
                      mt-2 text-sm font-medium
                      ${step >= s.number ? "text-blue-600" : "text-gray-400"}
                    `}
                    >
                      {s.title}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            step > s.number
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                              : "bg-gray-300"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: step > s.number ? "100%" : "0%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Email Verification */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-lg mx-auto"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Verify Your Email
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Enter your registered email address. We'll send a
                    verification code to reset your password.
                  </p>

                  <form onSubmit={handleSubmitEmail(onVerifyEmail)}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email Address
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MdEmail className="text-blue-500" size={20} />
                          </div>

                          <input
                            type="email"
                            id="email"
                            placeholder="your@email.com"
                            {...registerEmail("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            })}
                            className={`
                              w-full pl-12 pr-4 py-3
                              bg-gray-50 border-2 rounded-xl
                              focus:outline-none focus:ring-4 focus:ring-opacity-30
                              transition-all duration-300
                              ${
                                emailErrors.email
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }
                              hover:border-blue-400
                              placeholder-gray-400
                              font-medium
                            `}
                          />
                        </div>

                        {emailErrors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm font-medium mt-2"
                          >
                            ⚠ {emailErrors.email.message}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-8"
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className={`
                          w-full group relative cursor-pointer
                          py-3 px-6
                          bg-gradient-to-r from-blue-600 to-indigo-700
                          hover:from-blue-700 hover:to-indigo-800
                          focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
                          rounded-xl
                          font-semibold text-white
                          transition-all duration-300
                          transform hover:-translate-y-0.5 hover:shadow-xl
                          ${loading ? "opacity-80 cursor-not-allowed" : ""}
                        `}
                      >
                        <div className="relative flex items-center justify-center space-x-3">
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 text-white"
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
                              <span>Sending Code...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Verification Code</span>
                              <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-lg mx-auto"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Enter Verification Code
                  </h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a 6-digit code to{" "}
                    <span className="font-semibold text-blue-600">{email}</span>
                  </p>

                  <form onSubmit={handleSubmitOtp(onVerifyOtp)}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          6-Digit Verification Code
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <div className="flex justify-center space-x-3">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              maxLength="1"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              {...registerOtp(`otp${index}`, {
                                required: true,
                                pattern: /^[0-9]$/,
                              })}
                              onChange={(e) => handleOtpChange(e, index)}
                              className={`
                                w-14 h-14
                                text-center text-2xl font-bold
                                bg-gray-50 border-2 rounded-xl
                                focus:outline-none focus:ring-4 focus:ring-blue-200
                                transition-all duration-200
                                ${
                                  otpErrors[`otp${index}`]
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-200 focus:border-blue-500"
                                }
                                hover:border-blue-400
                              `}
                            />
                          ))}
                        </div>

                        <div className="mt-4 text-center">
                          {countdown > 0 ? (
                            <p className="text-gray-500 text-sm">
                              Resend code in{" "}
                              <span className="font-semibold text-blue-600">
                                {countdown}s
                              </span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={loading}
                              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
                            >
                              <MdRefresh
                                className={`w-4 h-4 ${
                                  loading
                                    ? "animate-spin"
                                    : "group-hover:rotate-180 transition-transform"
                                }`}
                              />
                              <span>Resend Verification Code</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 px-6 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 hover:shadow-lg cursor-pointer"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`
                          flex-1 group relative cursor-pointer
                          py-3 px-6
                          bg-gradient-to-r from-blue-600 to-indigo-700
                          hover:from-blue-700 hover:to-indigo-800
                          focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
                          rounded-xl
                          font-semibold text-white
                          transition-all duration-300
                          transform hover:-translate-y-0.5 hover:shadow-xl
                          ${loading ? "opacity-80 cursor-not-allowed" : ""}
                        `}
                      >
                        {loading ? "Verifying..." : "Verify Code"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Reset Password */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-lg mx-auto"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Set New Password
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Create a strong new password for your account
                  </p>

                  <form onSubmit={handleSubmitReset(onResetPassword)}>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          New Password
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MdLock className="text-blue-500" size={20} />
                          </div>

                          <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter new password"
                            {...registerReset("newPassword", {
                              required: "New password is required",
                              minLength: {
                                value: 8,
                                message:
                                  "Password must be at least 8 characters",
                              },
                              pattern: {
                                value:
                                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                message:
                                  "Must include uppercase, lowercase, number & special character",
                              },
                            })}
                            className={`
                              w-full pl-12 pr-4 py-3
                              bg-gray-50 border-2 rounded-xl
                              focus:outline-none focus:ring-4 focus:ring-opacity-30
                              transition-all duration-300
                              ${
                                resetErrors.newPassword
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }
                              hover:border-blue-400
                              placeholder-gray-400
                              font-medium
                            `}
                          />
                        </div>

                        {resetErrors.newPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm font-medium mt-2"
                          >
                            ⚠ {resetErrors.newPassword.message}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Confirm New Password
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MdLock className="text-blue-500" size={20} />
                          </div>

                          <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            {...registerReset("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === watchReset("newPassword") ||
                                "Passwords do not match",
                            })}
                            className={`
                              w-full pl-12 pr-4 py-3
                              bg-gray-50 border-2 rounded-xl
                              focus:outline-none focus:ring-4 focus:ring-opacity-30
                              transition-all duration-300
                              ${
                                resetErrors.confirmPassword
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }
                              hover:border-blue-400
                              placeholder-gray-400
                              font-medium
                            `}
                          />
                        </div>

                        {resetErrors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm font-medium mt-2"
                          >
                            ⚠ {resetErrors.confirmPassword.message}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`
                          w-full group relative
                          py-3 px-6
                          bg-gradient-to-r from-green-500 to-emerald-600
                          hover:from-green-600 hover:to-emerald-700
                          focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50
                          rounded-xl
                          font-semibold text-white
                          transition-all duration-300
                          transform hover:-translate-y-0.5 hover:shadow-xl
                          ${loading ? "opacity-80 cursor-not-allowed" : ""}
                        `}
                      >
                        <div className="relative flex items-center justify-center space-x-3">
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 text-white"
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
                              <span>Resetting Password...</span>
                            </>
                          ) : (
                            <>
                              <span>Reset Password</span>
                              <MdCheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-xs text-gray-400 text-center">
                  If you're having trouble resetting your password, please
                  contact support
                </p>
                <a
                  href="mailto:support@medicare.com"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  support@medicare.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
