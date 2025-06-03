import React, { useState, useEffect, use } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  ArrowLeft,
  Loader2,
  Loader,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../libs/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import useThemeStore from "../store/useThemeStore";
import PerformanceChart from "../components/PerformanceChart";
import { toast } from "sonner";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
    allsubmission,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");

  const [testcases, setTestCases] = useState([]);
  const [time, setTime] = useState([]);
  const [memory, setMemory] = useState([]);

  const { executeCode, submission, isExecuting, isRunning, runCodeOnly } =
    useExecutionStore();

  const { theme } = useThemeStore();
  const [vsTheme, setVsTheme] = useState("vs-light"); // default

  const passedTests = submission?.testcases.filter((tc) => tc.passed).length;

  const totalTests = submission?.testcases.length;
  const successRate = (passedTests / totalTests) * 100;

  const location = useLocation();
  const handleShare = async () => {
    try {
      const url = window.location.origin + location.pathname;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      setVsTheme("vs-dark");
    } else {
      setVsTheme("vs-light");
    }
  }, [theme]);

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    getSubmissionForProblem(id);
  }, [id]);

  useEffect(() => {
    const hasAccepted = allsubmission.some((sub) => sub.status === "Accepted");
    const seen = new Set();
    let firstAcceptedSource = null;

    if (hasAccepted) {
      for (const sub of allsubmission) {
        const code = sub.sourceCode.trim();
        if (!seen.has(code) && sub.language === selectedLanguage) {
          firstAcceptedSource = code;
          break;
        }
        seen.add(code);
      }
    }

    if (problem) {
      setCode(
        hasAccepted && firstAcceptedSource
          ? firstAcceptedSource
          : problem.codeSnippets?.[selectedLanguage] || ""
      );

      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
      if (submission?.testcases) {
        setTime(JSON.parse(submission?.time || []));
        setMemory(JSON.parse(submission?.memory || []));
      }
    }
  }, [problem, selectedLanguage, submission, allsubmission]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };
  const handleRunCodes = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      runCodeOnly(code, language_id, stdin, expected_outputs);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };
  const isProblemSolved = submission?.testcases?.every(
    (tc) => tc.passed === true
  );

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-4 sm:p-6 md:p-8 shadow-xl items-center">
          <span className="loading loading-spinner loading-sm sm:loading-md md:loading-lg text-primary"></span>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-base-content/70">
            Loading problem...
          </p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <h1 className="text-lg font-lexend ml-6 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl  font-bold">
              {problem.title}
            </h1>
            <div className="p-2 sm:p-4 md:p-6">
              {isProblemSolved === true ? (
                <PerformanceChart times={time} memory={memory} />
              ) : (
                <>
                  <p className="text-sm font-inter sm:text-base md:text-lg mb-4 sm:mb-3">
                    {problem.description}
                  </p>

                  {problem.examples && (
                    <>
                      <h3 className="text-base font-inter sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">
                        Examples:
                      </h3>
                      {Object.entries(problem.examples).map(
                        ([lang, example]) => (
                          <div
                            key={lang}
                            className="bg-white  font-inter dark:bg-gray-900 shadow-2xl rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 "
                          >
                            <div className="mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg">
                              <div className="text-indigo-300 mb-1 sm:mb-2 text-sm sm:text-base font-semibold">
                                Input:
                              </div>
                              <span className="text-black dark:text-white px-2 sm:px-4 py-1 rounded-lg font-semibold text-xs sm:text-sm md:text-base">
                                {example.input}
                              </span>
                            </div>
                            <div className="mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg">
                              <div className="text-indigo-300 mb-1 sm:mb-2 text-sm sm:text-base font-semibold">
                                Output:
                              </div>
                              <span className="text-black dark:text-white px-2 sm:px-4 py-1 rounded-lg font-semibold text-xs sm:text-sm md:text-base">
                                {example.output}
                              </span>
                            </div>
                            {example.explanation && (
                              <div>
                                <div className="text-emerald-300 font-inter mb-1 sm:mb-2 text-sm sm:text-base font-semibold">
                                  Explanation:
                                </div>
                                <p className="text-black font-inter dark:text-white text-sm sm:text-base md:text-lg font-sem bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg">
                                  {example.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </>
                  )}

                  {problem.constraints && (
                    <>
                      <h3 className="text-base font-inter sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">
                        Constraints:
                      </h3>
                      <div className="bg-white font-inter dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-3 sm:mb-4 md:mb-6">
                        <span className="text-black dark:text-white px-2 sm:px-4 py-1 rounded-lg font-semibold text-sm sm:text-base md:text-lg bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 md:p-4">
                          {problem.constraints}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case "submissions":
        return (
          <SubmissionsList
            submissions={allsubmission}
            isLoading={isSubmissionsLoading}
          />
        );

      case "discussion":
        return (
          <div className="p-4 font-lexend   text-center text-base-content/70 text-sm sm:text-base">
            No discussions yet
          </div>
        );

      case "hints":
        return (
          <div className="p-2 sm:p-4">
            {problem?.hints ? (
              <div className="bg-base-200 font-lexend p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
                <span className=" px-2 sm:px-4 py-1 rounded-lg font-semibold text-white text-sm sm:text-base md:text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="font-inter text-center text-base-content/70 text-sm sm:text-base">
                No hints available
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 shadow-2xl rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 max-w-[99%] w-full">
      <nav className="navbar bg-white dark:bg-gray-900 shadow-2xl rounded-t-lg sm:rounded-t-xl border border-gray-200 dark:border-gray-700 px-2 sm:px-4">
        <div className="flex-1 gap-1 sm:gap-2">
          <Link
            to={"/dashboard"}
            className="flex items-center gap-1 sm:gap-2 text-primary text-sm sm:text-base"
          >
            <ChevronLeft className="w-3 h-3 sm:w-3 sm:h-3" />
            <span className="hidde font-inter">Back</span>
          </Link>
          <div className="mt-1 sm:mt-2">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl dark:text-gray-400 text-gray-900 flex-wrap">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap font-inter">
                Updated{" "}
                <span className="hidden sm:inline font-inter">
                  {new Date(problem.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="sm:hidden font-inter">
                  {new Date(problem.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
              <span className="text-base-content/30 hidden sm:inline font-inter">
                •
              </span>
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap font-inter">
                {submissionCount}{" "}
                <span className="hidden sm:inline">Submissions</span>
                <span className="sm:hidden">Sub</span>
              </span>
              <span className="text-base-content/30 hidden md:inline font-inter">
                •
              </span>
              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden md:inline" />
              <span className="whitespace-nowrap hidden md:inline">
                {successRate || 0}% Success Rate
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-1 sm:gap-2 font-inter">
          <button
            onClick={handleShare}
            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
          >
            <Share2 className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-500" />
          </button>
          <select
            className="text-gray-900 font-inter dark:text-white dark:bg-gray-800 w-24 sm:w-32 md:w-40 rounded-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm md:text-base px-1 sm:px-2"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="container mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="card bg-white dark:bg-gray-900 shadow-2xl rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="card-body p-0">
              <div className="border-b border-gray-300 dark:border-gray-700 flex space-x-2 sm:space-x-4 overflow-x-auto">
                <button
                  className={`py-2 px-2 sm:px-4 flex items-center gap-1 sm:gap-2 transition-colors duration-200 hover:text-primary text-xs sm:text-sm md:text-base whitespace-nowrap ${
                    activeTab === "description"
                      ? "tab-active text-primary font-inter"
                      : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-inter">
                    Description
                  </span>
                  <span className="sm:hidden font-inter">Desc</span>
                </button>
                <button
                  className={`py-2 px-2 sm:px-4 flex items-center gap-1 sm:gap-2 transition-colors duration-200 hover:text-primary text-xs sm:text-sm md:text-base whitespace-nowrap ${
                    activeTab === "submissions"
                      ? "tab-active text-primary font-inter"
                      : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-inter">
                    Submissions
                  </span>
                  <span className="sm:hidden font-inter">Sub</span>
                </button>
                <button
                  className={`py-2 px-2 sm:px-4 flex items-center gap-1 sm:gap-2 transition-colors duration-200 hover:text-primary text-xs sm:text-sm md:text-base whitespace-nowrap ${
                    activeTab === "discussion"
                      ? "tab-active text-primary font-inter"
                      : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-inter">
                    Discussion
                  </span>
                  <span className="sm:hidden font-inter">Disc</span>
                </button>
                <button
                  className={`py-2 px-2 font-inter sm:px-4 flex items-center gap-1 sm:gap-2 transition-colors duration-200 hover:text-primary text-xs sm:text-sm md:text-base whitespace-nowrap ${
                    activeTab === "hints"
                      ? "tab-active text-primary font-inter"
                      : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 font-inter" />
                  Hints
                </button>
              </div>

              <div className="p-3 sm:p-4 md:p-6">{renderTabContent()}</div>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-900 shadow-2xl rounded-lg sm:rounded-xl border border-gray-200 p-1 sm:p-2 dark:border-gray-700">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button className="tab tab-active gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                  <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-inter">
                    Code Editor
                  </span>
                  <span className="sm:hidden font-inter">Editor</span>
                </button>
              </div>

              <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme={vsTheme}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: window.innerWidth > 768 },
                    fontSize:
                      window.innerWidth < 640
                        ? 12
                        : window.innerWidth < 768
                        ? 14
                        : window.innerWidth < 1024
                        ? 16
                        : 18,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    padding: {
                      top:
                        window.innerWidth < 640
                          ? 10
                          : window.innerWidth < 768
                          ? 15
                          : 20,
                      bottom: window.innerWidth < 640 ? 5 : 10,
                    },
                    language: selectedLanguage.toLowerCase(),
                    wordWrap: window.innerWidth < 768 ? "on" : "off",
                  }}
                />
              </div>

              <div className="p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-900 shadow-2xl rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                  <button
                    className="btn btn-primary font-inter gap-1 sm:gap-2 btn-sm sm:btn-md w-full sm:w-auto text-xs sm:text-sm"
                    onClick={handleRunCodes}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <Loader className="w-3 font-inter h-3 sm:w-4 sm:h-4 md:w-6 md:h-5 animate-spin text-black" />
                    ) : (
                      <>
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline font-inter">
                          Run Code
                        </span>
                        <span className="xs:hidden font-inter">Run</span>
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-primary gap-1 sm:gap-2 btn-sm sm:btn-md w-full sm:w-auto text-xs sm:text-sm"
                    onClick={handleSubmitCode}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <Loader className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-5 animate-spin text-black" />
                    ) : (
                      <>
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline font-inter">
                          Submit Solution
                        </span>
                        <span className="xs:hidden font-inter">Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 shadow-2xl rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 mt-3 sm:mt-4 md:mt-6">
          <div className="card-body p-3 sm:p-4 md:p-6">
            {submission ? (
              <Submission submission={submission} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                    Test Cases
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table w-full bg-white dark:bg-gray-900 shadow-2xl rounded-lg sm:rounded-xl dark:border-gray-700 text-black dark:text-white text-xs sm:text-sm md:text-base">
                    <thead>
                      <tr>
                        <th className="text-gray-900 font-playpen dark:text-white text-xs sm:text-sm md:text-base">
                          Input
                        </th>
                        <th className="text-gray-900 font-playpen dark:text-white text-xs sm:text-sm md:text-base">
                          Expected Output
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testCase, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 font-inter dark:hover:bg-gray-800"
                        >
                          <td className="font-inter text-gray-900 dark:text-white text-xs sm:text-sm md:text-base break-all">
                            {testCase.input}
                          </td>
                          <td className="font-inter text-gray-900 dark:text-white text-xs sm:text-sm md:text-base break-all">
                            {testCase.output}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
