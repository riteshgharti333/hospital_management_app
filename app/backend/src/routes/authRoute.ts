import { Router } from "express";
import {
  changePasswordController,
  getProfile,
  getUserByRegIdController,
  loginUserController,
  logoutUser,
  refreshAccessTokenController,
  setNewPasswordController,
  updateProfile,
} from "../controllers/AuthController";
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = Router();
 
router.post("/refresh-token", refreshAccessTokenController);   

router.post("/identify", getUserByRegIdController); // Step 1
router.post("/login", loginUserController); // Step 2
router.post("/set-password", setNewPasswordController);
       
router.put("/change-password", authenticateUser, changePasswordController);

router.get("/profile", authenticateUser, getProfile);
router.post("/logout", authenticateUser, logoutUser);             

router.put(
  "/profile/update",    
  authenticateUser,
  authorizeRoles("ADMIN"),
  updateProfile
);

export default router;
