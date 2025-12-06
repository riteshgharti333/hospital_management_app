import express from "express";
import {
  createPatientRecord,
  getAllPatientRecords,
  getPatientRecordById,
  updatePatientRecord,
  deletePatientRecord,
  searchPatientResults,
  filterPatients,
  getPatientAnalyticsRecord,
  getPatientAgeDistributionRecord,
} from "../controllers/PatientController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createPatientRecord)
  .get(getAllPatientRecords);

router.get("/search", searchPatientResults);

router.get("/filter", filterPatients);

router.get("/analytics", getPatientAnalyticsRecord);
router.get("/analytics/age-distribution", getPatientAgeDistributionRecord);

router
  .route("/:id")
  .get(getPatientRecordById)
  .put(isAuthenticated, isAdmin, updatePatientRecord)
  .delete(isAuthenticated, isAdmin, deletePatientRecord);

export default router;
