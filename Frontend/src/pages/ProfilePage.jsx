import React, { useRef, useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useSubmissionStore } from "../store/useSubmissionStore.js";
import { useProblemStore } from "../store/useProblemStore.js";
import { usePlaylistStore } from "../store/usePlaylistStore.js";
import { Editor } from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function ProfilePage() {
  const {
    profile,
    fetchProfile,
    isLoadingProfile,
    profileError,
    uploadAvatar,
    isUploadingAvatar,
  } = useAuthStore();

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const { submissions, submissionCount, getAllSubmissions, isLoading } =
    useSubmissionStore();

  const {
    getAllSolveProblemCount,
    solvedProblemsCount,
    accuracy,
    getAccuracy,
  } = useProblemStore();

  const { playlists, getAllPlaylists, deletePlaylist } = usePlaylistStore();

  useEffect(() => {
    fetchProfile();
    getAllSubmissions();
    getAllSolveProblemCount();
    getAccuracy();
    getAllPlaylists();
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image");
    await uploadAvatar(file);
    setFile(null);
    setPreview(null);
  };

  if (isLoadingProfile || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        <p>{profileError}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="m-4 md:m-10 p-8 dark:border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 dark:text-white shadow-md">
      <h1 className="text-center text-xl md:text-3xl mb-8 font-bold font-inter">
        Your Profile Section
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col items-center relative">
          <div
            onClick={handleClick}
            className="relative w-32 h-32 rounded-full border-4 border-orange-500 overflow-hidden cursor-pointer group transition duration-300"
          >
            <img
              src={preview || profile?.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover group-hover:opacity-60 transition duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-40 text-sm font-medium">
              Change
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              hidden
            />

            {file && (
              <button
                type="submit"
                disabled={isUploadingAvatar}
                className="bg-blue-600 hover:bg-blue-700 transition duration-300 px-4 py-2 rounded text-white font-semibold"
              >
                {isUploadingAvatar ? "Uploading..." : "Upload Avatar"}
              </button>
            )}
          </form>

          {profile.role?.toUpperCase() === "ADMIN" && (
            <span className="absolute -bottom-3 px-3 py-1 text-sm bg-red-600 text-white rounded-full shadow-md font-inter">
              ADMIN
            </span>
          )}
          {profile.role?.toUpperCase() === "USER" && (
            <span className="absolute -bottom-3 px-3 py-1 text-sm bg-red-600 text-white rounded-full shadow-md font-inter">
              USER
            </span>
          )}
        </div>

        <div className="space-y-4 text-lg md:text-xl font-[Inter]">
          <p>
            <span className="font-semibold">Username:</span> {profile.username}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {profile.role}
          </p>
          <p>
            <span className="font-semibold">Verify Email:</span>{" "}
            <span
              className={
                profile.isEmailVerification ? "text-green-500" : "text-red-500"
              }
            >
              {profile.isEmailVerification ? "Yes" : "No"}
            </span>
          </p>
          <p>
            <span className="font-semibold">Total Submissions:</span>{" "}
            {submissionCount ?? submissions.length}
          </p>
        </div>
      </div>

      {/* Submission History */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-xl md:text-3xl mb-8 font-bold font-inter">
            Submission History
          </h2>
          <div className="space-y-4">
            {submissions.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg font-lexend shadow-md p-4 cursor-pointer transition-all dark:bg-gray-800 dark:text-white"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3
                    className={`p-2 font-semibold mb-8 ${
                      faq.status === "Accepted" ? "bg-green-600" : "bg-red-500"
                    } text-white rounded-md`}
                  >
                    {faq.status}
                  </h3>
                  <h3 className="mb-8">{faq.language}</h3>
                  <h3 className="mb-8">
                    {new Date(faq.createdAt).toLocaleString()}
                  </h3>
                  <span className="text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <>
                    <Editor
                      height="300px"
                      theme="vs-dark"
                      value={faq.sourceCode}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 font-inter">
                          Stdin
                        </h3>
                        <p>{faq.stdin}</p>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 font-inter">
                          Stdout
                        </h3>
                        <p>{faq.stdout}</p>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 font-inter">
                          Memory
                        </h3>
                        {JSON.parse(faq.memory).map((mem, idx) => (
                          <p key={idx}>
                            Test {idx + 1}: {mem}
                          </p>
                        ))}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 font-inter">
                          Time
                        </h3>
                        {JSON.parse(faq.time).map((time, idx) => (
                          <p key={idx}>
                            Test {idx + 1}: {time}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Stats */}
      <div className="mt-4 grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-2xl">
          <h3 className="font-bold text-2xl mb-2 font-lexend">
            Total Problem Solve
          </h3>
          <p className="text-xl font-inter">
            {solvedProblemsCount?.count || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-2xl">
          <h3 className="font-bold text-2xl mb-2 font-lexend">Accuracy</h3>
          <p className="text-xl font-inter">{accuracy?.accuracy || 0}</p>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="mt-16">
        <h2 className="text-center text-xl md:text-3xl mb-8 font-bold font-inter">
          Your Playlists
        </h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400 font-lexend">
            You don't have any playlists yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="p-5 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-orange-400 font-lexend">
                  {playlist.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 font-inter">
                  {playlist.description}
                </p>
                <p className="text-sm text-gray-400 mt-1 font-inter">
                  Created: {new Date(playlist.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500 font-inter">
                  Problems: {playlist.problems?.length || 0}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/playlists/${playlist.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-inter"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-inter"
                  >
                    Delete
                  </button>

                  {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white font-inter">
                          Confirm Deletion
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 font-inter">
                          Are you sure you want to delete this playlist?
                        </p>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 font-inter"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              deletePlaylist(playlist.id);
                              setShowModal(false);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-inter"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
