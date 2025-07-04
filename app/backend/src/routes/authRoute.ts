import express from "express";
import { register, login, logout, refreshAccessToken, getMyProfile, updateProfile, changePassword } from "../controllers/AuthController";
import { authLimiter } from "../middlewares/rateLimiter";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/register", register);

router.post("/login", authLimiter, login);

router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);

router.get("/profile" , isAuthenticated, getMyProfile);
router.put("/update-profile" , isAuthenticated, updateProfile);
router.put("/change-password" , isAuthenticated, changePassword);




export default router;
