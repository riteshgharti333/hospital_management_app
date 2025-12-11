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
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import {
  createStaffAccessThunk,
  toggleStaffAccessThunk, 
  getUsers
  // make sure this thunk exists and accepts payload { userId } or adapt below
} from "../../redux/asyncThunks/authThunks";

const AdminAccessManagement = () => {
  const dispatch = useDispatch();

  // Local UI state
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchRegId, setSearchRegId] = useState("");
  const [regIdSearching, setRegIdSearching] = useState(false);
  const [regIdError, setRegIdError] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "admin", "doctor", "nurse"
  const [page, setPage] = useState(1);
  const [limit] = useState(25); // keep fixed or expose UI later

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // Redux state
  const {
    status,
    all = { users: [], total: 0 },
    admin = { count: 0, users: [] },
    doctor = { count: 0, users: [] },
    nurse = { count: 0, users: [] },
    totalUsers = 0,
    activeAccess = 0,
    deniedAccess = 0,
  } = useSelector((s) => s.auth || {});

  // Map role filter value to API role (when needed)
  const roleParam = useMemo(() => {
    if (filter === "all") return undefined;
    if (filter === "admin") return "ADMIN";
    if (filter === "doctor") return "DOCTOR";
    if (filter === "nurse") return "NURSE";
    return undefined;
  }, [filter]);

  // Fetch users when component mounts or filter/page changes
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, limit]);

  const fetchUsers = async () => {
    try {
      await dispatch(getUsers({ role: roleParam, page, limit }));
    } catch (err) {
      // createAsyncThunk returns errors via rejected action; you can show toast if needed
      console.error("Failed to fetch users", err);
    }
  };

  // Local derived users list (apply client-side search on top of server-provided list)
  // Keep UI quick by filtering current page results only. If you want server-side search, add it to the thunk.
  const users = all.users || [];

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (user.name || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.regId || "").toLowerCase().includes(q) ||
      (user.role || "").toLowerCase().includes(q)
    );
  });

  // Counts come from grouped buckets (server) when available, fallback to client counts
  const counts = {
    all: totalUsers || (users && users.length) || 0,
    admin: admin.count ?? 0,
    doctor: doctor.count ?? 0,
    nurse: nurse.count ?? 0,
  };

  // Toggle user access (calls toggle thunk then refetches)
  const toggleUserAccess = async (user) => {
    // Optimistic UI note: we don't update local UI here; we refetch after action to ensure consistency.
    try {
      // If your toggleStaffAccessThunk expects a different payload (e.g., regId or enable flag),
      // adapt the payload accordingly. Example alternatives:
      // dispatch(toggleStaffAccessThunk({ regId: user.regId, enable: user.isActive ? false : true }))
      await dispatch(toggleStaffAccessThunk({ userId: user.id })); // adjust payload if needed
      toast.success(
        `Access ${user.access === "active" ? "revoked" : "granted"} for ${user.name}`
      );
      // refetch current page
      fetchUsers();
    } catch (err) {
      toast.error("Failed to toggle access");
    }
  };

  // Add/Edit user handler - calls server or local fallback
  const onAddUser = async (data) => {
    setLoadingLocal(true);
    try {
      // If you have createStaffAccessThunk, call it here; otherwise, fallback to local mock behavior.
      // Example (if your thunk expects payload): await dispatch(createStaffAccessThunk(data));
      // After server call, refetch:
      // await dispatch(getUsers({ role: roleParam, page, limit }));

      // For now, simple optimistic local behavior (so UI remains functional until you wire backend):
      if (editingUser) {
        // call your update endpoint or thunk (not included in snippets), else update locally
        // dispatch(updateUserThunk({ ...data, id: editingUser.id }))
        toast.success("User updated (local only). Wire update thunk to persist to backend.");
      } else {
        // create on server with createStaffAccessThunk OR add local fallback
        toast.success("User registered (local only). Wire createStaffAccessThunk to persist.");
      }

      // Reset UI
      reset();
      setShowRegistration(false);
      setEditingUser(null);
      setSearchRegId("");
    } catch (error) {
      toast.error("Failed to save user. Please try again.");
    } finally {
      setLoadingLocal(false);
    }
  };

  // Edit user -> populate form
  const onEditUser = (user) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("regId", user.regId);
    setValue("role", user.role);
    setShowRegistration(true);
  };

  // Delete user (call your delete thunk here if you have one)
  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}? This action cannot be undone.`)) return;
    try {
      // dispatch(deleteUserThunk({ userId }))  // wire this thunk if exists
      toast.success("User deleted (local only). Wire delete thunk to persist.");
      // after delete refetch page:
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Registered ID search auto-fill (keeps your previous mock behavior)
  const handleRegIdSearch = async (value) => {
    setSearchRegId(value);
    if (value.length >= 3) {
      setRegIdSearching(true);
      setRegIdError("");
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockUserData = {
        MED001: { name: "Dr. John Smith", email: "john.smith@medicare.com", role: "Doctor" },
        MED002: { name: "Dr. Sarah Johnson", email: "sarah.j@medicare.com", role: "Doctor" },
        MED003: { name: "Dr. Michael Brown", email: "michael.b@medicare.com", role: "Doctor" },
        NUR001: { name: "Nurse Emily Wilson", email: "emily.w@medicare.com", role: "Nurse" },
        ADM001: { name: "Admin Alex Johnson", email: "admin.alex@medicare.com", role: "Admin" },
      };
      if (mockUserData[value]) {
        const user = mockUserData[value];
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("role", user.role);
        setValue("regId", value);
        toast.success(`Found user: ${user.name}`);
      } else {
        setRegIdError("No registered user found with this ID");
      }
      setRegIdSearching(false);
    }
  };

  // FilterButton component kept as-is
  const FilterButton = ({ label, value, count, icon: Icon }) => {
    const isActive = filter === value;
    return (
      <button
        onClick={() => {
          setFilter(value);
          setPage(1); // reset to first page when filter changes
        }}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      >
        {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />}
        <span className="font-medium">{label}</span>
        <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Management</h1>
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
                  <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    <MdClear />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setEditingUser(null);
                  reset();
                  setShowRegistration(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
              <h3 className="text-sm font-medium text-gray-700">Filter by Role:</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <FilterButton label="All Users" value="all" count={counts.all} />
              <FilterButton label="Admins" value="admin" count={counts.admin} icon={MdAdminPanelSettings} />
              <FilterButton label="Doctors" value="doctor" count={counts.doctor} icon={MdLocalHospital} />
              <FilterButton label="Nurses" value="nurse" count={counts.nurse} icon={MdPerson} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{counts.all}</p>
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
                  <p className="text-2xl font-bold text-gray-800">{activeAccess}</p>
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
                  <p className="text-2xl font-bold text-gray-800">{deniedAccess}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <MdCancel className="text-red-500 text-xl" />
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
                    <span className="ml-2 text-blue-600">• Filtered by: {filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                  )}
                </h3>
              </div>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")} className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 md:mt-0">
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Table Column Headers */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                  {/* User Info */}
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${user.avatarColor || "from-gray-400 to-gray-500"} flex items-center justify-center`}>
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
                  <div className="col-span-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "Doctor" ? "bg-blue-100 text-blue-800" : user.role === "Nurse" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.access === "active" ? "bg-green-500" : "bg-red-500"}`} />
                      <span className={`text-sm font-medium ${user.access === "active" ? "text-green-600" : "text-red-600"}`}>
                        {user.access === "active" ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{user.lastActive || "—"}</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => toggleUserAccess(user)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${user.access === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                    >
                      {user.access === "active" ? (
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

                    <button onClick={() => onEditUser(user)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                      <MdEdit className="w-4 h-4" />
                    </button>

                    <button onClick={() => deleteUser(user.id, user.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MdPerson className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No users found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No users match "${searchTerm}"` : `No ${filter === "all" ? "" : filter + " "}users available`}
              </p>
              <div className="flex justify-center space-x-3">
                {searchTerm && <button onClick={() => setSearchTerm("")} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Clear search</button>}
                {filter !== "all" && <button onClick={() => setFilter("all")} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Show all users</button>}
              </div>
            </div>
          )}
        </div>

        {/* Pagination (simple) */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} · {counts.all} total
          </div>
          <div className="space-x-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-white border rounded">Prev</button>
            <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-white border rounded">Next</button>
          </div>
        </div>
      </div>

      {/* Registration/Edit Modal */}
      <AnimatePresence>
        {showRegistration && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRegistration(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                {/* Modal Header */}
                <div className="border-b border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {editingUser ? <MdEdit className="text-blue-500 text-xl" /> : <MdPersonAdd className="text-blue-500 text-xl" />}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{editingUser ? "Edit User" : "Register New User"}</h2>
                        <p className="text-gray-600 text-sm">Fill in the user details below</p>
                      </div>
                    </div>
                    <button onClick={() => setShowRegistration(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                      <MdClear className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="p-5">
                  <form onSubmit={handleSubmit(onAddUser)}>
                    {/* Registered ID Search Section */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-blue-800">Registered ID Lookup</label>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Optional</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdSearch className="text-blue-500" />
                        </div>
                        <input type="text" placeholder="Search by Registration ID (e.g., MED001, NUR001, ADM001)" className="w-full pl-10 pr-24 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white" value={searchRegId} onChange={(e) => handleRegIdSearch(e.target.value)} />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-xs text-gray-500">Auto-fill details</span>
                        </div>
                      </div>
                      {regIdSearching && <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> <span>Searching...</span></div>}
                      {regIdError && <p className="mt-2 text-sm text-red-600">{regIdError}</p>}
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500 ml-1">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MdPerson className="text-gray-400" /></div>
                          <input type="text" placeholder="Enter full name" {...register("name", { required: "Full name is required", minLength: { value: 3, message: "Minimum 3 characters" } })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>
                        {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500 ml-1">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MdEmail className="text-gray-400" /></div>
                          <input type="email" placeholder="user@medicare.com" {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email format" } })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>
                        {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration ID <span className="text-red-500 ml-1">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MdBadge className="text-gray-400" /></div>
                          <input type="text" placeholder="e.g., MED001, NUR001, or ADM001" {...register("regId", { required: "Registration ID is required", pattern: { value: /^[A-Za-z0-9]+$/, message: "Only letters and numbers" } })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>
                        {errors.regId && <p className="text-red-600 text-xs mt-1.5">{errors.regId.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role <span className="text-red-500 ml-1">*</span></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MdPerson className="text-gray-400" /></div>
                          <select {...register("role", { required: "Role is required" })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white">
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Nurse">Nurse</option>
                          </select>
                        </div>
                        {errors.role && <p className="text-red-600 text-xs mt-1.5">{errors.role.message}</p>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-5 border-t border-gray-200">
                      <button type="button" onClick={() => { setShowRegistration(false); reset(); setEditingUser(null); setSearchRegId(""); }} className="flex-1 py-3 px-4 border border-gray-300 hover:border-gray-400 rounded-lg font-medium text-gray-700 hover:text-gray-900 transition-colors">Cancel</button>

                      <button type="submit" disabled={loadingLocal} className={`flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors flex items-center justify-center space-x-2 ${loadingLocal ? "opacity-80 cursor-not-allowed" : ""}`}>
                        {loadingLocal ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : editingUser ? (
                          <>
                            <MdEdit className="w-4 h-4" />
                            <span>Update User</span>
                          </>
                        ) : (
                          <>
                            <MdPersonAdd className="w-4 h-4" />
                            <span>Register User</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAccessManagement;
