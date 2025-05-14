import { ApiError } from "../libs/api-error.js";
import { ApiResponse } from "../libs/api-response.js";
import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User id not found"));
  }

  try {
    const playlist = await db.playlist.create({
      data: {
        userId,
        name,
        description,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist created successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Failed to create playlist", error.message));
  }
};

export const getAllListDetail = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User id not found"));
  }

  try {
    const playlists = await db.playlist.findMany({
      where: { userId },
      include: {
        problems: {
          include: { problem: true },
        },
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Failed to fetch playlists", error.message));
  }
};

export const getPlayListDetails = async (req, res) => {
  const userId = req.user.id;
  const { playlistId } = req.params;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User id not found"));
  }

  try {
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
      include: {
        problems: {
          include: { problem: true },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json(new ApiError(404, "Playlist not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Failed to fetch playlist", error.message));
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const userId = req.user.id;
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  console.log(problemIds);

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User id not found"));
  }

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid or missing problemIds"));
  }

  try {
    const added = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, added, "Problems added to playlist successfully")
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Failed to add problems to playlist", error.message)
      );
  }
};

export const deletePlaylist = async (req, res) => {
  const userId = req.user.id;
  const { playlistId } = req.params;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User id not found"));
  }

  try {
    const deleted = await db.playlist.delete({
      where: { id: playlistId },
    });

    res
      .status(200)
      .json(new ApiResponse(200, deleted, "Playlist deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Failed to delete playlist", error.message));
  }
};

export const deleteProblemFromPlaylist = async (req, res) => {
  const userId = req.user.id;
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User id not found"));
  }

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid or missing problemIds"));
  }

  try {
    const deleted = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleted,
          "Problems deleted from playlist successfully"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(
          500,
          "Failed to delete problems from playlist",
          error.message
        )
      );
  }
};
