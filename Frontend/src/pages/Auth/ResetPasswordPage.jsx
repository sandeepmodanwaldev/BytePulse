import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema } from "../../schemas/authSchema.js";
import { useAuthStore } from "../../store/useAuthStore.js";

function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, isResettingPassword } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data, navigate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 p-6 rounded-xl shadow-2xl bg-white dark:bg-gray-900 text-white dark:text-[#EDEDED]">
        <h2 className="text-3xl font-bold text-center mb-4 text-black dark:text-white">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-black dark:text-white"
            >
              New Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("newPassword")}
              className={`w-full input mt-1 bg-white shadow-2xl  dark:bg-gray-900 rounded-lg border border-gray-500 text-gray-800 dark:text-white placeholder-gray-700 dark:placeholder-gray-300  ${
                errors.newPassword ? "input-error" : ""
              }`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute top-9 right-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="text-white" />
              ) : (
                <Eye className="text-white" />
              )}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="flex items-center gap-2 text-black dark:text-white"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full input mt-1 bg-white shadow-2xl  dark:bg-gray-900 rounded-lg border border-gray-500 text-gray-800 dark:text-white placeholder-gray-700 dark:placeholder-gray-300  ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              placeholder="Re-enter password"
            />
            <button
              type="button"
              className="absolute top-9 right-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="text-white" />
              ) : (
                <Eye className="text-white" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isResettingPassword}
            className="btn btn-primary w-full"
          >
            {isResettingPassword ? (
              <span className="loading loading-spinner text-white"></span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
