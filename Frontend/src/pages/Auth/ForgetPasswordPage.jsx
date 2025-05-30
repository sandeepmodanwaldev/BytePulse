import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schemas/authSchema.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

function ForgetPasswordPage() {
  const { forgotPassword, isForgottingPassword } = useAuthStore();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data, navigate);
      setEmailSent(true);
    } catch (error) {
      console.error(error);
      setEmailSent(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-700/20 w-full">
      <div className="w-96 p-6 rounded-xl shadow-2lx bg-white dark:bg-gray-900 text-white dark:text-[#EDEDED]">
        <h2 className="text-3xl font-bold text-center mb-4 text-black dark:text-white">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-black dark:text-white"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full input mt-1 bg-white shadow-2xl  dark:bg-gray-900 rounded-lg border border-gray-500 text-gray-800 dark:text-white placeholder-gray-700 dark:placeholder-gray-300 ${
                errors.email ? "input-error" : ""
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isForgottingPassword}
            className="btn btn-primary w-full"
          >
            {isForgottingPassword ? (
              <span className="loading loading-spinner text-white"></span>
            ) : (
              "Submit"
            )}
          </button>

          {/* Success Message */}
          {emailSent && (
            <p className="text-green-500 text-sm mt-2 text-center">
              Password reset link has been sent to your email.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgetPasswordPage;
