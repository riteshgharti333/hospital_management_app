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

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE
router.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  createDoctorRecord
);

// LIST
router.get("/", getAllDoctorRecords);

// SEARCH & FILTER
router.get("/search", searchDoctorResults);
router.get("/filter", filterDoctors);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getDoctorRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateDoctorRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"), 
    deleteDoctorRecord
  );

export default router;
