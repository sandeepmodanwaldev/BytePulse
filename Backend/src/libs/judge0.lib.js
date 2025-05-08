import axios from "axios";
import { ApiError } from "./api-error.js";

const baseUrl = process.env.JUDGE0_BASE_URL || "http://localhost:2358";
console.log("Base URL:", baseUrl);

export const getJudge0LanguageId = async (language) => {
  try {
    const { data } = await axios.get(`${baseUrl}/languages`);

    const languageMap = data.reduce((acc, lang) => {
      const key = lang.name.split(" ")[0].toUpperCase();
      acc[key] = lang.id;
      return acc;
    }, {});

    return languageMap[language.toUpperCase()];
  } catch (error) {
    throw new ApiError(500, "Judge0 language fetch error", error.message);
  }
};

export const submitBatch = async (submissions) => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      }
    );
    console.log("Submission Rusults :", data);

    return data;
  } catch (error) {
    new ApiError(500, "Submission Betch Error", error.message);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(`${baseUrl}/submissions/batch`, {
      params: {
        tokens: tokens.join(","),
        base64_encoded: false,
      },
    });

    const results = data.submissions;

    const isAllDone = results.every((r, i) => {
      if (!r || !r.status) {
        console.warn(`Invalid submission at index ${i}:`, r);
        return false;
      }
      return r.status.id !== 1 && r.status.id !== 2;
    });

    if (isAllDone) return results;
    await sleep(1000);
  }
};
