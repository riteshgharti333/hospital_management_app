import { Router } from "express";
import {
  getUserByRegIdController,
  loginUserController,
  setNewPasswordController,
} from "../controllers/AuthController";

const router = Router();

router.post("/identify", getUserByRegIdController);      // Step 1
router.post("/login", loginUserController);              // Step 2
router.post("/set-password", setNewPasswordController);  // Step 3

export default router;
