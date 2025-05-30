import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema } from "../../schemas/authSchema.js";
import { useAuthStore } from "../../store/useAuthStore.js";

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
    mode: "onSubmit",
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
      <div className="dark:text-[#EDEDED] bg-white shadow-2xl  dark:bg-gray-900 w-96 md:w-120  p-6 rounded-xl ">
        <h2 className="text-3xl font-bold text-center mb-2 dark:text-white text-black">
          Sign Up
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm text-center mb-4">
          Join us and start your journey today
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="dark:text-white text-black flex items-center gap-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`w-full input mt-1 bg-white shadow-2xl  dark:bg-gray-900 rounded-lg border border-gray-500 text-gray-800 dark:text-white placeholder-gray-700 dark:placeholder-gray-300  ${
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
              className="dark:text-white text-black flex items-center gap-2"
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
              className="dark:text-white text-black flex items-center gap-2"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full input mt-1 bg-white shadow-2xl  dark:bg-gray-900 rounded-lg border border-gray-500 text-gray-800 dark:text-white placeholder-gray-700 dark:placeholder-gray-300  ${
                errors.password ? "input-error" : ""
              }`}
              placeholder="Enter password"
            />
            <button
              type="button"
              className="absolute top-9 right-3 dark:text-white text-black"
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
              className="dark:text-white text-black flex items-center gap-2"
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
              className="absolute top-9 right-3 dark:text-white text-black"
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
            disabled={isSigninUp}
            className="btn btn-primary w-full"
          >
            {isSigninUp ? (
              <span className="loading loading-spinner text-white"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-sm text-center dark:text-white text-black mt-4">
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
