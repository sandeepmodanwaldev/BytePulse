import { Router } from "express";
import { isLoggedIn, checkAdmin } from "../middleware/auth.middleware.js";
import {
  createProblem,
  getAllProblem,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemSolveByUser,
  getSolvedProblemCount,
  getAccuracy,
} from "../controller/problem.controller.js";
const route = Router();

route.post("/create-problem", isLoggedIn, checkAdmin, createProblem);
route.get("/get-all-problem", isLoggedIn, getAllProblem);
route.get("/get-accuracy", isLoggedIn, getAccuracy);
route.get("/get-problem/:id", isLoggedIn, getProblemById);
route.put("/update-problem/:id", isLoggedIn, checkAdmin, updateProblem);
route.delete("/detele-problem/:id", isLoggedIn, checkAdmin, deleteProblem);
route.get("/get-solved-problem", isLoggedIn, getAllProblemSolveByUser);
route.get("/get-solved-problem-count", isLoggedIn, getSolvedProblemCount);
export default route;
