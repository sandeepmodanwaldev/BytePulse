import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon, Plus } from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import useThemeStore from "../store/useThemeStore";

const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => onDeleteProblem(id);
  const handleCreatePlaylist = async (data) => await createPlaylist(data);
  const handleAddToPlaylist = (id) => {
    setSelectedProblemId(id);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-[99%] mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Problems</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary gap-1 sm:gap-2 btn-sm sm:btn-md text-xs sm:text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Create Playlist</span>
          <span className="xs:hidden">Create</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full border-gray-300 shadow-2xl dark:border-gray-300 dark:bg-[#262d43] dark:text-white text-black bg-white text-sm sm:text-base md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 h-10 sm:h-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered w-full border-gray-300 shadow-2xl dark:border-gray-300 dark:bg-[#262d43] dark:text-white text-black bg-white text-sm sm:text-base md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 h-10 sm:h-12"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">
            <span className="hidden sm:inline">All Difficulties</span>
            <span className="sm:hidden">All Diff</span>
          </option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered w-full border-gray-300 shadow-2xl dark:border-gray-300 dark:bg-[#262d43] dark:text-white text-black bg-white text-sm sm:text-base md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 h-10 sm:h-12 sm:col-span-2 lg:col-span-1"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg sm:rounded-xl shadow bg-white dark:bg-slate-400 border border-gray-200 placeholder:text-gray-500 dark:placeholder:text-white">
        <table className="table table-xs sm:table-sm md:table-md lg:table-lg xl:table-xl text-xs sm:text-sm md:text-base min-w-full">
          <thead className="border-gray-300 shadow-2xl dark:border-gray-300 dark:bg-[#262d43] dark:text-white text-black bg-white text-xs sm:text-sm md:text-base lg:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400">
            <tr>
              <th className="w-16 sm:w-20">
                <span className="hidden sm:inline">Solved</span>
                <span className="sm:hidden">✓</span>
              </th>
              <th className="min-w-[120px] sm:min-w-[150px]">Title</th>
              <th className="hidden md:table-cell min-w-[100px]">Tags</th>
              <th className="min-w-[80px] sm:min-w-[100px]">
                <span className="hidden sm:inline">Difficulty</span>
                <span className="sm:hidden">Diff</span>
              </th>
              <th className="min-w-[100px] sm:min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="border-gray-300 shadow-2xl dark:border-gray-300 dark:bg-[#262d43] dark:text-white text-black bg-white text-xs sm:text-sm md:text-base lg:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400">
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy.some(
                  (user) => user.userId === authUser?.id
                );
                return (
                  <tr
                    key={problem.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-success checkbox-xs sm:checkbox-sm"
                        checked={isSolved}
                        readOnly
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold text-blue-500 hover:underline text-xs sm:text-sm md:text-base truncate block max-w-[100px] sm:max-w-[150px] md:max-w-none"
                        title={problem.title}
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge badge-outline badge-warning text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {problem.tags && problem.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{problem.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge text-white text-xs font-bold ${
                          problem.difficulty === "EASY"
                            ? "badge-success"
                            : problem.difficulty === "MEDIUM"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        <span className="hidden sm:inline">
                          {problem.difficulty}
                        </span>
                        <span className="sm:hidden">
                          {problem.difficulty === "EASY"
                            ? "E"
                            : problem.difficulty === "MEDIUM"
                            ? "M"
                            : "H"}
                        </span>
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        {authUser?.role === "ADMIN" && (
                          <>
                            <button
                              className="btn btn-xs sm:btn-sm btn-error"
                              onClick={() => handleDelete(problem.id)}
                            >
                              <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                            <button
                              className="btn btn-xs sm:btn-sm btn-warning"
                              disabled
                            >
                              <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-xs sm:btn-sm btn-outline"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden md:inline">Save</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-4 sm:py-6 text-sm sm:text-base"
                >
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Tags Display - Only visible on mobile when tags are hidden in table */}
      <div className="md:hidden mt-3">
        {paginatedProblems.map((problem) => (
          <div
            key={`mobile-tags-${problem.id}`}
            className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {problem.title} - Tags:
            </div>
            <div className="flex flex-wrap gap-1">
              {(problem.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="badge badge-outline badge-warning text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-6 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="btn btn-xs sm:btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <span className="hidden sm:inline">Prev</span>
            <span className="sm:hidden">‹</span>
          </button>
          <span className="text-xs sm:text-sm text-gray-600 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-xs sm:btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">›</span>
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1 sm:mt-0">
          {filteredProblems.length} total problems
        </div>
      </div>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsTable;
