import { Router } from "express";
import {
  registration,
  verifyEmail,
  login,
  profile,
  logout,
  forgotPassword,
  resetPassword,
  refeshToken,
  checkuser,
  uploadAvatar,
} from "../controller/auth.controller.js";
import {
  userRegistrationValidator,
  userLoginValidator,
  forgotPasswordRequestValidator,
  forgotPasswordValidator,
} from "../validator/index.js";
import { validator } from "../middleware/validator.middleware.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import avatarUpload from "../middleware/multer.middleware.js";
const router = Router();

router.post("/register", userRegistrationValidator(), validator, registration);
router.get("/verify/:emailVerificationToken", verifyEmail);
router.post("/login", userLoginValidator(), validator, login);
router.get("/profile", isLoggedIn, profile);
router.get("/logout", isLoggedIn, logout);
router.get("/check", isLoggedIn, checkuser);
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
router.get("/refeshToken", refeshToken);
router.put(
  "/profile/avatar",
  isLoggedIn,
  avatarUpload.single("avatar"),
  uploadAvatar
);

export default router;
