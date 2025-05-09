import { Router } from "express";
import { isLoggedIn, ckeckAdmin } from "../middleware/auth.middleware.js";
import {
  createProblem,
  getAllProblem,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemSolveByUser,
} from "../controller/problem.controller.js";
const route = Router();

route.post("/create-problem", isLoggedIn, ckeckAdmin, createProblem);
route.get("/get-all-problem", isLoggedIn, getAllProblem);
route.get("/get-problem/:id", isLoggedIn, getProblemById);
route.put("/update-problem/:id", isLoggedIn, ckeckAdmin, updateProblem);
route.delete("/detele-problem/:id", isLoggedIn, ckeckAdmin, deleteProblem);
route.get("/get-solved_problems", isLoggedIn, getAllProblemSolveByUser);
export default route;
