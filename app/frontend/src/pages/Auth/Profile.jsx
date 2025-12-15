import React, { useState, useEffect } from "react";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
  MdSave,
  MdLocalHospital,
  MdBadge,
  MdCalendarToday,
  MdPhone,
  MdVerified,
  MdSecurity,
  MdNotifications,
  MdSettings,
  MdArrowBack,
} from "react-icons/md";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// ====== NEW: Redux imports (profile + update) ======
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  refreshTokenThunk,
  updateUserProfile,
} from "../../redux/asyncThunks/authThunks";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -------------------------
  // Local state (keeps same variable names & design)
  // -------------------------
  const [user, setUser] = useState({
    name: "",
    email: "",
    regId: "",
    role: "Doctor",
    phone: "",
    joinDate: "",
    specialization: "",
    qualifications: [],
    avatarColor: "from-blue-500 to-indigo-600",
    isVerified: false,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const { user: reduxAuthUser, status } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await dispatch(getUserProfile()).unwrap();
      } catch (err) {
        // 🔥 access token expired
        await dispatch(refreshTokenThunk()).unwrap();
        await dispatch(getUserProfile()).unwrap();
      }
    };

    if (status === "idle") {
      loadProfile();
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (reduxAuthUser) {
      setUser((prev) => ({
        ...prev,
        name: reduxAuthUser.name ?? prev.name,
        email: reduxAuthUser.email ?? prev.email,
        regId: reduxAuthUser.regId ?? prev.regId,
        role:
          reduxAuthUser.role && typeof reduxAuthUser.role === "string"
            ? // map backend constants like "DOCTOR" -> display "Doctor" to match original UI casing
              reduxAuthUser.role[0] + reduxAuthUser.role.slice(1).toLowerCase()
            : prev.role,
        // keep avatarColor as default unless backend provides something
        avatarColor: prev.avatarColor,
        // isVerified may not exist; default false
        isVerified: reduxAuthUser.isVerified ?? false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxAuthUser]);

  // -------------------------
  // Handlers (unchanged behavior / UI)
  // -------------------------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(refreshTokenThunk()).unwrap();
      const retryResult = await dispatch(
        updateUserProfile({
          name: user.name,
          email: user.email,
        })
      ).unwrap();

      setUser((prev) => ({ ...prev, ...retryResult }));
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    // Dummy behavior — per request: not integrated to backend now
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Password changed successfully!");
    setIsEditingPassword(false);
    setPasswords({ current: "", new: "", confirm: "" });
    setLoading(false);
  };

  // Calculate password strength (identical to your original)
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(passwords.new);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    if (passwordStrength === 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (!passwords.new) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength === 3) return "Good";
    if (passwordStrength === 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdArrowBack className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <MdPerson className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    My Profile
                  </h1>
                  <p className="text-gray-600">Manage your account settings</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="text-lg font-bold text-green-600">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-lg font-bold text-blue-600">{user.role}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MdBadge className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center border-4 border-white/30`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {(user.name || "")
                          .split(" ")
                          .map((n) => (n ? n[0] : ""))
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {user.name}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                          {user.role}
                        </span>
                        {user.isVerified && (
                          <span className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-sm text-green-200 flex items-center space-x-1">
                            <MdVerified className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="hidden md:flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
                  >
                    {isEditingProfile ? (
                      <>
                        <MdSave className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <MdEdit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Personal Information
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdPerson className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdEmail className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Professional Information
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration ID
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdBadge className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={user.regId}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdPerson className="text-gray-400" />
                          </div>
                          <select
                            name="role"
                            value={user.role}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                          >
                            <option value="Doctor">Doctor</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isEditingProfile || loading}
                      className={`px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors flex items-center space-x-2 ${
                        !isEditingProfile || loading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <MdSave className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Security Settings */}
          <div className="space-y-6">
            {/* Password Change Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <MdSecurity className="text-red-500 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Security Settings
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isEditingPassword ? "Cancel" : "Change Password"}
                </button>
              </div>

              {isEditingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="current"
                          value={passwords.current}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="new"
                          value={passwords.new}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </button>
                      </div>

                      {/* Password Strength */}
                      {passwords.new && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">
                              Password Strength:
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                passwordStrength <= 2
                                  ? "text-red-600"
                                  : passwordStrength === 3
                                  ? "text-yellow-600"
                                  : passwordStrength === 4
                                  ? "text-blue-600"
                                  : "text-green-600"
                              }`}
                            >
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirm"
                          value={passwords.confirm}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Last password change: 3 months ago
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      For security reasons, it's recommended to change your
                      password every 90 days.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} MediCare Hospital Management System
            </p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
