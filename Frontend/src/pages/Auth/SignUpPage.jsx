import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import { signupSchema } from "../../schemas/authSchema.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { toast } from "sonner";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isSigninUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await signup(data, navigate);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-[#0f0f1a] w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="text-white flex items-center gap-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`w-full input mt-1 ${
                errors.username ? "input-error" : ""
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

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
              {...register("password")}
              className={`w-full input mt-1 pl-3 ${
                errors.password ? "input-error" : ""
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
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
            disabled={isSigninUp || !isValid}
            className="btn btn-primary w-full"
          >
            {isSigninUp ? (
              <span className="loading loading-spinner text-white"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-white mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
