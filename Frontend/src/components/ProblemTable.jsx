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
    <div className="w-full max-w-[99%] mx-auto mt-12 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Problems</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full  border-gray-300  shadow-2xl dark:border-gray-300  dark:bg-[#262d43] dark:text-white  text-black bg-white md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered w-full border-gray-300  shadow-2xl dark:border-gray-300  dark:bg-[#262d43] dark:text-white  text-black bg-white md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered w-full border-gray-300  shadow-2xl dark:border-gray-300  dark:bg-[#262d43] dark:text-white  text-black bg-white md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
      <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-slate-400 border border-gray-200 placeholder:text-gray-500 dark:placeholder:text-white">
        <table className="table table-xs  md:table-xl text-sm md:text-base  ">
          <thead className="border-gray-300  shadow-2xl dark:border-gray-300  dark:bg-[#262d43] dark:text-white  text-black bg-white md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 ">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="border-gray-300  shadow-2xl dark:border-gray-300  dark:bg-[#262d43] dark:text-white  text-black bg-white md:text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 ">
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy.some(
                  (user) => user.userId === authUser?.id
                );
                return (
                  <tr key={problem.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-success checkbox-sm"
                        checked={isSolved}
                        readOnly
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold text-blue-500 hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
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
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col md:flex-row gap-2">
                        {authUser?.role === "ADMIN" && (
                          <>
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDelete(problem.id)}
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            <button className="btn btn-sm btn-warning" disabled>
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
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
