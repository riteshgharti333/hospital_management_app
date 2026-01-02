import express from "express";
import {
  createPatientRecord,
  getAllPatientRecords,
  getPatientRecordById,
  updatePatientRecord,
  deletePatientRecord,
  searchPatientResults,
  filterPatients,
} from "../controllers/PatientController";
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(authenticateUser, authorizeRoles("ADMIN"), createPatientRecord)
  .get(getAllPatientRecords);

// SEARCH & FILTER
router.get("/search", searchPatientResults);
router.get("/filter", filterPatients);

// GET / UPDATE / DELETE BY ID
router
  .route("/:id")
  .get(getPatientRecordById)
  .put(authenticateUser, authorizeRoles("ADMIN"), updatePatientRecord)
  .delete(authenticateUser, authorizeRoles("ADMIN"), deletePatientRecord);

export default router;
