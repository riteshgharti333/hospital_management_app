import express from "express";
import {
  createDoctorRecord,
  getAllDoctorRecords,
  getDoctorRecordById,
  updateDoctorRecord,
  deleteDoctorRecord,
  searchDoctorResults,
  filterDoctors
} from "../controllers/DoctorController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createDoctorRecord)
  .get(getAllDoctorRecords);

router.get("/search", searchDoctorResults);

router.get("/filter", filterDoctors);

router
  .route("/:id")
  .get(getDoctorRecordById)
  .patch(isAuthenticated, isAdmin, updateDoctorRecord)
  .delete(isAuthenticated, isAdmin, deleteDoctorRecord);

export default router;
