import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../libs/axiosInstance";

export const useActions = create((set) => ({
  isDeletingProblem: false,

  onDeleteProblem: async (id) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/problems/detele-problem/${id}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error("Error deleting problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },
}));
