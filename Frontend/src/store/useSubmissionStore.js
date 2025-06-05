import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../libs/axiosInstance";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,
  allsubmission: [],
  submissionAcceptCount: 0,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submission");

      set({ submissions: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );

      set({ allsubmission: res.data.data });
    } catch (error) {
      console.log("Error getting submissions for problem", error);

      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission-count/${problemId}`
      );

      set({ submissionCount: res.data.data });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
  getSubmissionForAllAcceptedProblem: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(
        `/submission/get-submission-count-all-accepted-problem/${problemId}`
      );
      console.log(res);

      set({ submissionAcceptCount: res.data.data });
    } catch (error) {
      console.log("Error fetching all accepted problem", error);
      toast.error("Error fetching all accepted problem");
    } finally {
      set({ isLoading: false });
    }
  },
}));
