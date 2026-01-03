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
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

// ====== NEW: Redux imports (profile + update) ======
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  refreshTokenThunk,
  updateUserProfile,
} from "../../redux/asyncThunks/authThunks";
import ChangePasswordModel from "../../components/Admin/ChangePasswordModel";

// ====== PROFILE SKELETON LOADER ======
const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-200 rounded-xl w-12 h-12"></div>
                <div>
                  <div className="h-7 w-32 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="hidden md:block h-10 w-48 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 w-16 bg-gray-300 rounded mb-2"></div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg w-10 h-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Profile Header Skeleton */}
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-300 border-4 border-white/30"></div>
                    <div>
                      <div className="h-6 w-40 bg-gray-400 rounded mb-3"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 w-20 bg-gray-400/50 rounded-full"></div>
                        <div className="h-6 w-24 bg-gray-400/50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 bg-gray-400/30 px-4 py-2 rounded-lg w-32 h-10"></div>
                </div>
              </div>

              {/* Profile Form Skeleton */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information Skeleton */}
                  <div className="space-y-4">
                    <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
                    
                    <div>
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                    
                    <div>
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Professional Information Skeleton */}
                  <div className="space-y-4">
                    <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
                    
                    <div>
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                    
                    <div>
                      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
                  <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Security Settings Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg w-10 h-10"></div>
                  <div className="h-6 w-32 bg-gray-300 rounded"></div>
                </div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
              
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    role: "",
    specialization: "",
    qualifications: [],
    avatarColor: "from-blue-500 to-indigo-600",
    isVerified: false,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { profile, status } = useSelector((state) => state.auth);

  // Check loading state from Redux
  const isLoading = status === "loading" || status === "idle";

  useEffect(() => {
    if (status !== "idle") return;

    const loadProfile = async () => {
      try {
        await dispatch(getUserProfile()).unwrap();
      } catch {
        try {
          await dispatch(refreshTokenThunk()).unwrap();
          await dispatch(getUserProfile()).unwrap();
        } catch {
          // logout or redirect
        }
      }
    };

    loadProfile();
  }, [status, dispatch]);

  useEffect(() => {
    if (profile) {
      setUser((prev) => ({
        ...prev,
        name: profile.name ?? prev.name,
        email: profile.email ?? prev.email,
        regId: profile.regId ?? prev.regId,
        role: profile.role?.[0] + profile.role?.slice(1).toLowerCase(),
        isVerified: profile.isVerified ?? false,
      }));
    }
  }, [profile]);

  // -------------------------
  // Check if user is admin
  // -------------------------
  const isAdmin = profile?.role?.toLowerCase() === "admin";

  // -------------------------
  // Handlers (unchanged behavior / UI)
  // -------------------------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Only allow submission if user is admin
    if (!isAdmin) {
      toast.error("You don't have permission to update profile");
      setIsEditingProfile(false);
      return;
    }

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
      console.log(err);
      toast.error(err || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Show skeleton while loading
  if (isLoading) return <ProfileSkeleton />;

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
              <BackButton />
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
                  <p className="text-lg font-bold text-blue-600">
                    {profile?.role}
                  </p>
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
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${profile?.avatarColor} flex items-center justify-center border-4 border-white/30`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {(profile?.name || "")
                          .split(" ")
                          .map((n) => (n ? n[0] : ""))
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {profile?.name}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                          {profile?.role}
                        </span>
                        {profile?.isVerified && (
                          <span className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-sm text-green-200 flex items-center space-x-1">
                            <MdVerified className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Only show edit profile button for admin users */}
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="hidden md:flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
                    >
                      {isEditingProfile ? (
                        <div className="cursor-pointer flex items-center space-x-2">
                          <MdSave className="w-4 h-4" />
                          <span>Save Changes</span>
                        </div>
                      ) : (
                        <div className="cursor-pointer flex items-center space-x-2">
                          <MdEdit className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </div>
                      )}
                    </button>
                  )}
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
                            value={user?.name}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile || !isAdmin}
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
                            value={user?.email}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile || !isAdmin}
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
                            value={user?.regId}
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
                          <input
                            type="text"
                            value={user?.role}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Only show action buttons for admin users */}
                  {isAdmin && (
                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
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
                          <div className="cursor-pointer flex items-center space-x-2">
                            <MdSave className="w-4 h-4" />
                            <span>Save Changes</span>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
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
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  {isEditingPassword ? "Cancel" : "Change Password"}
                </button>
              </div>

              {isEditingPassword ? (
                <ChangePasswordModel />
              ) : (
                <div className="space-y-4">
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
              <Link
                to="/privacy-policy"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-&-conditions"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/help-center"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;