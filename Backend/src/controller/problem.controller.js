import { ApiError } from "../libs/api-error.js";
import { ApiResponse } from "../libs/api-response.js";
import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolution,
  } = req.body;
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json(new ApiError(400, "You are not allow to create a problem"));
  }

  try {
    if (!referenceSolution || typeof referenceSolution !== "object") {
      return res
        .status(400)
        .json(new ApiError(400, "referenceSolution is missing or invalid"));
    }

    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = await getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json(new ApiError(400, `language is not supported :${language}`));
      }
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Results ------", result);

        if (result.status.id !== 3) {
          return res
            .status(400)
            .json(
              new ApiError(
                400,
                `Testcase ${i + 1} fails for language ${language}`
              )
            );
        }
      }
    }
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolution,
        userId: req.user.id,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newProblem, "Problem create Successfully"));
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json(new ApiError(500, "Problem create Error", error.message));
  }
};
export const getAllProblem = async (req, res) => {
  try {
    const allProblem = await db.problem.findMany();
    if (!allProblem) {
      return res.status(404).json(new ApiError(404, "No Problem found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, allProblem, "Problem fetch Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error fetching AllProblem", error.message));
  }
};
export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const getProblemById = await db.problem.findUnique({
      where: {
        id: id,
      },
    });

    if (!getProblemById) {
      return res.status(404).json(new ApiError(404, "Problem Not Found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, getProblemById, "Problem Fetch"));
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json(new ApiError(500, "Error Fetching Problem", error.message));
  }
};
export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolution,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json(new ApiError(403, "Yor are not allow to update problem"));
  }
  try {
    if (!id) {
      return res.status(404).json(new ApiError(404, "invalid id"));
    }

    if (!referenceSolution || typeof referenceSolution !== "object") {
      return res
        .status(400)
        .json(new ApiError(400, "referenceSolution is missing or invalid"));
    }
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = await getJudge0LanguageId(language);
      console.log("Language Id", languageId);

      if (!languageId) {
        return res
          .status(400)
          .json(new ApiError(400, `language is not supported :${language}`));
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      // console.log("Submission Results", submissionResults);

      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);
      console.log("Results------------", results);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json(
              new ApiError(
                400,
                `Testcase ${i + 1} fails for language ${language}`
              )
            );
        }
      }
    }
    const updatedProblem = await db.problem.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolution,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProblem, "Problem update Successfully")
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error Fetching Problem", error.message));
  }
};
export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json(new ApiError(403, "Yor are not allow to delete problem"));
  }
  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }

    const deletedProblem = await db.problem.delete({
      where: {
        id: id,
      },
    });
    console.log("deletedProblem", deletedProblem);

    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedProblem, "Problem deleted Successfully")
      );
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json(new ApiError(500, "Error Fetching Problem", error.message));
  }
};
export const getAllProblemSolveByUser = async (req, res) => {
  
};
