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
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createPatientRecord)
  .get(getAllPatientRecords);

router.get("/search", searchPatientResults);

router.get("/filter", filterPatients);


router
  .route("/:id")
  .get(getPatientRecordById)
  .put(isAuthenticated, isAdmin, updatePatientRecord)
  .delete(isAuthenticated, isAdmin, deletePatientRecord);

export default router;
