import { Router } from "express";
import {
  registration,
  verifyEmail,
  login,
  profile,
  logout,
  forgotPassword,
  resetPassword,
} from "../controller/auth.controller.js";
import {
  userRegistrationValidator,
  userLoginValidator,
  forgotPasswordRequestValidator,
  forgotPasswordValidator,
} from "../validator/index.js";
import { validator } from "../middleware/validator.middleware.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", userRegistrationValidator(), validator, registration);
router.get("/verify/:emailVerificationToken", verifyEmail);
router.post("/login", userLoginValidator(), validator, login);
router.get("/profile", isLoggedIn, profile);
router.get("/logout", isLoggedIn, logout);
router.post(
  "/request-forgot-password",
  forgotPasswordRequestValidator(),
  validator,
  forgotPassword
);
router.post(
  "/forgot-password/:token",
  forgotPasswordValidator(),
  validator,
  resetPassword
);

export default router;
