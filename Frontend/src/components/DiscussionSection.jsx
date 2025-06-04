import { useEffect, useState } from "react";
import { useDiscussionStore } from "../store/discussionStore";
import ReactMarkdown from "react-markdown";
import Avatar from "./Avatar.jsx";
import timeAgo from "../libs/timeAgo.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { SendHorizontal, SendHorizontalIcon } from "lucide-react";
export default function DiscussionSection({ problemId }) {
  const {
    discussions,
    isLoading,
    fetchDiscussions,
    createDiscussion,
    createComment,
    deleteDiscussion,
    deleteComment,
  } = useDiscussionStore();
  const { authUser } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchDiscussions(problemId);
  }, [problemId]);

  const handleDiscussionSubmit = async () => {
    if (!title || !content) return;
    await createDiscussion({ title, content, problemId });
    setTitle("");
    setContent("");
    fetchDiscussions(problemId);
  };

  const handleCommentSubmit = async (discussionId) => {
    const content = commentInputs[discussionId];
    if (!content) return;
    await createComment({ content, discussionId });
    setCommentInputs((prev) => ({ ...prev, [discussionId]: "" }));
    fetchDiscussions(problemId);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* New Discussion Form */}
      <div className="bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-700  rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-2 font-inter text-black dark:text-white">
          New Discussion
        </h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input  w-full mb-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-400  dark:border-gray-700 font-lexend shadow-2xl"
        />
        <textarea
          placeholder="Content "
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea w-full mb-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-400  dark:border-gray-700 font-lexend shadow-2xl"
        />
        <button
          onClick={handleDiscussionSubmit}
          className="btn btn-primary font-inter"
        >
          Post
        </button>
      </div>

      {/* Discussions */}
      {isLoading ? (
        <p>Loading discussions...</p>
      ) : (
        discussions.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2 justify-between">
              <div className="flex gap-2">
                <Avatar username={d.user.username} src={d.user.avatar} />
                <span className="font-semibold font-inter text-black dark:text-white">
                  {d.user.username}
                </span>
                <span className="text-sm text-gray-500 font-inter ">
                  {timeAgo(d.createdAt)}
                </span>
              </div>
              <div>
                {" "}
                {authUser?.id === d.user.id && (
                  <button
                    className="rounded text-xs px-2 py-1 text-white bg-red-500 ml-2"
                    onClick={async () => {
                      await deleteDiscussion(d.id);
                      fetchDiscussions(problemId);
                    }}
                  >
                    Delete
                  </button>
                )}{" "}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-bold text-sm dark:prose-invert font-lexend text-gray-800 dark:text-gray-400   flex flex-col   p-2 align-middle items-start pl-6   ">
                {d.title}
              </h4>
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      className="prose text-sm  dark:prose-invert text-gray-800 dark:text-gray-400   flex flex-col   p-2 align-middle items-start pl-6    border-b-[1px]  pb-2"
                      {...props}
                    />
                  ),
                }}
              >
                {d.content}
              </ReactMarkdown>
            </div>
            {/* Comments */}
            <div className="mt-4 space-y-2">
              {d.comments.map((c) => (
                <div key={c.id} className="border-l pl-4 border-gray-300">
                  <div className="flex items-center gap-2 mb-1 justify-between">
                    <div className="flex gap-2">
                      <Avatar
                        username={c.user.username}
                        src={c.user.avatar}
                        size="sm"
                      />
                      <span className="font-medium text-sm text-gray-400">
                        {c.user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <div>
                      {authUser?.id === c.user.id && (
                        <button
                          className="rounded text-xs px-2 py-1 text-white bg-red-500 ml-2"
                          onClick={async () => {
                            await deleteComment(c.id);
                            fetchDiscussions(problemId);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-sm prose dark:prose-invert text-gray-800 dark:text-gray-400  border flex flex-col border-gray-200 dark:border-gray-700 p-2 align-middle items-start pl-6 rounded-lg"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {c.content}
                  </ReactMarkdown>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={commentInputs[d.id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [d.id]: e.target.value,
                  }))
                }
                placeholder="Write a comment..."
                className="input w-full mb- bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-400  dark:border-gray-700 font-lexend shadow-2xl"
              />
              <button
                className="btn btn-sm btn-outline bg-primary py-4"
                onClick={() => handleCommentSubmit(d.id)}
              >
                <SendHorizontalIcon />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
