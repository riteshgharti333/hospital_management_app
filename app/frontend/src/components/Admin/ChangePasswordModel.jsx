import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordSchema } from "@hospital/schemas";
import { useState } from "react";
import { changePasswordThunk } from "../../redux/asyncThunks/authThunks";
import { toast } from "sonner";

const ChangePasswordModel = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (key) =>
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(changePasswordThunk(data)).unwrap();

      // ✅ use backend message
      toast.success(res?.message || "Password updated");

      reset();
    } catch (err) {
      // ✅ err is already rejectWithValue payload
      toast.error(
        typeof err === "string" ? err : err?.message || "Something went wrong"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* CURRENT PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPasswords.current ? "text" : "password"}
              {...register("currentPassword")}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg ${
                errors.currentPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.current ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPasswords.new ? "text" : "password"}
              {...register("newPassword")}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.new ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPasswords.confirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.confirm ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 bg-blue-600 cursor-pointer text-white rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordModel;
