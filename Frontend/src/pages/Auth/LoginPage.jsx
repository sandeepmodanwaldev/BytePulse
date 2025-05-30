import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import { loginSchema } from "../../schemas/authSchema.js";
import { useAuthStore } from "../../store/useAuthStore.js";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isloggingIn } = useAuthStore();
  const nevigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      await login(data, nevigate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="dark:text-[#EDEDED] bg-white shadow-2xl  dark:bg-gray-900 rounded-lg broder brodar-gray-200 w-96 p-6 ">
        <h2 className="text-3xl font-bold text-center mb-4 text-black dark:text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="dark:text-[#FFFFFF] text-black flex items-center gap-2"
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
              className="dark:text-[#FFFFFF] text-black flex items-center gap-2 "
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full input mt-1 bg-white shadow-2xl  dark:bg-gray-900 rounded-lg border border-gray-500 text-gray-800 dark:text-white placeholder-gray-700 dark:placeholder-gray-300 ${
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isloggingIn}
            className="btn btn-primary w-full"
          >
            {isloggingIn ? (
              <span className="loading loading-spinner text-white"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="text-sm mt-4 text-center dark:text-[#FFFFFF] text-black">
          <Link to="/forgot-password">forgot Password?</Link>
        </p>
        <p className="text-sm text-center dark:text-[#FFFFFF] text-black mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
