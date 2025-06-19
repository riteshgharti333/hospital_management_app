import express from "express";
import {
  createBedAssignmentRecord,
  getAllBedAssignmentRecords,
  getBedAssignmentRecordById,
  updateBedAssignmentRecord,
  dischargePatientFromBed,
  deleteBedAssignmentRecord,
} from "../controllers/BedAssignController";

const router = express.Router();

router.route("/")
  .post(createBedAssignmentRecord)
  .get(getAllBedAssignmentRecords);

router.route("/:id")
  .get(getBedAssignmentRecordById)
  .put(updateBedAssignmentRecord)
  .delete(deleteBedAssignmentRecord);

router.post("/:id/discharge", dischargePatientFromBed);

export default router;