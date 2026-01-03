// AdminAccessManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  MdPerson,
  MdEmail,
  MdBadge,
  MdLock,
  MdLockOpen,
  MdPersonAdd,
  MdSearch,
  MdClear,
  MdCheckCircle,
  MdCancel,
  MdDelete,
  MdAdminPanelSettings,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
  MdLocalHospital,
  MdFilterList,
  MdContentCopy,
  MdRefresh,
  MdKey,
  MdWarning,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  createStaffAccessThunk,
  toggleStaffAccessThunk,
  getUsers,
  refreshTokenThunk,
  regenerateTempPasswordThunk,
  deleteUserThunk,
} from "../../redux/asyncThunks/authThunks";
import UserFormModal from "../../components/Admin/UserFormModal";

// ====== SKELETON LOADER ======
const AdminAccessSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <div className="h-8 w-48 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
            </div>
          </div>

          {/* Filter Buttons Skeleton */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg w-10 h-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header Skeleton */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="h-5 w-48 bg-gray-300 rounded"></div>
          </div>

          {/* Table Column Headers Skeleton */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-span-3">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          {/* Table Rows Skeleton */}
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="grid grid-cols-12 gap-4 p-4 items-center"
              >
                {[1, 2, 3, 4].map((col) => (
                  <div key={col} className="col-span-3">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====== TEMP PASSWORD POPUP COMPONENT ======
const TempPasswordPopup = ({ user, tempPassword, onClose, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 cursor-pointer"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md popup-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Popup Header */}
          <div className="border-b border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MdKey className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Login Credentials
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Share these details with {user?.name || "the user"}
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

          {/* Popup Content */}
          <div className="p-5">
            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {(user?.name || "").charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Registration ID</p>
                    <p className="font-medium text-gray-800">{user?.regId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Role</p>
                    <p className="font-medium text-gray-800">{user?.role}</p>
                  </div>
                </div>
              </div>

              {/* Temp Password Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-100 rounded">
                      <MdLock className="text-blue-600 w-4 h-4" />
                    </div>
                    <span className="font-medium text-blue-800">
                      Temporary Password
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(tempPassword)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    <MdContentCopy className="w-3.5 h-3.5" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-lg"></div>
                  <div className="relative px-4 py-3 bg-white/50 backdrop-blur-sm border border-blue-300 rounded-lg">
                    <div className="flex justify-between items-center">
                      <code className="text-lg font-mono font-bold text-gray-800 tracking-wider">
                        {tempPassword}
                      </code>
                      <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        Temporary
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-200">
              <button
                onClick={onRegenerate}
                className="flex items-center cursor-pointer space-x-2 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                <MdRefresh className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ====== DELETE CONFIRMATION POPUP ======
const DeleteConfirmationPopup = ({ user, onClose, onConfirm, loading }) => {
  if (!user) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 cursor-pointer"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md popup-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Popup Header */}
          <div className="border-b border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <MdWarning className="text-red-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Delete User
                  </h2>
                  <p className="text-gray-600 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                disabled={loading}
              >
                <MdClear className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Popup Content */}
          <div className="p-5">
            <div className="mb-6">
              <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {(user?.name || "").charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {user?.regId}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user?.role === "Doctor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MdWarning className="text-yellow-600 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">
                      Important Warning
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-4">
                      <li>All user data will be permanently deleted</li>
                      <li>Access history will be removed</li>
                      <li>This action cannot be undone</li>
                      <li>User will no longer be able to login</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex items-center cursor-pointer space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <MdDelete className="w-4 h-4" />
                    <span>Delete User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const AdminAccessManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local UI state
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [regeneratingUserId, setRegeneratingUserId] = useState(null);
  const [searchRegId, setSearchRegId] = useState("");
  const [regIdSearching, setRegIdSearching] = useState(false);
  const [regIdError, setRegIdError] = useState("");
  const [filter, setFilter] = useState("all");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Temp password popup state
  const [showTempPasswordPopup, setShowTempPasswordPopup] = useState(false);
  const [tempPasswordData, setTempPasswordData] = useState({
    user: null,
    tempPassword: "",
  });

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // Redux state with safe defaults
  const authState = useSelector((s) => s.auth || {});
  
  // Destructure with safe defaults
  const {
    status = "idle",
    all = { users: [], total: 0 },
    totalUsers = 0,
    activeAccess = 0,
    deniedAccess = 0,
  } = authState;

  // Check loading state
  const isLoading = status === "loading" || status === "idle";

  // Map role filter value to API role
  const roleParam = useMemo(() => {
    if (filter === "all") return undefined;
    if (filter === "doctor") return "DOCTOR";
    if (filter === "nurse") return "NURSE";
    return undefined;
  }, [filter]);

  // Fetch users when component mounts or filter changes
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchUsers = async () => {
    try {
      await dispatch(getUsers({ role: roleParam })).unwrap();
    } catch (err) {
      try {
        await dispatch(refreshTokenThunk()).unwrap();
        await dispatch(getUsers({ role: roleParam })).unwrap();
      } catch (error) {
        console.log("Error fetching users:", error);
        toast.error(error?.message || "Session expired. Please login again.");
      }
    }
  };

  // Safely get all users with defaults
  const allUsers = useMemo(() => {
    const usersArray = all?.users || [];
    return usersArray.filter(
      (user) => user?.role && user.role.toLowerCase() !== "admin"
    );
  }, [all]);

  // Filter based on current filter selection
  const filteredByRole = useMemo(() => {
    if (filter === "all") return allUsers;
    return allUsers.filter(
      (user) => 
        user?.role && 
        user.role.toLowerCase() === filter.toLowerCase()
    );
  }, [allUsers, filter]);

  // Apply search filter
  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return filteredByRole;
    
    return filteredByRole.filter((user) => {
      return (
        (user?.name || "").toLowerCase().includes(q) ||
        (user?.email || "").toLowerCase().includes(q) ||
        (user?.regId || "").toLowerCase().includes(q) ||
        (user?.role || "").toLowerCase().includes(q)
      );
    });
  }, [filteredByRole, searchTerm]);

  // Counts - filter out admin users from counts
  const counts = useMemo(() => {
    return {
      all: allUsers.length,
      doctor: filteredByRole.filter((u) => 
        u?.role?.toLowerCase() === "doctor"
      ).length,
      nurse: filteredByRole.filter((u) => 
        u?.role?.toLowerCase() === "nurse"
      ).length,
    };
  }, [allUsers, filteredByRole]);

  const toggleUserAccess = async (user) => {
    if (!user?.regId) {
      toast.error("Registration ID not found");
      return;
    }

    const action = user.status === "active" ? "DISABLE" : "ENABLE";

    try {
      await dispatch(
        toggleStaffAccessThunk({
          regId: user.regId,
          action,
        })
      ).unwrap();

      toast.success(action === "ENABLE" ? "Access enabled" : "Access disabled");
      fetchUsers();
    } catch (err) {
      try {
        await dispatch(refreshTokenThunk()).unwrap();
        await dispatch(
          toggleStaffAccessThunk({
            regId: user.regId,
            action,
          })
        ).unwrap();

        toast.success(
          action === "ENABLE" ? "Access enabled" : "Access disabled"
        );
        fetchUsers();
      } catch (error) {
        toast.error(error?.message || "Session expired. Please login again.");
      }
    }
  };

  const onAddUser = async (data) => {
    setLoadingLocal(true);
    try {
      const result = await dispatch(
        createStaffAccessThunk({
          name: data.name,
          email: data.email,
          regId: data.regId,
        })
      ).unwrap();

      // Show temp password popup after successful creation
      if (result.data?.tempPassword) {
        setTempPasswordData({
          user: {
            name: data.name,
            email: data.email,
            regId: data.regId,
            role: data.role,
          },
          tempPassword: result.data.tempPassword,
        });
        setShowTempPasswordPopup(true);
      }

      toast.success("Staff access created successfully");
      reset();
      setShowRegistration(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || "Failed to create staff access");
    } finally {
      setLoadingLocal(false);
    }
  };

  const regenerateTempPassword = async (user) => {
    if (!user?.regId) {
      toast.error("Registration ID not found");
      return;
    }

    setRegeneratingUserId(user.id);
    try {
      const result = await dispatch(
        regenerateTempPasswordThunk({
          regId: user.regId,
        })
      ).unwrap();

      if (result.data?.tempPassword) {
        setTempPasswordData({
          user: {
            name: user.name,
            email: user.email,
            regId: user.regId,
            role: user.role,
          },
          tempPassword: result.data.tempPassword,
        });
        setShowTempPasswordPopup(true);
        toast.success(result?.message || "New Temp password generated");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to regenerate temporary password");
    } finally {
      setRegeneratingUserId(null);
    }
  };

  const handleRegenerateInPopup = async () => {
    if (!tempPasswordData.user?.regId) return;

    try {
      const result = await dispatch(
        regenerateTempPasswordThunk({
          regId: tempPasswordData.user.regId,
        })
      ).unwrap();

      if (result.data?.tempPassword) {
        setTempPasswordData((prev) => ({
          ...prev,
          tempPassword: result.data.tempPassword,
        }));
        toast.success(result?.message || "New Temp password generated");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to regenerate password");
    }
  };

  // Handle delete user confirmation
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Delete user function
  const handleDeleteUser = async () => {
    if (!userToDelete?.regId) {
      toast.error("Registration ID not found");
      return;
    }

    setDeleting(true);
    try {
      // Call the delete thunk with regId
      const result = await dispatch(
        deleteUserThunk(userToDelete.regId)
      ).unwrap();

      toast.success(result?.message || "User deleted successfully");
      
      // Close modal and refresh users
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  // Handle Edit Icon Click - Redirect based on role
  const handleEditClick = (user) => {
    if (!user?.regId) {
      toast.error("Registration ID not found");
      return;
    }

    const role = user?.role?.toLowerCase();

    if (role === "doctor") {
      navigate(`/doctor/${user.regId}`);
    } else if (role === "nurse") {
      navigate(`/nurse/${user.regId}`);
    } else {
      toast.error(`Cannot edit ${user.role || 'unknown'} profile from here`);
    }
  };

  // Registered ID search auto-fill
  const handleRegIdSearch = async (value) => {
    setSearchRegId(value);
    if (value.length >= 3) {
      setRegIdSearching(true);
      setRegIdError("");
      await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
      setRegIdError("No registered user found with this ID");
    }
    setRegIdSearching(false);
  };

  // FilterButton component
  const FilterButton = ({ label, value, count, icon: Icon }) => {
    const isActive = filter === value;
    return (
      <button
        onClick={() => setFilter(value)}
        className={`flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
          />
        )}
        <span className="font-medium">{label}</span>
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  // Show skeleton while loading
  if (isLoading) return <AdminAccessSkeleton />;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Access Management
              </h1>
              <p className="text-gray-600">Manage user access controls</p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <MdClear />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  reset();
                  setShowRegistration(true);
                }}
                className="flex cursor-pointer items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <MdPersonAdd className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <MdFilterList className="text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">
                Filter by Role:
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <FilterButton label="All Users" value="all" count={counts.all} />
              <FilterButton
                label="Doctors"
                value="doctor"
                count={counts.doctor}
                icon={MdLocalHospital}
              />
              <FilterButton
                label="Nurses"
                value="nurse"
                count={counts.nurse}
                icon={MdPerson}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {counts.all}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MdPerson className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Access</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {activeAccess || 0}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <MdCheckCircle className="text-green-500 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Disabled Access</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {deniedAccess || 0}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <MdCancel className="text-red-500 text-xl cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header with filter info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Showing {filteredUsers.length} of {counts.all} users
                  {filter !== "all" && (
                    <span className="ml-2 text-blue-600">
                      • Filtered by:{" "}
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </span>
                  )}
                </h3>
              </div>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 font-medium mt-2 md:mt-0"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Table Column Headers */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-5 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.div
                    key={user.id || user.regId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    {/* User Info */}
                    <div className="col-span-3 flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                          user.avatarColor || "from-gray-400 to-gray-500"
                        } flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-sm">
                          {(user.name || "")
                            .split(" ")
                            .map((n) => (n && n[0]) || "")
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MdEmail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <MdBadge className="w-3 h-3" />
                          <span>ID: {user.regId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "Doctor"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "Nurse"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role || "Unknown"}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            user.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-5 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => regenerateTempPassword(user)}
                        disabled={regeneratingUserId === user.id}
                        className="flex cursor-pointer items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-yellow-50 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Generate Temp Password"
                      >
                        <MdRefresh
                          className={`w-4 h-4 ${
                            regeneratingUserId === user.id ? "animate-spin" : ""
                          }`}
                        />
                        <span>
                          {regeneratingUserId === user.id
                            ? "Generating..."
                            : "Temp Password"}
                        </span>
                      </button>

                      <button
                        onClick={() => toggleUserAccess(user)}
                        className={`flex cursor-pointer items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          user.status === "active"
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {user.status === "active" ? (
                          <>
                            <MdLock className="w-4 h-4" />
                            <span>Disable</span>
                          </>
                        ) : (
                          <>
                            <MdLockOpen className="w-4 h-4" />
                            <span>Enable</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-1.5 cursor-pointer text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={`Edit ${user.role} Profile`}
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-1.5 cursor-pointer text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Empty State
                <div className="text-center py-12 col-span-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MdPerson className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? `No users match "${searchTerm}"`
                      : `No ${filter === "all" ? "" : filter + " "}users available`}
                  </p>
                  <div className="flex justify-center space-x-3">
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-sm"
                      >
                        Clear search
                      </button>
                    )}
                    {filter !== "all" && (
                      <button
                        onClick={() => setFilter("all")}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-sm"
                      >
                        Show all users
                      </button>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegistration && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRegistration(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                {/* Modal Header */}
                <div className="border-b border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MdPersonAdd className="text-blue-500 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          Register New User
                        </h2>
                        <p className="text-gray-600 text-sm">
                          Fill in the user details below
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowRegistration(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                    >
                      <MdClear className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <UserFormModal
                  show={showRegistration}
                  editingUser={false}
                  loadingLocal={loadingLocal}
                  register={register}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  onSubmit={onAddUser}
                  setValue={setValue}
                  searchRegId={searchRegId}
                  regIdSearching={regIdSearching}
                  regIdError={regIdError}
                  handleRegIdSearch={handleRegIdSearch}
                  onClose={() => {
                    setShowRegistration(false);
                    reset();
                    setSearchRegId("");
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Temp Password Popup */}
      <AnimatePresence>
        {showTempPasswordPopup && (
          <TempPasswordPopup
            user={tempPasswordData.user}
            tempPassword={tempPasswordData.tempPassword}
            onClose={() => setShowTempPasswordPopup(false)}
            onRegenerate={handleRegenerateInPopup}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmationPopup
            user={userToDelete}
            onClose={() => {
              if (!deleting) {
                setShowDeleteModal(false);
                setUserToDelete(null);
              }
            }}
            onConfirm={handleDeleteUser}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAccessManagement;