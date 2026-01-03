import express from "express";
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";
import {
  createStaffAccess,
  deleteUserRecord,
  getAllUsers,
  regenerateStaffTempPassword,
  toggleStaffAccess,
} from "../controllers/AdminUserController";

const router = express.Router();

router.post(
  "/staff/create-access",
  authenticateUser,
  authorizeRoles("ADMIN"),
  createStaffAccess
);

router.post(
  "/staff/toggle-access",
  authenticateUser,
  authorizeRoles("ADMIN"),
  toggleStaffAccess
);

router.post(
  "/staff/regenerate-temp-password",
  authenticateUser,
  authorizeRoles("ADMIN"),
  regenerateStaffTempPassword
);

router.delete(
  "/staff/:regId",
  authenticateUser,
  authorizeRoles("ADMIN"),
  deleteUserRecord
);



export default router;

router.get("/staff", authenticateUser, authorizeRoles("ADMIN"), getAllUsers);
