import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading }) => {
  // Helper function to safely parse JSON strings
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  // Helper function to calculate average memory usage
  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <div
            key={submission.id}
            className="card bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-500 hover:shadow-xl transition-shadow rounded-2xl"
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                {/* Left Section: Status and Language */}
                <div className="flex items-center gap-4">
                  {submission.status === "Accepted" ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-error">
                      <XCircle className="w-6 h-6" />
                      <span className="font-semibold">{submission.status}</span>
                    </div>
                  )}
                  <div className=" rounded-2xl px-1 py-0.5 bg-yellow-300 font-inter text-black ">
                    {submission.language}
                  </div>
                </div>

                {/* Right Section: Runtime, Memory, and Date */}
                <div className="flex items-center gap-4 text-base-content/70">
                  <div className="flex items-center gap-1 text-black dark:text-white font-inter">
                    <Clock className="w-4 h-4" />
                    <span>{avgTime.toFixed(3)} s</span>
                  </div>
                  <div className="flex items-center gap-1 text-black dark:text-white font-inter">
                    <Memory className="w-4 h-4" />
                    <span>{avgMemory.toFixed(0)} KB</span>
                  </div>
                  <div className="flex items-center gap-1 text-black dark:text-white font-inter">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
