import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../libs/axiosInstance";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,
  isRuning: false,
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
      console.log("Submission Response", res.data.data);

      set({ submission: res.data.data });

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
      set({ isRuning: true });
      console.log(
        "Run Only:",
        JSON.stringify({
          source_code,
          language_id,
          stdin,
          expected_outputs,
        })
      );

      const res = await axiosInstance.post("/execute-code/run", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
      });

      console.log("Run Only Response", res.data);

      set({ submission: res.data.data });
      console.log("submission", res.data.data);

      // Store the run result (not submission)
      set({
        runResult: {
          language: res.data.data.language,
          allPassed: res.data.data.allPassed,
          detailResults: res.data.data.detailResults,
        },
      });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error running code", error);
      toast.error("Error running code");
    } finally {
      set({ isRuning: false });
    }
  },
}));
