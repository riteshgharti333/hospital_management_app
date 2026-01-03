import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdPerson,
  MdEmail,
  MdBadge,
  MdPersonAdd,
  MdEdit,
  MdClear,
  MdSearch,
  MdLocalHospital,
  MdLocalPharmacy,
} from "react-icons/md";
import { useSearchDoctors } from "../../feature/hooks/useDoctor";
import { useSearchNurses } from "../../feature/hooks/useNurse";

const UserFormModal = ({
  show,
  editingUser,
  loadingLocal,
  register,
  errors,
  handleSubmit,
  onSubmit,
  onClose,
  setValue,
}) => {
  // Internal state for search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("doctor"); // "doctor" or "nurse"
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dropdownRef = useRef(null);

  // Use search hooks based on selected type
  const { data: doctorData, isLoading: loadingDoctors } = useSearchDoctors(
    searchType === "doctor" && searchTerm.trim().length >= 2 ? searchTerm : ""
  );

  const { data: nurseData, isLoading: loadingNurses } = useSearchNurses(
    searchType === "nurse" && searchTerm.trim().length >= 2 ? searchTerm : ""
  );

  // Get results based on selected type
  const searchResults =
    searchType === "doctor"
      ? (doctorData || []).slice(0, 10)
      : (nurseData || []).slice(0, 10);

  const isLoading = searchType === "doctor" ? loadingDoctors : loadingNurses;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim().length >= 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setSelectedUser(null);
      // Clear form fields when search is cleared
      if (setValue) {
        setValue("name", "");
        setValue("email", "");
        setValue("regId", "");
      }
    }
  };

  // Handle search type change
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm(""); // Clear search term when switching type
    setSelectedUser(null);
    setShowDropdown(false);
    // Clear form fields
    if (setValue) {
      setValue("name", "");
      setValue("email", "");
      setValue("regId", "");
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(`${user.fullName} (${user.registrationNo})`);
    setShowDropdown(false);

    if (setValue) {
      setValue("name", user.fullName, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      setValue("email", user.email, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      setValue("regId", user.registrationNo, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  // Clear search and selection
  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedUser(null);
    setShowDropdown(false);

    // Clear form fields
    if (setValue) {
      setValue("name", "");
      setValue("email", "");
      setValue("regId", "");
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            {/* Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {editingUser ? (
                      <MdEdit className="text-blue-500 text-xl" />
                    ) : (
                      <MdPersonAdd className="text-blue-500 text-xl" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {editingUser ? "Edit User" : "Create Staff Access"}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Search for existing staff to grant system access
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                >
                  <MdClear className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FORM */}
            <div className="p-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Search Section with Dropdown */}
                <div
                  className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 relative"
                  ref={dropdownRef}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-blue-800">
                      Search Existing Staff
                    </label>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Clear search
                      </button>
                    )}
                  </div>

                  {/* Search Type Selector */}
                  <div className="flex space-x-4 mb-3">
                    <button
                      type="button"
                      onClick={() => handleSearchTypeChange("doctor")}
                      className={`flex items-center px-4 py-2 rounded-lg border  cursor-pointer not-target:transition-colors ${
                        searchType === "doctor"
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <MdLocalHospital
                        className={`mr-2 ${
                          searchType === "doctor"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium">Doctors</span>
                      {searchType === "doctor" && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSearchTypeChange("nurse")}
                      className={`flex items-center px-4 py-2 rounded-lg border  cursor-pointer transition-colors ${
                        searchType === "nurse"
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <MdLocalPharmacy
                        className={`mr-2 ${
                          searchType === "nurse"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium">Nurses</span>
                      {searchType === "nurse" && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdSearch className="text-blue-500" />
                    </div>

                    <input
                      type="text"
                      placeholder={`Search ${
                        searchType === "doctor" ? "doctors" : "nurses"
                      } by name or registration ID (min. 2 characters)`}
                      className="w-full pl-10 pr-24 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() =>
                        searchTerm.length >= 2 && setShowDropdown(true)
                      }
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-xs text-gray-500">
                        {isLoading ? "Searching..." : "Type to search"}
                      </span>
                    </div>
                  </div>

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>
                        Searching{" "}
                        {searchType === "doctor" ? "doctors" : "nurses"}...
                      </span>
                    </div>
                  )}

                  {/* Search Results Dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="p-2 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500 font-medium">
                            {searchResults.length}{" "}
                            {searchType === "doctor" ? "doctors" : "nurses"}{" "}
                            found
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              searchType === "doctor"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {searchType === "doctor" ? "DOCTORS" : "NURSES"}
                          </span>
                        </div>
                      </div>

                      {searchResults.map((user) => (
                        <div
                          key={`${user.id}-${user.registrationNo}`}
                          className="flex items-center p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <div
                              className={`p-2 rounded-full ${
                                searchType === "doctor"
                                  ? "bg-red-100"
                                  : "bg-green-100"
                              }`}
                            >
                              {searchType === "doctor" ? (
                                <MdLocalHospital className="text-red-600" />
                              ) : (
                                <MdLocalPharmacy className="text-green-600" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {user.fullName}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1">
                              <span className="truncate">
                                <span className="font-medium">ID:</span>{" "}
                                {user.registrationNo}
                              </span>
                              <span className="hidden sm:inline mx-2">•</span>
                              <span className="truncate">
                                <span className="font-medium">Email:</span>{" "}
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* No Results Message */}
                  {showDropdown &&
                    searchTerm.length >= 2 &&
                    !isLoading &&
                    searchResults.length === 0 && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                        <p className="text-gray-600 text-center">
                          No {searchType === "doctor" ? "doctors" : "nurses"}{" "}
                          found matching "
                          <span className="font-medium">{searchTerm}</span>"
                        </p>
                        <p className="text-gray-500 text-sm text-center mt-1">
                          Try a different search term or check spelling
                        </p>
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          <p>
                            Searching in:{" "}
                            <span
                              className={`font-medium ${
                                searchType === "doctor"
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {searchType === "doctor"
                                ? "Doctors Database"
                                : "Nurses Database"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Selected User Info */}
                  {selectedUser && !showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div
                              className={`p-1.5 rounded-full mr-2 ${
                                searchType === "doctor"
                                  ? "bg-red-100"
                                  : "bg-green-100"
                              }`}
                            >
                              {searchType === "doctor" ? (
                                <MdLocalHospital className="text-red-600" />
                              ) : (
                                <MdLocalPharmacy className="text-green-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-green-800">
                                ✓ Selected{" "}
                                {searchType === "doctor" ? "Doctor" : "Nurse"}:{" "}
                                {selectedUser.fullName}
                              </p>
                              <p className="text-xs text-green-700 mt-1">
                                Form fields have been auto-filled
                              </p>
                            </div>
                          </div>
                          <div className="ml-7 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <p className="text-sm text-green-700">
                              <span className="font-medium">ID:</span>{" "}
                              {selectedUser.registrationNo}
                            </p>
                            <p className="text-sm text-green-700">
                              <span className="font-medium">Email:</span>{" "}
                              {selectedUser.email}
                            </p>
                            {selectedUser.department && (
                              <p className="text-sm text-green-700">
                                <span className="font-medium">Dept:</span>{" "}
                                {selectedUser.department}
                              </p>
                            )}
                            {selectedUser.mobileNumber && (
                              <p className="text-sm text-green-700">
                                <span className="font-medium">Mobile:</span>{" "}
                                {selectedUser.mobileNumber}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="text-green-600 hover:text-green-800 ml-2 cursor-pointer transition-colors"
                        >
                          <MdClear className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdPerson className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder={
                          selectedUser
                            ? selectedUser.fullName
                            : "Will auto-fill from search"
                        }
                        disabled={!!selectedUser}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          selectedUser
                            ? "bg-gray-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdEmail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder={
                          selectedUser
                            ? selectedUser.email
                            : "Will auto-fill from search"
                        }
                        disabled={!!selectedUser}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          selectedUser
                            ? "bg-gray-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Reg ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Registration ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdBadge className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register("regId")}
                        placeholder={
                          selectedUser
                            ? selectedUser.registrationNo
                            : "Will auto-fill from search"
                        }
                        disabled={!!selectedUser}
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          selectedUser
                            ? "bg-gray-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-5 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loadingLocal || !selectedUser}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium cursor-pointer text-white transition-colors ${
                      !selectedUser
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loadingLocal ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Access...
                      </span>
                    ) : (
                      "Create Staff Access"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default UserFormModal;
