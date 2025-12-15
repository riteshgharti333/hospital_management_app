import { Router } from "express";
import {
  getProfile,
  getUserByRegIdController,
  loginUserController,
  logoutUser,
  refreshAccessTokenController,
  setNewPasswordController,
  updateProfile,
} from "../controllers/AuthController";
import { authenticateUser } from "../middlewares/authenticate";

const router = Router();

router.post("/refresh-token", refreshAccessTokenController);

router.post("/identify", getUserByRegIdController); // Step 1
router.post("/login", loginUserController); // Step 2
router.post("/set-password", setNewPasswordController); // Step 3


router.get("/profile", authenticateUser, getProfile);
router.put("/profile/update", authenticateUser, updateProfile);
router.post("/logout", authenticateUser, logoutUser);

export default router;
