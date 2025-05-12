import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { executeCode } from "../controller/executeCode.controller.js";
const route = Router();

route.post("/", isLoggedIn, executeCode);
export default route;
