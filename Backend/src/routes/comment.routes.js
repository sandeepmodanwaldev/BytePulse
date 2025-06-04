import express from "express";
import { Router } from "express";
import {
  createComment,
  getComments,
  deleteComment,
} from "../controller/comment.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/", isLoggedIn, createComment);
router.get("/:discussionId", getComments); // Optional route
router.delete("/delete/:id", isLoggedIn, deleteComment);
export default router;
