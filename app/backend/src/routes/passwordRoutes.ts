import express from "express";
import {
  changePasswordLoggedIn,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
  
} from "../controllers/PasswordController";
import { authenticateUser } from "../middlewares/authenticate";
const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post(
  "/change-password",
  authenticateUser,
  changePasswordLoggedIn
);


export default router;
