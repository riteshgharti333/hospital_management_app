import React, { useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
  MdSave,
  MdLocalHospital,
} from "react-icons/md";
import { motion } from "framer-motion";

import BackButton from "../../components/BackButton/BackButton";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@medicare.com",
    position: "Chief Medical Officer",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Update profile logic here
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1500);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Update password logic here
    setTimeout(() => {
      setIsLoading(false);
      setIsUpdatingPassword(false);
      setPassword({ current: "", new: "", confirm: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-1">
           <BackButton />
            <MdLocalHospital className="text-3xl text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-800">MediCare</h1>
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h2 className="text-xl font-semibold text-white">My Profile</h2>
          </div>

          <div className="p-6 md:p-8">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                  <span className="text-4xl text-blue-600 font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Update your account details
                  </p>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdPerson className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={user.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdEmail className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={user.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Position
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdPerson className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="position"
                          name="position"
                          value={user.position}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
                            isLoading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                              Saving...
                            </>
                          ) : (
                            <>
                              <MdSave className="inline mr-1" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition flex items-center"
                      >
                        <MdEdit className="mr-1" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Password Update Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Password Update
                </h3>
                <p className="text-sm text-gray-500">
                  Change your account password
                </p>
              </div>

              {isUpdatingPassword ? (
                <form onSubmit={handlePasswordUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          id="currentPassword"
                          name="current"
                          value={password.current}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => togglePasswordVisibility("current")}
                        >
                          {showPasswords.current ? (
                            <MdVisibilityOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <MdVisibility className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          id="newPassword"
                          name="new"
                          value={password.new}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? (
                            <MdVisibilityOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <MdVisibility className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          id="confirmPassword"
                          name="confirm"
                          value={password.confirm}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPasswords.confirm ? (
                            <MdVisibilityOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <MdVisibility className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsUpdatingPassword(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsUpdatingPassword(true)}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition flex items-center"
                >
                  <MdLock className="mr-1" />
                  Change Password
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>
            © {new Date().getFullYear()} MediCare Hospital Management System.
            All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
