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
      console.log("Submissions :", submissions);

      const submissionResults = await submitBatch(submissions);
      console.log("SubmissionResults :", submissionResults);

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
export const getAllProblem = (req, res) => {};
export const getProblemById = (req, res) => {};
export const updateProblem = (req, res) => {};
export const deleteProblem = (req, res) => {};
export const getAllProblemSolveByUser = (req, res) => {};
