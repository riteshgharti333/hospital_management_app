import express from "express";
import {
  createBedAssignmentRecord,
  getAllBedAssignmentRecords,
  getBedAssignmentRecordById,
  updateBedAssignmentRecord,
  dischargePatientFromBed,
  deleteBedAssignmentRecord,
} from "../controllers/BedAssignController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createBedAssignmentRecord)
  .get(getAllBedAssignmentRecords);

router
  .route("/:id")
  .get(getBedAssignmentRecordById)
  .put(isAuthenticated, isAdmin, updateBedAssignmentRecord)
  .delete(isAuthenticated, isAdmin, deleteBedAssignmentRecord);

router.post(
  "/:id/discharge",
  isAuthenticated,
  isAdmin,
  dischargePatientFromBed
);

export default router;
