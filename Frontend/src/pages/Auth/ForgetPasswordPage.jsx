import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schemas/authSchema.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
function ForgetPasswordPage() {
  const { forgotPassword, isForgottingPassword } = useAuthStore();
  const nevigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });
  const onSubmit = async (data) => {
    try {
      await forgotPassword(data, nevigate);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-[#0f0f1a] w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-white flex items-center gap-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full input mt-1 ${
                errors.email ? "input-error" : ""
              }`}
              placeholder="Enter email"
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
            disabled={isForgottingPassword || !isValid}
            className="btn btn-primary w-full"
          >
            {isForgottingPassword ? (
              <span className="loading loading-spinner text-white"></span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPasswordPage;
