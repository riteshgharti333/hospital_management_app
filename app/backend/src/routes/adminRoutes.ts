import express from "express";
import { giveDoctorAccess } from "../controllers/adminUserController";
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

router.post(
  "/doctor/create-access",
  authenticateUser,
  authorizeRoles("ADMIN"),
  giveDoctorAccess
);

export default router;
