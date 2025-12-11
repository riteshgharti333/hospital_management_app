import express from "express";
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";
import {
  createStaffAccess,
  getAllUsers,
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


router.get(
  "/staff",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getAllUsers
);


export default router;
