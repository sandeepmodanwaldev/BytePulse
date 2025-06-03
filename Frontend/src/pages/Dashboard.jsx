import React, { useEffect } from "react";
import ProblemTable from "../components/ProblemTable";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useAuthStore } from "../store/useAuthStore";
const Dashboard = () => {
  const name = useAuthStore.getState().authUser?.name || "Coder";

  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const {
    getAllSolveProblemCount,
    solvedProblemsCount,
    accuracy,
    getAccuracy,
  } = useProblemStore();
  const { getPlaylistCount, playlistCount } = usePlaylistStore();

  useEffect(() => {
    getPlaylistCount();
    getAllProblems();
    getAllSolveProblemCount();
    getAccuracy();
  }, [getAllProblems, getPlaylistCount, getAllSolveProblemCount, getAccuracy]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div className="p-6 md:p-10 space-y-10">
        {/* Welcome Banner */}
        <div className="bg-white shadow-2xl  dark:bg-gray-900 rounded-lg broder brodar-gray-200 p-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {name}! 👋</h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Ready to level up your coding skills? Let's tackle some challenges.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-white shadow-2xl  dark:bg-gray-900 rounded-lg broder brodar-gray-200">
            <div className="card-body">
              <h2 className="text-sm text-gray-500">Problems Solved</h2>
              <p className="text-3xl font-bold text-primary">
                {solvedProblemsCount?.count || 0}
              </p>
            </div>
          </div>
          <div className="card bg-white shadow-2xl  dark:bg-gray-900 rounded-lg broder brodar-gray-200">
            <div className="card-body">
              <h2 className="text-sm text-gray-500">Current Streak</h2>
              <p className="text-3xl font-bold text-success">7 Days</p>
            </div>
          </div>
          <div className="card bg-white shadow-2xl  dark:bg-gray-900 rounded-lg broder brodar-gray-200">
            <div className="card-body">
              <h2 className="text-sm text-gray-500">Accuracy</h2>
              <p className="text-3xl font-bold text-warning">
                {accuracy?.accuracy || 0}
              </p>
            </div>
          </div>
          <div className="card bg-white shadow-2xl  dark:bg-gray-900 rounded-lg broder brodar-gray-200">
            <div className="card-body">
              <h2 className="text-sm text-gray-500">Playlist</h2>
              <p className="text-3xl font-bold text-info">
                {playlistCount || 0}
              </p>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center mt-14 px-4 card  bg-white dark:bg-gray-900 broder border-gray-300  shadow-2xl  p-4 md:p-6 ">
          {problems.length > 0 ? (
            <ProblemTable problems={problems} />
          ) : (
            <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
              No problems found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
