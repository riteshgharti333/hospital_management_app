import express from "express";
import {
  createDoctorRecord,
  getAllDoctorRecords,
  getDoctorRecordById,
  updateDoctorRecord,
  deleteDoctorRecord,
  searchDoctorResults,
  filterDoctors,
} from "../controllers/DoctorController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";
import { authorizeRoles } from "../middlewares/authorize";
import { authenticateUser } from "../middlewares/authenticate";

const router = express.Router();

router.post(
  "/create", 
  authenticateUser,
  authorizeRoles("ADMIN"), 
  createDoctorRecord
);

// GET request to: /api/doctors/list
router.get("/", getAllDoctorRecords);

router.get("/search", searchDoctorResults);

router.get("/filter", filterDoctors);

router
  .route("/:id")
  .get(getDoctorRecordById)
  .patch(isAuthenticated, isAdmin, updateDoctorRecord)
  .delete(isAuthenticated, isAdmin, deleteDoctorRecord);

export default router;
