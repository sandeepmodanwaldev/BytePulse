import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const SubmissionResults = ({ submission }) => {
  // Parse stringified arrays
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m) => parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t) => parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = submission.testcases.filter((tc) => tc.passed).length;

  const totalTests = submission.testcases.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700  shadow-2xl rounded-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm font-inter">Status</h3>
            <div
              className={`text-lg font-bold font-inter ${
                submission.status === "Accepted" ? "text-success" : "text-error"
              }`}
            >
              {submission.status}
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700  shadow-2xl rounded-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm font-inter">Success Rate</h3>
            <div className="text-lg font-bold font-inter">
              {successRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700  shadow-2xl rounded-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2 font-inter">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold font-inter">
              {avgTime.toFixed(3)} s
            </div>
          </div>
        </div>

        <div className="card bbg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700  shadow-2xl rounded-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2 font-inter">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold font-inter">
              {avgMemory.toFixed(0)} KB
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700  shadow-2xl rounded-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 font-playpen text-center">
            Test Cases Results
          </h2>
          <div className="overflow-x-auto">
            <table className="table border-b-[1px] w-full font-inter">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testcases.map((testCase) => (
                  <tr key={testCase.id}>
                    <td className="border-b-[1px] border-gray-200 dark:border-gray-500">
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-error">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono border-b-[1px] border-gray-200 dark:border-gray-500">
                      {testCase.expected}
                    </td>
                    <td className="font-mono border-b-[1px] border-gray-200 dark:border-gray-500">
                      {testCase.stdout || "null"}
                    </td>
                    <td className="border-b-[1px] border-gray-200 dark:border-gray-500">
                      {testCase.memory}
                    </td>
                    <td className="border-b-[1px] border-gray-200 dark:border-gray-500">
                      {testCase.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
