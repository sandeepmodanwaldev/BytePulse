import { create } from "zustand";
import axiosInstance from "../libs/axiosInstance";
import { toast } from "sonner";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  solvedProblemsCount: null,
  isProblemsLoading: false,
  isProblemLoading: false,
  accuracy: null,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problem");

      set({ problems: res.data.data });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");

      set({ solvedProblems: res.data.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },

  getAllSolveProblemCount: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem-count");

      set({ solvedProblemsCount: res.data.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },
  getAccuracy: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-accuracy");

      set({ accuracy: res.data.data });
    } catch (error) {
      console.log("Error getting accuracy", error);
      toast.error("Error getting accuracy");
    }
  },
}));
