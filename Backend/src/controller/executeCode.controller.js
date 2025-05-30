import { db } from "../libs/db.js";
import { ApiError } from "../libs/api-error.js";
import { ApiResponse } from "../libs/api-response.js";
import {
  getJudge0LanguageNameById,
  submitBatch,
  pollBatchResults,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }
  try {
    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length == 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid or Missing test cases"));
    }
    // 2. Prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // 3. Send batch of submissions to judge0

    const submitResponse = await submitBatch(submissions);

    // 4. Poll the results from judge0
    const tokens = submitResponse.map((s) => s.token);

    const results = await pollBatchResults(tokens);

    console.log("Result-------------");
    // console.log(results);

    //  Analyze test case results

    let allPassed = true;
    const detailResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;
      if (!passed) {
        allPassed = false;
      }

      // console.log("stdout :", stdout, "expected_output :", expected_output);
      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });
    console.log("detailResults", detailResults);

    const language = await getJudge0LanguageNameById(language_id);
    console.log("language", language);

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: language,
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailResults.map((r) => r.stdout)),
        stderr: detailResults.some((r) => r.stderr)
          ? JSON.stringify(detailResults.map((r) => r.stderr))
          : null,
        compileOutput: detailResults.some((r) => r.compile_output)
          ? JSON.stringify(detailResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailResults.some((r) => r.memory)
          ? JSON.stringify(detailResults.map((r) => r.memory))
          : null,
        time: detailResults.some((r) => r.time)
          ? JSON.stringify(detailResults.map((r) => r.time))
          : null,
      },
    });

    console.log("submission", submission);

    // If All passed = true mark problem as solved for the current user
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }
    // 8. Save individual test case results  using detailedResult

    const testCaseResults = detailResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    console.log("testCaseResults", testCaseResults);
    await db.testCasesResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testcases: true,
      },
    });
    //
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          submissionWithTestCase,
          "Code Executed Successfully"
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "Error Executing Code", error.message));
  }
};

export const runCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs } = req.body;

  try {
    // Validate input
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid or Missing test cases"));
    }

    // Prepare submissions
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // Submit and poll results
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((s) => s.token);
    const results = await pollBatchResults(tokens);

    // Analyze result
    let allPassed = true;
    const detailResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;
      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    const language = await getJudge0LanguageNameById(language_id);

    const testCaseResults = detailResults.map((result) => ({
      submissionId: null,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          language,
          allPassed,
          detailResults,
          testcases: testCaseResults,
        },
        "Code Executed Successfully (Not Saved)"
      )
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Error Executing Code", error.message));
  }
};
