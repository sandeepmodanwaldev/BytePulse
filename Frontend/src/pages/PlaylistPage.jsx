import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { toast } from "sonner";

function PlaylistDetailsPage() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const {
    currentPlaylist,
    getPlaylistDetails,
    removeProblemFromPlaylist,
    isLoading,
  } = usePlaylistStore();

  useEffect(() => {
    if (playlistId) {
      getPlaylistDetails(playlistId);
    }
  }, [playlistId, getPlaylistDetails]);

  const handleRemoveProblem = async (problemId) => {
    await removeProblemFromPlaylist(playlistId, problemId);
    toast.success("Problem removed from playlist");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>Loading playlist details...</p>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        <p>Playlist not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">{currentPlaylist.name}</h2>
      <p className="mb-2 text-lg">{currentPlaylist.description}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-inter">
        Created at: {new Date(currentPlaylist.createdAt).toLocaleDateString()}
      </p>

      <h3 className="text-2xl font-semibold mb-4 font-inter">
        Problems ({currentPlaylist.problems.length})
      </h3>

      {currentPlaylist.problems.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 font-inter">
          No problems in this playlist.
        </p>
      ) : (
        <div className="space-y-4">
          {currentPlaylist.problems.map((p) => (
            <div
              key={p.problem.id}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg font-bold">{p.problem.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Difficulty: {p.problem.difficulty}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/problem/${p.problem.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleRemoveProblem(p.problem.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistDetailsPage;
