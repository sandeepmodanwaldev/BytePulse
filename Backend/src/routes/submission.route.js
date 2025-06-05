import { Router } from "express";
import {
  getAllSubmission,
  getSubmissionById,
  getSubmissionCount,
  getSubmissionForAllAcceptedProblem,
} from "../controller/submission.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const route = Router();

route.get("/get-all-submission", isLoggedIn, getAllSubmission);
route.get("/get-submission/:problemId", isLoggedIn, getSubmissionById);
route.get("/get-submission-count/:problemId", isLoggedIn, getSubmissionCount);
route.get(
  "/get-submission-count-all-accepted-problem/:problemId",
  isLoggedIn,
  getSubmissionForAllAcceptedProblem
);
export default route;
