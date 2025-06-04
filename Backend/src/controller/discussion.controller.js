import { db } from "../libs/db.js";

// Create a new discussion
export const createDiscussion = async (req, res) => {
  try {
    const { problemId, title, content } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized request" });
    }

    if (!problemId || !title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const discussion = await db.discussion.create({
      data: {
        problemId,
        userId,
        title,
        content,
      },
    });

    res.status(201).json({ success: true, discussion });
  } catch (err) {
    console.error("Create Discussion Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all discussions for a problem
export const getDiscussionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const discussions = await db.discussion.findMany({
      where: { problemId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        comments: {
          where: { parentId: null },
          include: {
            user: { select: { id: true, username: true } },
            replies: {
              include: {
                user: { select: { id: true, username: true } },
              },
            },
          },
        },
      },
    });

    res.status(200).json({ success: true, discussions });
  } catch (err) {
    console.error("Get Discussions Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteDiscussion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // from auth middleware

  const discussion = await prisma.discussion.findUnique({ where: { id } });

  if (!discussion || discussion.userId !== userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await prisma.discussion.delete({ where: { id } });

  res.json({ message: "Discussion deleted successfully" });
};
