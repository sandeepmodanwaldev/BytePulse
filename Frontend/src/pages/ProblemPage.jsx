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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../libs/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import useThemeStore from "../store/useThemeStore";

const ProblemPage = () => {
  console.log(useExecutionStore());

  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting, isRunning, runCodeOnly } =
    useExecutionStore();
  const { theme } = useThemeStore();
  const [vsTheme, setVsTheme] = useState("vs-light"); // default

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
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

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

  const handleRunCode = (e) => {
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

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none ">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-white dark:bg-gray-900 shadow-2xl  rounded-xl border border-gray-200 dark:border-gray-700 p-6  mb-6 font-mono"
                    >
                      <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-indigo-300 mb-2 text-base font-semibold ">
                          Input:
                        </div>
                        <span className="text-black dark:text-white px-4 py-1 rounded-lg font-semibold ">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-indigo-300 mb-2 text-base font-semibold ">
                          Output:
                        </div>
                        <span className="text-black dark:text-white px-4 py-1 rounded-lg font-semibold  ">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-black dark:text-white text-lg font-sem bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
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
                <h3 className="text-xl font-bold mb-4 ">Constraints:</h3>
                <div className="bg-white dark:bg-gray-900 shadow-2xl   border border-gray-200 dark:border-gray-700 p-6 rounded-xl mb-6 ">
                  <span className="text-black dark:text-white px-4 py-1 rounded-lg font-semibold  text-lg bg-gray-100 dark:bg-gray-800 p-4 ">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
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
    <div className="min-h-screen bg-white dark:bg-gray-900 shadow-2xl  rounded-xl border border-gray-200 dark:border-gray-700  max-w-[99%] w-full">
      <nav className="navbar bg-white dark:bg-gray-900 shadow-2xl rounded-t-xl  border border-gray-200 dark:border-gray-700  px-4">
        <div className="flex-1 gap-2">
          <Link
            to={"/dashboard"}
            className="flex items-center gap-2 text-primary"
          >
            <Home className="w-10 h-10" />
            {/* <Home /> */}
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl sm:mt-4 md:mt-6 dark:text-gray-400 text-gray-900">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-8 h-8 text-teal-800" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-8 h-8 text-secondary" />
          </button>
          <select
            className="selec text-gray-900  dark:text-white dark:bg-gray-900 w-40"
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

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-white dark:bg-gray-900 shadow-2xl  rounded-xl border border-gray-200 dark:border-gray-700 ">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered ">
                <button
                  className={`tab gap-2 text-black dark:text-white hover:text-primary ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>
                <button
                  className={`tab gap-2 text-black dark:text-white ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </button>
                <button
                  className={`tab gap-2 text-black dark:text-white ${
                    activeTab === "discussion" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </button>
                <button
                  className={`tab gap-2 text-black dark:text-white ${
                    activeTab === "hints" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </button>
              </div>

              <div className="p-6">
                <h1 className="md:text-4xl texl-xl mb-4 font-bold">
                  {problem.title}
                </h1>
                {renderTabContent()}
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-900 shadow-2xl  rounded-xl border border-gray-200 p-2 dark:border-gray-700  ">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button className="tab tab-active gap-2">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[600px] w-full">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme={vsTheme}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 20,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    padding: { top: 20, bottom: 10 },
                    language: selectedLanguage.toLowerCase(),
                  }}
                />
              </div>

              <div className="p-4 bg-white dark:bg-gray-900 shadow-2xl  rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  {/* <button className="btn btn-success gap-2">Run Code</button> */}
                  <button
                    className="btn btn-primary gap-2"
                    onClick={handleRunCodes}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <Loader className="w-6 h-5 animate-spin text-black" />
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Code
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-primary gap-2"
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <Loader className="w-6 h-5 animate-spin text-black" />
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Submit Solution
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 shadow-2xl  rounded-xl border border-gray-200 dark:border-gray-700 mt-6">
          <div className="card-body">
            {submission ? (
              <Submission submission={submission} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table  w-full bg-white dark:bg-gray-900 shadow-2xl  rounded-xl  dark:border-gray-700 text-black dark:text-white">
                    <thead>
                      <tr>
                        <th className="text-gray-900  dark:text-white ">
                          Input
                        </th>
                        <th className="text-gray-900  dark:text-white">
                          Expected Output
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testCase, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <td className="font-mono text-gray-900  dark:text-white  ">
                            {testCase.input}
                          </td>
                          <td className="font-mono text-gray-900  dark:text-white">
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
