import express from "express";
import { Router } from "express";
import {
  createDiscussion,
  getDiscussionsByProblem,
  deleteDiscussion,
} from "../controller/discussion.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", isLoggedIn, createDiscussion);
router.get("/:problemId", getDiscussionsByProblem);
router.delete("/delete/:id", isLoggedIn, deleteDiscussion);

export default router;
