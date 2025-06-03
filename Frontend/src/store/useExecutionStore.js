import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../libs/axiosInstance";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,
  isRunning: false,
  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      set({ isExecuting: true });

      const res = await axiosInstance.post("/execute-code/submit", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });
      console.log("Submission Response", res.data);

      set({ submission: res.data.data });
      console.log("Submission Response save wala", res.data.data);

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set({ isExecuting: false });
    }
  },
  runCodeOnly: async (source_code, language_id, stdin, expected_outputs) => {
    try {
      set({ isRunning: true });

      const res = await axiosInstance.post("/execute-code/run", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
      });

      set({ submission: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error running code", error);
      toast.error("Error running code");
    } finally {
      set({ isRunning: false });
    }
  },
}));
