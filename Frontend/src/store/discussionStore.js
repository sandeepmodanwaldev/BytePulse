import { create } from "zustand";
import axiosInstance from "../libs/axiosInstance";
import { toast } from "sonner";

export const useDiscussionStore = create((set) => ({
  discussions: [],
  isLoading: false,

  fetchDiscussions: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/discussion/${problemId}`);
      set({ discussions: res.data.discussions });
    } catch (error) {
      toast.error("Failed to load discussions");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createDiscussion: async ({ title, content, problemId }) => {
    try {
      console.log(title, content, problemId);

      await axiosInstance.post("/discussion", { title, content, problemId });
      toast.success("Discussion created successfully");
    } catch (error) {
      toast.error("Failed to create discussion");
      console.error(error);
    }
  },

  createComment: async ({ content, discussionId }) => {
    try {
      await axiosInstance.post("/comment", { content, discussionId });
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    }
  },
  deleteDiscussion: async (discussionId) => {
    try {
      await axiosInstance.delete(`/discussion/delete/${discussionId}`);
      toast.success("Discussion deleted");
    } catch (err) {
      toast.error("Failed to delete discussion");
    }
  },
  deleteComment: async (commentId) => {
    try {
      await axiosInstance.delete(`/comment/delete/${commentId}`);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  },
}));
