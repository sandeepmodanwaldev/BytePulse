import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { executeCode, runCode } from "../controller/executeCode.controller.js";
const route = Router();

route.post("/submit", isLoggedIn, executeCode);
route.post("/run", isLoggedIn, runCode);
export default route;
