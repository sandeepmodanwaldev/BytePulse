import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../libs/axiosInstance";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isloggingIn: false,
  isCheckingAuth: false,
  islogoutting: false,
  isForgottingPassword: false,
  isResettingPassword: false,
  isVerifying: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get(`/auth/check`);
      console.log("CheckAuth response", res.data);
      set({ authUser: res.data.data });
    } catch (error) {
      console.log("CheckAuth error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data, nevigate) => {
    console.log("data:", data);

    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post(`/auth/register`, data);
      set({ authUser: res.data });
      toast.success(res.data.message);
      nevigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigninUp: false });
    }
  },
  login: async (data, nevigate) => {
    set({ isloggingIn: true });
    try {
      const res = await axiosInstance.post(`/auth/login`, data);
      console.log("Login response", res.data.data);
      set({ authUser: res.data.data });
      toast.success(res.data.message);
      nevigate("/dashboard");
    } catch (error) {
      console.log("Login error", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isloggingIn: false });
    }
  },
  logout: async (navigate) => {
    try {
      set({ islogoutting: true });
      await axiosInstance.get(`/auth/logout`, {
        withCredentials: true,
      });
      set({ authUser: null });
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      set({ islogoutting: false });
    }
  },
  forgotPassword: async (data) => {
    set({ isForgottingPassword: true });
    try {
      const res = await axiosInstance.post(
        `/auth/request-forgot-password`,
        data
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isForgottingPassword: false });
    }
  },
  resetPassword: async (token, data, nevigate) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post(
        `/auth/forgot-password/${token}`,
        data
      );
      toast.success(res.data.message || "Password reset successful!");
      nevigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      set({ isResettingPassword: false });
    }
  },
  verifyEmail: async (emailVerificationToken, navigate) => {
    console.log("emailVerificationToken", emailVerificationToken);

    set({ isVerifying: true });
    try {
      const res = await axiosInstance.get(
        `/auth/verify/${emailVerificationToken}`
      );
      console.log("Email verification response", res.data);

      toast.success(res.data.message || "Email verified!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    } finally {
      set({ isVerifying: false });
    }
  },
}));
