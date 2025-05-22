import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema } from "../../schemas/authSchema.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useParams } from "react-router-dom";

function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, isResettingPassword } = useAuthStore();
  const nevigate = useNavigate();
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data, nevigate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-[#0f0f1a] w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="text-white flex items-center gap-2"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("newPassword")}
              className={`w-full input mt-1 pl-3 ${
                errors.newPassword ? "input-error" : ""
              }`}
              placeholder="Enter password"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
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
              className="text-white flex items-center gap-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full input mt-1 pl-3 ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              placeholder="Re-enter password"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
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
            disabled={isResettingPassword || !isValid}
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
