import { db } from "../libs/db.js";

// Create comment
export const createComment = async (req, res) => {
  try {
    const { discussionId, content, parentId } = req.body;
    const userId = req.user.id;

    const comment = await db.comment.create({
      data: {
        discussionId,
        content,
        parentId: parentId || null,
        userId,
      },
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    console.error("Create Comment Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get comments
export const getComments = async (req, res) => {
  try {
    const { discussionId } = req.params;

    const comments = await db.comment.findMany({
      where: { discussionId, parentId: null },
      include: {
        user: { select: { username: true } },
        replies: {
          include: { user: { select: { username: true } } },
        },
      },
    });

    res.status(200).json({ success: true, comments });
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment || comment.userId !== userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await prisma.comment.delete({ where: { id } });

  res.json({ message: "Comment deleted successfully" });
};
