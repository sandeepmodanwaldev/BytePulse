import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../libs/axiosInstance";

export const useAuthStore = create((set) => ({
  authUser: null,
  profile: null,
  isSigninUp: false,
  isloggingIn: false,
  isCheckingAuth: true,
  islogoutting: false,
  isForgottingPassword: false,
  isResettingPassword: false,
  isVerifying: false,
  isLoadingProfile: false,
  profileError: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get(`/auth/check`);

      set({ authUser: res.data.data });
    } catch (error) {
      console.log("CheckAuth error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  fetchProfile: async () => {
    set({ isLoadingProfile: true, profileError: null });
    try {
      // Agar aapka backend me /auth/profile hai to use karo, warna /auth/check bhi ho sakta hai
      const res = await axiosInstance.get(`/auth/profile`);
      set({ profile: res.data.data, isLoadingProfile: false });
    } catch (error) {
      set({
        profileError: error.response?.data?.message || error.message,
        isLoadingProfile: false,
      });
      throw error;
    }
  },

  signup: async (data, nevigate) => {
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
      set({ authUser: res.data.data });
      toast.success(res.data.message);
      nevigate("/dashboard");
    } catch (error) {
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
      set({ authUser: null, profile: null });
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
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
    set({ isVerifying: true });
    try {
      const res = await axiosInstance.get(
        `/auth/verify/${emailVerificationToken}`
      );
      toast.success(res.data.message || "Email verified!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    } finally {
      set({ isVerifying: false });
    }
  },
}));
