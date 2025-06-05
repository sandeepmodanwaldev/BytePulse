import { all } from "axios";
import { ApiError } from "../libs/api-error.js";
import { ApiResponse } from "../libs/api-response.js";
import { db } from "../libs/db.js";
export const getAllSubmission = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json(new ApiError(400, "Unauthorized request"));
  }
  try {
    const allSubmission = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, allSubmission, "Submission fetched successfully")
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error fetching submission", error.message));
  }
};
export const getSubmissionById = async (req, res) => {
  const userId = req.user.id;
  const problemId = req.params.problemId;
  if (!userId) {
    return res.status(400).json(new ApiError(400, "Unauthorized request"));
  }
  try {
    const submission = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, submission, "Submission fetched successfully")
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error fetched submission", error.message));
  }
};
export const getSubmissionCount = async (req, res) => {
  const userId = req.user.id;
  const problemId = req.params.problemId;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "Unauthorized request"));
  }
  try {
    const submission = await db.submission.count({
      where: {
        // userId: userId,
        problemId: problemId,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          submission,
          "Submission count fetched successfully"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error fetched submission count", error.message));
  }
};

export const getSubmissionForAllAcceptedProblem = async (req, res) => {
  const { problemId } = req.params;

  try {
    // Count total submissions for the given problem
    const totalCount = await db.submission.count({
      where: { problemId },
    });
    if (!problemId) {
      return res.status(400).json(new ApiError(400, "Problem ID is required"));
    }
    // Count accepted submissions for the given problem
    const acceptedCount = await db.submission.count({
      where: {
        problemId,
        status: "Accepted",
      },
    });

    // Send response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalCount: totalCount || 0,
          acceptedCount: acceptedCount || 0,
        },
        "All Accepted count fetch successfully "
      )
    );
  } catch (error) {
    console.log("error", error);

    res
      .status(500)
      .json(
        new ApiError(500, "Somthing wrong feaching in accpted problem", error)
      );
  }
};
